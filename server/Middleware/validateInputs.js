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

  async buses(req, res, next) {
    const required = ['number_plate', 'manufacturer', 'model', 'year', 'capacity'];
    const query = {
      text: 'select * from buses where number_plate = $1',
      values: [req.body.number_plate],
    };
    // use number plate because a bus can only be registered once but used as many times as possible
    const result = await db.query(query);
    const bus = result.rows;

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

    if (!Number(req.body.capacity)) {
      return res.status(400).json({
        status: 'error',
        error: 'The capacity of the bus has to be a number',
      });
    }

    if (bus.length > 0) {
      return res.status(400).json({
        status: 'error',
        error: 'The bus with this plate number already exists',
      });
    }
    return next();
  },

  async trips(req, res, next) {
    const required = ['bus_id', 'origin', 'destination', 'trip_date', 'fare'];
    const query = {
      text: 'select * from trips where (bus_id, trip_date) = ($1, $2)',
      // text: 'SELECT * FROM trips Inner JOIN buses ON trips.bus_id = buses.bus_id WHERE (trips.bus_id, trips.trip_date) = ($1, $2)',
      // text: 'select * from trips, buses where (trips.bus_id, trips.trip_date) = ($1, $2) AND trips.bus_id = buses.bus_id',
      values: [req.body.bus_id, req.body.trip_date],
    };
    const findBus = {
      text: 'select * from buses where bus_id = $1 LIMIT 1',
      values: [req.body.bus_id],
    };
    const result = await db.query(query);
    const trip = result.rows;
    const output = await db.query(findBus);
    const bus = output.rows[0];

    for (let i = 0; i < required.length; i += 1) {
      if (!req.body[required[i]]) {
        return res.status(400).json({
          status: 'error',
          error: `${required[i]} is required`,
        });
      }
    }

    if (trip.length > 0) {
      return res.status(400).json({
        status: 'error',
        error: 'This bus has already been assign for a trip on this date',
      });
    }

    if (!bus) {
      return res.status(400).json({
        status: 'error',
        error: 'This bus does not exist or has not yet been registered',
      });
    }

    return next();
  },

  async bookings(req, res, next) {
    const required = ['trip_id', 'seat_number'];
    const query = {
      text: 'select * from bookings where (trip_id, seat_number) = ($1, $2)',
      // text: 'SELECT * FROM trips Inner JOIN buses ON trips.bus_id = buses.bus_id WHERE (trips.bus_id, trips.trip_date) = ($1, $2)',
      values: [req.body.trip_id, req.body.seat_number],
    };
    const checkCapacity = {
      text: 'SELECT * FROM trips Inner JOIN buses ON trips.bus_id = buses.bus_id WHERE trips.bus_id = $1',
      values: [req.body.trip_id],
    };
    const result = await db.query(query);
    const booking = result.rows;
    const busCapacity = await db.query(checkCapacity);
    const capacity = busCapacity.rows[0];
    console.log(capacity.capacity);

    // const busCapacity = capacity.

    for (let i = 0; i < required.length; i += 1) {
      if (!req.body[required[i]]) {
        return res.status(400).json({
          status: 'error',
          error: `${required[i]} is required`,
        });
      }
    }

    if (!booking.trip_id) {
      return res.status(400).json({
        status: 'error',
        error: 'There are no available trips at this point',
      });
    }

    if (booking) {
      return res.status(400).json({
        status: 'error',
        error: 'This seat has already been booked',
      });
    }

    // if (req.body.seat_number > capacity.capacity) {
    //   return res.status(400).json({
    //     status: 'error',
    //     error: `Please choose a seat number between 1 and ${capacity}`,
    //   });
    // }

    return next();
  },
};

export default validateInputs;
