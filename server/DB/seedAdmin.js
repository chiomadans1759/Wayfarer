import bcrypt from 'bcrypt';
import db from './config';

// Seed an admin into the database
const seedAdmin = async () => {
  try {
    const hash = bcrypt.hashSync('omadamsel', 10);
    const query = { text: 'select * from users where email = $1 LIMIT 1', values: ['admin@gmail.com'] };
    const result = await db.query(query);
    const user = result.rows;

    if (user.length < 1) {
      await db.query(
        'INSERT INTO users (email, first_name, last_name, password, is_admin) VALUES ($1, $2, $3, $4, $5) returning *', ['admin@gmail.com', 'admin', 'chioma', hash, true],
      );
      console.log('Admin seeded successfully');
    } else {
      console.log('Admin with these details already exists');
    }
  } catch (error) {
    console.log('Could not connect to the database');
  }
};
seedAdmin();
