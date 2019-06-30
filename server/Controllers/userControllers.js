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
          'insert into users (email, firstname, lastname, password, is_admin) values ($1, $2, $3, $4, $5) returning id, email, firstname, lastname, password, is_admin',
        values: [req.body.email, req.body.firstname, req.body.lastname, hash, false],
      };
      const result = await db.query(query);

      const createdUser = result.rows[0];

      const userToken = auth.generateToken(createdUser);
      return res.status(201).send({
        success: 'success',
        user: createdUser,
        token: userToken,
      });
    } catch (error) {
      return res.status(500)
        .json({
          status: 'failed',
          message: 'Problem creating user',
        });
    }
  }
}
