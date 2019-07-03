import bcrypt from 'bcrypt';
import db from './config';

// Seed an admin into the database
const hash = bcrypt.hashSync('omadamsel', 10);
db.query(
  'INSERT INTO users (email, firstname, lastname, password, is_admin) VALUES ($1, $2, $3, $4, $5) returning *', ['admin@gmail.com', 'admin', 'chioma', hash, true],
  (err) => {
    if (err) {
      console.log(err);
    }
  },
);
