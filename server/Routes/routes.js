import UserController from '../Controllers/users';
import TripsController from '../Controllers/trips';
import BusesController from '../Controllers/buses';
import auth from '../Middleware/auth';
import validateInputs from '../Middleware/validateInputs';

export default (server) => {
  /* Users Routes Here */
  server.post('/api/v1/users', validateInputs.users, UserController.addUser);
  server.post('/api/v1/login', validateInputs.userLogin, UserController.loginUser);

  /* Buses Routes Here */
  server.post('/api/v1/buses', auth.verifyUserToken, auth.verifyAdmin, validateInputs.buses, BusesController.addBus);

  /* Trips Routes Here */
  server.post('/api/v1/trips', auth.verifyUserToken, auth.verifyAdmin, validateInputs.trips, TripsController.addTrip);
  server.get('/api/v1/trips', auth.verifyUserToken, TripsController.getTrips);
  server.get('/api/v1/trips/:id', auth.verifyUserToken, validateInputs.validateId, TripsController.getATrip);
};
