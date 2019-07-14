import bcrypt from 'bcrypt';
import db from '../DB/config';
import auth from '../Middleware/auth';

export default class UserController {
/* Adds a new user */
  static async addUser(req, res) {
    try {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const query = {
        text:
          'insert into users (email, first_name, last_name, password, is_admin) values ($1, $2, $3, $4, $5) returning *',
        values: [req.body.email, req.body.first_name, req.body.last_name, hash, false],
      };

      const result = await db.query(query);
      const createdUser = result.rows[0];
      const userToken = auth.generateToken(createdUser);
      return res.status(201).json({
        status: 'success',
        data: {
          user_id: createdUser.id,
          is_admin: createdUser.is_admin,
          email: createdUser.email,
          first_name: createdUser.first_name,
          last_name: createdUser.last_name,
          token: userToken,
        },
      });
    } catch (error) {
      return res.status(500)
        .json({
          status: 'error',
          error: 'Server Error',
        });
    }
  }

  // Get all registered users
  static async getAllUsers(req, res) {
    try {
      const query = { text: 'select * from users' };
      const result = await db.query(query);
      const users = result.rows;
      return res.status(200).json({
        status: 'success',
        data: users,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 'error',
        error: 'Server Error',
      });
    }
  }

  // Get a single user
  static async getAUser(req, res) {
    try {
      const query = {
        text: 'select * from users where id = $1 LIMIT 1',
        values: [req.params.id],
      };
      const result = await db.query(query);
      const user = result.rows;

      if (user.length < 1) {
        return res.status(404).json({
          status: 'error',
          error: 'This user does not exist',
        });
      }

      return res.status(200).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: 'Server Error',
      });
    }
  }

  // Login a registered user
  static async loginUser(req, res) {
    try {
      const query = { text: 'select * from users where email = $1 LIMIT 1', values: [req.body.email] };
      const result = await db.query(query);
      const user = result.rows[0];
      const token = auth.generateToken(user);
      return res.status(200).json({
        status: 'success',
        data: {
          user_id: user.id,
          is_admin: user.is_admin,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          token,
        },
      });
    } catch (error) {
      return res.status(500)
        .json({
          status: 'error',
          error: 'Server error',
        });
    }
  }
}
