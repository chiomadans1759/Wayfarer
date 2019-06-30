import UserController from '../Controllers/userControllers';

/* All Router Here */
export default (server) => {
  server.post('/api/v1/users', UserController.addUser);
};
