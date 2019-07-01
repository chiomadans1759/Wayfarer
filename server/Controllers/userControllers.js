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
      return res.status(201).json({
        status: 'success',
        data: {
          id: createdUser.id,
          is_admin: createdUser.is_admin,
          email: createdUser.email,
          firstname: createdUser.firstname,
          lastname: createdUser.lastname,
        },
        token: userToken,
      });
    } catch (error) {
      return res.status(500)
        .json({
          status: 'error',
          error: 'Problem creating user',
        });
    }
  }

  // Login a registered user
  static async loginUser(req, res) {
    try {
      const query = { text: 'select * from users where email = $1 LIMIT 1', values: [req.body.email] };
      const result = await db.query(query);
      const user = result.rows[0];
      const check = bcrypt.compareSync(req.body.password, user.password);
      if (check) {
        const token = auth.generateToken(user);
        return res.status(200).json({
          status: 'success',
          data: {
            id: user.id,
            is_admin: user.is_admin,
            mail: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
          },
          token,
        });
      }
      return res.status(401).json({
        status: 'error',
        error: 'User with this login details doesn\'t exist',
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
