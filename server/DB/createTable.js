import db from './config';

// Create a table on the database for users
db.query(
  `CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    is_admin boolean NOT NULL,
    lastname varchar NOT NULL,
    firstname varchar NOT NULL,
    email text NOT NULL, 
    password varchar NOT NULL
)`,
  (err) => {
    if (err) {
      console.log('err1');
    }
  },
);

// Create a table for buses
db.query(
  `CREATE TABLE IF NOT EXISTS buses (
    id serial PRIMARY KEY,
    number_plate varchar NOT NULL,
    manufacturer varchar NOT NULL,
    model varchar NOT NULL,
    year varchar NOT NULL,
    capacity varchar NOT NULL
)`,
  (err) => {
    if (err) {
      console.log(err);
    }
  },
);

// Create a table for trips
db.query(
  `CREATE TABLE IF NOT EXISTS trips (
    id serial PRIMARY KEY,
    bus_id integer NOT NULL,
    origin varchar NOT NULL,
    destination varchar NOT NULL,
    trip_date timestamp NOT NULL,
    fare varchar NOT NULL,
    status integer DEFAULT 1
)`,
  (err) => {
    if (err) {
      console.log(err);
    }
  },
);

db.query(
  `CREATE TABLE IF NOT EXISTS bookings (
    id serial PRIMARY KEY,
    trip_id integer NOT NULL,
    user_id integer NOT NULL,
    created_on date NOT NULL
)`,
  (err) => {
    if (err) {
      console.log('err4');
    }
  },
);
