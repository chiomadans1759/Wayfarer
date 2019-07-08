import db from '../DB/config';

const validateInputs = {
  async users(req, res, next) {
    const emailFilter = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const required = ['email', 'first_name', 'last_name', 'password'];
    const email = emailFilter.test(String(req.body.email).toLowerCase());
    const query = {
      text: 'select * from users where email = $1',
      values: [req.body.email],
    };
    const result = await db.query(query);
    const user = result.rows;

    if (req.body.length < 1) {
      return res.status(400).json({
        status: 'error',
        error: 'The request body must not be empty',
      });
    }

    for (let i = 0; i < required.length; i += 1) {
      if (!req.body[required[i]]) {
        return res.status(400).json({
          status: 'error',
          error: `${required[i]} is required`,
        });
      }
    }

    if (!email) {
      return res.status(400).json({
        status: 'error',
        error: 'Invalid format for email',
      });
    }

    if (req.body.password.length < 6) {
      return res.status(400).json({
        status: 'error',
        error: 'The password must be atleast 6 characters long',
      });
    }

    if (user.length > 0) {
      return res.status(400).json({
        status: 'error',
        error: 'User with this login details already exists',
      });
    }
    return next();
  },
};

export default validateInputs;
