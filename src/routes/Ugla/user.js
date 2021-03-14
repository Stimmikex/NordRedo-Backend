var express = require('express');
var router = express.Router();
var dbUtils = require('../../utils/db-utils.js');
var bits = require('sqlbits'), DELETE = bits.DELETE;
var protection = require('../../utils/protection-utils.js');
var logger = require('../../utils/logger-utils').logger;

var ldap = require('ldapjs');


/**
 * Handles post requests to admin/users
 * It reads data from the request body,
 * queries rhi.is LDAP server
 * to check if the user exists in Ugla,
 * constructs the correct sql query string and
 * inserts a new user into the database.
 * @param  {object} req    request object
 * @param  {object} res    response object
 */
router.post('/add/user', protection.csrfProtection, function(req, res) {
    var bindDn = 'uid={uid},ou=People,dc=hi,dc=is'
        .replace('{uid}', req.body.username);
    var client = ldap.createClient({
      url: 'ldaps://ldap.hi.is:636'
    });
    client.search(bindDn, function(err, ldapRes) {
      if(err) {
          res.send(err);
      }
      ldapRes.on('searchEntry', function(entry) {
        var user = entry.object;
        newUser(user);
      });
      // ldapRes.on('searchReference', function(referral) {
      //   console.log('referral: ' + referral.uris.join());
      // });
      ldapRes.on('error', function() {
        res.status('400'); // status: Bad Request
        res.send('Þessi notandi er ekki til í uglunni.');
      });
      // ldapRes.on('end', function(result) {
      //   console.log('status: ' + result.status);
      // });
    });

    /**
     * Checks if user exists in the Database.
     * @param  {String}   ugluName is the uglu username
     * @param  {Function} done     callback function
     * @return {Boolean}           true if user exists, false otherwise
     */
    function checkIfUserExists(ugluName) {
      // Database insert and user responce
      var query = "SELECT exists(SELECT 1 FROM "+
                  "Users WHERE username = $1) AS exists";
      var params = [ugluName];

      dbUtils.queryDb(query, params);
    }
    /**
     * This function is called when admins try to creata a new user.
     * If the new user violates constrains, a error 400 is sent back
     * to the client.
     * @param  {[type]} user [description]
     * @return {[type]}      [description]
     */
    function newUser(user) {
      if (checkIfUserExists(user.uid === null)) {
          insertNewUser(user);
      } else {
        res.status('400'); // status: Bad Request
        res.send('Notandi er nú þegar til í gagnagrunni.');
      }
    }

    /**
     * Inserts a new user into the database with information from
     * rhi LDAP server.
     * @param  {Object} user is the hi user we get from the LDAP server.
     */
    function insertNewUser(user) {
      var ugluName = user.uid || '';
      var name = user.cn || '';
      var email = user.mail || '';
      var phone = user.telephoneNumber || '';
      // Defalt to non-privileged user
      req.body.access_id = req.body.access_id || 2;

      // VEIT EKKI AFHVERJU ÞETTA KLIKKAR...
      // var query = "WITH insUsers AS (INSERT INTO users "+
      //   "(username, password, access_id, date_joined, last_login, active, season_id) "+
      //     "VALUES ($1, '!', $2, $3, $3, true, $4) RETURNING id) "+
      //   "INSERT INTO profile (users_id, name, receive_sms, email1, phonenumber1) "+
      //   "SELECT insUsers.id, $5, true, $6, $7 FROM insUsers";
      // var params = [
      //   ugluName, req.body.access_id, new Date().toUTCString(),
      //   dbUtils.currentSeason, name, email, phone
      // ];

      // Database insert and user responce
     var query = "WITH insUsers AS (INSERT INTO users "+
       "(username, password, access_id, date_joined, last_login, active, season_id) "+
         "VALUES ('"+ugluName+"','!',"+parseInt(req.body.access_id)+", '"+
           new Date().toUTCString()+"', '"+new Date().toUTCString()+"', true, "+dbUtils.currentSeason+") RETURNING id)"+
       " INSERT INTO profile (users_id, name, receive_sms, email1, phonenumber1) SELECT insUsers.id, '"+
         name+"', true, '"+email+"', '"+phone+"' FROM insUsers";

      dbUtils.queryDb(query, null, function(err) {
        if(!err) {
          res.send('New user added successfully.');
        } else {
          logger.error(err.message, {
            ACTION: 'inserting new user into database',
            DIRECTORY: module.filename,
            NEW_USER: ugluName }
          );
        }
      });
    }
});

/**
 * Handles delete requests to admin/users
 * It reads data the user is to delete from the request body, constructs
 * the correct sql query string and deletes the user by id.
 * @param  {object} req    request object
 * @param  {object} res    response object
 */
router.delete('/', protection.csrfProtection, function(req, res) {

  var query = DELETE.FROM('profile')
                .WHERE('users_id=', req.body.userId)._(';')
              .DELETE.FROM('users')
                .WHERE('id=', req.body.userId);
  // var query = 'DELETE FROM profile WHERE users_id = $1; '+
  //             'DELETE FROM users WHERE id = $1';
  // var params = [req.body.userId];
  dbUtils.queryDb(query, null, function(err) {
    if(!err) {
      res.send('User was successfully deleted.');
      //TODO: logga hver er að deleta notendum?
    } else {
      //should never happen
      logger.error(err.message, {
        ACTION: 'deleting user',
        DIRECTORY: module.filename,
        DELETED_USER: req.body.userId,
        PERFORMED_BY: req.session.user.ugluName }
      );
      res.status(500);
      res.send('Villa kom upp.');
    }
  });
});

/**
 * Handles put requests to admin/users.
 * It modifies access level on users.
 * @param  {object} req    request object
 * @param  {object} res    response object
 */
router.put('/', protection.csrfProtection, function(req, res) {

  var query = "UPDATE users SET access_id = $1 WHERE id = $2";
  var params = [req.body.accessLvl, req.body.uId];

  dbUtils.queryDb(query, params, function(err) {
    if(!err) {
      res.send('User updated successfully');
    } else {
      //should never happen
      logger.error(err.message, {
        ACTION: 'updating user access_id',
        DIRECTORY: module.filename,
        UPDATED_USER: req.body.uId,
        ACCESS_ID: req.body.accessLvl }
      );
      res.status(500);
      res.send('Villa kom upp.');
    }
  });

});


module.exports = router;
