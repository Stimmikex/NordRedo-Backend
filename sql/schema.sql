DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS event_types CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS signup_status CASCADE;
DROP TABLE IF EXISTS signup CASCADE;
DROP TABLE IF EXISTS government CASCADE;
DROP TABLE IF EXISTS ads CASCADE;
DROP TABLE IF EXISTS item_types CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS profile CASCADE;

CREATE TABLE IF NOT EXISTS roles (
    id serial primary key,
    name character varying(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY NOT NULL,
	username CHARACTER VARYING(255) NOT NULL,
	password CHARACTER VARYING(255) NOT NULL,
	role_id INTEGER NOT NULL,
	date_joined TIMESTAMP NOT NULL,
	last_login TIMESTAMP NOT NULL,
	active BOOLEAN NOT NULL,
    token TEXT, 
	UNIQUE (username),
	FOREIGN KEY (role_id) REFERENCES roles (id)
);

CREATE TABLE IF NOT EXISTS event_types (
    id serial primary key,
    name character varying(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
    id serial primary key,
    title character varying(255) NOT NULL,
    text TEXT,
    seats INTEGER,
    date DATE,
    startdate TIMESTAMP,
    enddate TIMESTAMP,
    location character varying(255) NOT NULL,
    rating INTEGER,
    user_id INTEGER,
    signup BOOLEAN,
    event_type_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (event_type_id) REFERENCES event_types (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS signup_status (
    id serial primary key,
    name character varying(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS signup (
    id serial primary key,
    signup_status_id INTEGER,
    user_id INTEGER,
    event_id INTEGER,
    FOREIGN KEY (signup_status_id) REFERENCES signup_status (id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (event_id) REFERENCES events (id),
);

CREATE TABLE IF NOT EXISTS government_type (
    id serial primary key,
    title character varying(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS government (
    id serial primary key,
    gov_type INTEGER,
    year character varying(255) NOT NULL,
    user_id INTEGER,
    FOREIGN KEY (gov_type) REFERENCES government_type (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS ads (
    id serial primary key,
    name character varying(255) NOT NULL,
    link character varying(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS item_types (
    id serial primary key,
    name character varying(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS items (
    id serial primary key,
    name character varying(255) NOT NULL,
    price INTEGER,
    image character varying(255) NOT NULL,
    text TEXT,
    quantity INTEGER,
    discount INTEGER,
    user_id INTEGER,
    type_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (type_id) REFERENCES item_types (id)
);

CREATE TABLE IF NOT EXISTS profile (
	username CHARACTER VARYING(255) NOT NULL,
	name CHARACTER VARYING(255),
	birthday DATE NULL,
	phonenumber1 CHARACTER VARYING(8) NULL,
	email1 CHARACTER VARYING(255) NULL,
	image CHARACTER VARYING(255) NULL,
	UNIQUE (username),
	PRIMARY KEY(username),
	FOREIGN KEY (username) REFERENCES Users(username)
);