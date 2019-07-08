import UserController from '../Controllers/users';
import TripsController from '../Controllers/trips';
import BusesController from '../Controllers/buses';
import BookingsController from '../Controllers/bookings';
import auth from '../Middleware/auth';
import validateInputs from '../Middleware/validateInputs';

/* All Router Here */
export default (server) => {
  server.post('/api/v1/users', validateInputs.users, UserController.addUser);
  server.post('/api/v1/login', UserController.loginUser);
  server.post('/api/v1/buses', validateInputs.buses, BusesController.addBus);
  server.post('/api/v1/trips', validateInputs.trips, TripsController.addTrip);
  server.get('/api/v1/trips', TripsController.getTrips);
  server.get('/api/v1/trips/:id', TripsController.getATrip);
  server.post('/api/v1/bookings', validateInputs.bookings, auth.verifyUserToken, BookingsController.bookTrip);
};
