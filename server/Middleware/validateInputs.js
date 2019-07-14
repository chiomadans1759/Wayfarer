import bcrypt from 'bcrypt';
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
        error: 'User with this email has already been registered',
      });
    }
    return next();
  },

  async userLogin(req, res, next) {
    const emailFilter = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const required = ['email', 'password'];
    const email = emailFilter.test(String(req.body.email).toLowerCase());

    if (req.body.email && !email) {
      return res.status(400).json({
        status: 'error',
        error: 'This email is not correct!',
      });
    }

    const query = { text: 'select * from users where email = $1 LIMIT 1', values: [req.body.email] };
    const result = await db.query(query);
    const user = result.rows[0];

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

    if (!user) {
      return res.status(400).json({
        status: 'error',
        error: 'This email is not registered on our database',
      });
    }

    const check = bcrypt.compareSync(req.body.password, user.password);
    if (!check) {
      return res.status(400).json({
        status: 'error',
        error: 'This password doesn\'t match our record',
      });
    }

    return next();
  },

  async validateId(req, res, next) {
    if (!Number(req.params.id)) {
      return res.status(400).json({
        status: 'error',
        error: 'This id is invalid. ID must be a number!',
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
        error: 'The capacity of the bus must be a number',
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
    const query = {
      text: 'SELECT * FROM trips where trip_id = $1 LIMIT 1',
      // text: 'SELECT * FROM trips Inner JOIN buses ON trips.bus_id = buses.bus_id where trip_id = $1 LIMIT 1',
      values: [req.params.id],
    };
    const result = await db.query(query);
    const trip = result.rows[0];
    req.trip = trip;

    if (!trip) {
      return res.status(404).json({
        status: 'error',
        error: 'This trip does not exist',
      });
    }

    return next();
  },

  async addTrips(req, res, next) {
    const required = ['bus_id', 'origin', 'destination', 'trip_date', 'fare'];
    const query = {
      text: 'select * from trips where (bus_id, trip_date) = ($1, $2)',
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

  async addBookings(req, res, next) {
    const required = ['trip_id', 'seat_number'];
    const query = {
      text: 'select * from bookings where (trip_id, seat_number) = ($1, $2)',
      values: [req.body.trip_id, req.body.seat_number],
    };
    const checkCapacity = {
      text: 'SELECT * FROM trips Inner JOIN buses ON trips.bus_id = buses.bus_id WHERE trips.trip_id = $1',
      values: [req.body.trip_id],
    };
    const result = await db.query(query);
    const booking = result.rows[0];
    const busCapacity = await db.query(checkCapacity);
    const capacity = busCapacity.rows[0];

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

    if (!capacity) {
      return res.status(404).json({
        status: 'error',
        error: 'This trip does not exist or has not been created yet',
      });
    }

    if (capacity.status === 'cancelled') {
      return res.status(404).json({
        status: 'error',
        error: 'This trip has been cancelled and is no available for booking',
      });
    }

    if (booking) {
      return res.status(400).json({
        status: 'error',
        error: 'This seat has already been booked',
      });
    }

    if (req.body.seat_number > capacity.capacity) {
      return res.status(400).json({
        status: 'error',
        error: `Please choose a seat number between 1 and ${capacity.capacity}`,
      });
    }

    return next();
  },

  async bookings(req, res, next) {
    const query = req.user.is_admin === true ? {
      text: 'select * from bookings where booking_id = $1 LIMIT 1',
      values: [req.params.id],
    } : {
      text: 'select * from bookings where (user_id, booking_id) = ($1, $2) LIMIT 1',
      values: [req.user.user_id, req.params.id],
    };
    const result = await db.query(query);
    const booking = result.rows[0];
    req.booking = booking;

    if (!booking && req.user.is_admin === false) {
      return res.status(404).json({
        status: 'error',
        error: 'This booking by this user does not exist',
      });
    }

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        error: 'Booking with this ID doesn\'t exist',
      });
    }

    return next();
  },
};

export default validateInputs;
