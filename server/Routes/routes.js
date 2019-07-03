import UserController from '../Controllers/users';
import TripsController from '../Controllers/trips';
import BusesController from '../Controllers/buses';
import auth from '../Middleware/auth';

/* All Router Here */
export default (server) => {
  server.post('/api/v1/users', UserController.addUser);
  server.post('/api/v1/login', UserController.loginUser);
  server.post('/api/v1/trips', TripsController.addTrip);
  server.post('/api/v1/buses', auth.verifyUserToken, BusesController.addBus);
};
