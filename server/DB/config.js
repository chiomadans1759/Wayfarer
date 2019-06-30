import { Pool } from 'pg';
import dotEnv from 'dotenv';

dotEnv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
});

pool.on('connect', () => {
  console.log('connected to the database');
});

export default pool;
