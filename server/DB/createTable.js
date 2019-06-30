import db from './config';

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
      console.log(err);
    }
  },
);
