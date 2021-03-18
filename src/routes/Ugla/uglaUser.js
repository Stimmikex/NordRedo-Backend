import express from 'express';
import { query } from '../../dataOut/utils.js'
import { requireAdminAuthentication } from '../../dataOut/login.js'
import ldap from 'ldapjs';
import { createUglaUser, updateUglaUser, deleteUglaUser } from './dataOut/uglaUser.js';

export const routerAdmin = express.Router();

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
routerAdmin.post('/add/user', requireAdminAuthentication, async (req, res) => {
    const bindDn = `uid=${req.body.username},ou=People,dc=hi,dc=is`;
    const client = ldap.createClient({
      url: 'ldaps://ldap.hi.is:636'
    });
    client.search(bindDn, (err, ldapRes) => {
      if(err) {
          res.send(err);
      }
      ldapRes.on('searchEntry', async (entry) => {
        const user = entry.object;
        newUser(user);
      });
      ldapRes.on('error', function() {
        res.status('400'); // status: Bad Request
        res.send('Þessi notandi er ekki til í uglunni.');
      });
    });

    /**
     * Checks if user exists in the Database.
     * @param  {String}   ugluName is the uglu username
     * @param  {Function} done     callback function
     * @return {Boolean}           true if user exists, false otherwise
     */
    function checkIfUserExists(ugluName) {
      // Database insert and user responce
      var q = "SELECT exists(SELECT 1 FROM "+
                  "Users WHERE username = $1) AS exists";
      var params = [ugluName];

      return query(q, params);
    }
    /**
     * This function is called when admins try to creata a new user.
     * If the new user violates constrains, a error 400 is sent back
     * to the client.
     * @param  {[type]} user [description]
     * @return {[type]}      [description]
     */
    function newUser(user) {
      if (checkIfUserExists(user.id === null)) {
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
      const ugluName = user.uid || '';
      const name = user.cn || '';
      const email = user.mail || '';
      const phone = user.telephoneNumber || '';
      const role_id = req.body.access_id || 1;

      createUglaUser(ugluName, role_id, name, email, phone);
    }
});

/**
 * Handles delete requests to admin/users
 * It reads data the user is to delete from the request body, constructs
 * the correct sql query string and deletes the user by id.
 * @param  {object} req    request object
 * @param  {object} res    response object
 */
 routerAdmin.delete('/', requireAdminAuthentication, async (req, res) => {
  const data = req.body;
  await deleteUglaUser(data.user_id);
});

/**
 * Handles put requests to admin/users.
 * It modifies access level on users.
 * @param  {object} req    request object
 * @param  {object} res    response object
 */
 routerAdmin.patch('/', requireAdminAuthentication, async (req, res) => {
  const data = req.body;
  await updateUglaUser(data.role_id, data.user_id);
});
