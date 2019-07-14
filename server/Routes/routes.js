import UserController from '../Controllers/users';
import TripsController from '../Controllers/trips';
import BusesController from '../Controllers/buses';
import BookingsController from '../Controllers/bookings';
import auth from '../Middleware/auth';
import validateInputs from '../Middleware/validateInputs';

export default (server) => {
  /* Users Routes Here */
  server.post('/api/v1/users', validateInputs.users, UserController.addUser);
  server.get('/api/v1/users', auth.verifyUserToken, auth.verifyAdmin, UserController.getAllUsers);
  server.get('/api/v1/users/:id', auth.verifyUserToken, validateInputs.validateId, auth.verifyAdmin, UserController.getAUser);
  server.post('/api/v1/login', validateInputs.userLogin, UserController.loginUser);

  /* Buses Routes Here */
  server.post('/api/v1/buses', auth.verifyUserToken, auth.verifyAdmin, validateInputs.buses, BusesController.addBus);
  server.get('/api/v1/buses', auth.verifyUserToken, auth.verifyAdmin, BusesController.getAllBuses);
  server.get('/api/v1/buses/:id', auth.verifyUserToken, validateInputs.validateId, auth.verifyAdmin, BusesController.getABus);

  /* Trips Routes Here */
  server.post('/api/v1/trips', auth.verifyUserToken, auth.verifyAdmin, validateInputs.addTrips, TripsController.addTrip);
  server.get('/api/v1/trips', auth.verifyUserToken, TripsController.getTrips);
  server.get('/api/v1/trips/:id', auth.verifyUserToken, validateInputs.validateId, validateInputs.trips, TripsController.getATrip);
  server.get('/api/v1/trips/origin/:origin', auth.verifyUserToken, TripsController.filterTripsByOrigin);
  server.get('/api/v1/trips/destination/:destination', auth.verifyUserToken, TripsController.filterTripsByDestination);
  server.patch('/api/v1/trips/:id', auth.verifyUserToken, auth.verifyAdmin, validateInputs.validateId, validateInputs.trips, TripsController.cancelATrip);

  /* Bookings Routes Here */
  server.post('/api/v1/bookings', auth.verifyUserToken, validateInputs.addBookings, BookingsController.bookTrip);
  server.get('/api/v1/bookings', auth.verifyUserToken, BookingsController.getAllBookings);
  server.get('/api/v1/bookings/:id', auth.verifyUserToken, validateInputs.validateId, validateInputs.bookings, BookingsController.getABooking);
  server.delete('/api/v1/bookings/:id', auth.verifyUserToken, validateInputs.validateId, validateInputs.bookings, BookingsController.deleteABooking);
  server.put('/api/v1/bookings/:id', auth.verifyUserToken, validateInputs.validateId, validateInputs.bookings, BookingsController.updateABooking);
};
