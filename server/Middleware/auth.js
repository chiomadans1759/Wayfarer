import jwt from 'jsonwebtoken';
import db from '../DB/config';

const auth = {
  generateToken(user) {
    return jwt.sign({
      user_id: user.user_id,
      is_admin: user.is_admin,
    }, process.env.SECRET, { expiresIn: '7d' });
  },

  verifyToken(token) {
    let decoded = {};
    try {
      decoded.payload = jwt.verify(token, process.env.SECRET);
    } catch (error) {
      decoded = { error: error.message };
    }
    return decoded;
  },

  async verifyUserToken(req, res, next) {
    try {
      const token = req.headers['x-access-token'];
      const decoded = auth.verifyToken(token);

      if (!token) {
        return res.status(401).json({
          status: 'error',
          error: 'No token provided.',
        });
      }

      if (decoded.error) {
        return res.status(401).json({
          status: 'error',
          error: 'Failed to authenticate token.',
        });
      }

      const query = {
        text: 'select * from users where user_id = $1 LIMIT 1', values: [decoded.payload.user_id],
      };
      const result = await db.query(query);

      if (result.rows < 1) {
        return res.status(401).json({
          status: 'error',
          error: 'This user does not exist.',
        });
      }

      const user = result.rows[0];
      req.user = user;
      return next();
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: 'Server  error',
      });
    }
  },

  async verifyAdmin(req, res, next) {
    try {
      const token = req.headers['x-access-token'];
      const decoded = auth.verifyToken(token);

      if (decoded.payload.is_admin !== true) {
        return res.status(401).json({
          status: 'error',
          error: 'Hi! This resource can only be accessed by an admin',
        });
      }
      return next();
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: 'Server  error',
      });
    }
  },
};

export default auth;
