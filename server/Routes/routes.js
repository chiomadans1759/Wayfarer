import UserController from '../Controllers/userControllers';
import auth from '../Middleware/auth';

/* All Router Here */
export default (server) => {
  server.post('/api/v1/users', UserController.addUser);
};
