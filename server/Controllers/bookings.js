import db from '../DB/config';

export default class BookingsController {
  /* Adds a new user */
  static async bookTrip(req, res) {
    try {
      const createdDate = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
      const query = {
        text: 'insert into bookings (trip_id, seat_number, user_id, created_on) values ($1, $2, $3, $4) returning booking_id, trip_id, seat_number, user_id, created_on',
        values: [
          req.body.trip_id,
          req.body.seat_number,
          req.user.user_id,
          createdDate,
        ],
      };
      const findTrip = {
        text: 'select * from trips, buses where trips.trip_id = $1 AND trips.bus_id = buses.bus_id',
        values: [req.body.trip_id],
      };

      const result = await db.query(query);
      const booking = result.rows[0];
      const output = await db.query(findTrip);
      const trip = output.rows[0];

      return res.status(201).json({
        status: 'success',
        data: {
          booking_id: booking.booking_id,
          user_id: req.user.user_id,
          trip_id: booking.trip_id,
          bus_id: trip.bus_id,
          trip_date: trip.trip_date,
          seat_number: req.body.seat_number,
          first_name: req.user.first_name,
          last_name: req.user.last_name,
          email: req.user.email,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500)
        .json({
          status: 'error',
          error: 'Problem booking a seat on this trip',
        });
    }
  }

  // Admin Gets all bookings and User gets all her/his bookings
  static async getAllBookings(req, res) {
    try {
      // const query = { text: 'SELECT * FROM bookings Inner JOIN users ON bookings.user_id = users.user_id' };
      const query = req.user.is_admin === false ? {
        text: 'select * from bookings where user_id = $1',
        values: [req.user.user_id],
      } : { text: 'SELECT * FROM bookings' };
      const result = await db.query(query);
      const bookings = result.rows;

      return res.status(200).json({
        status: 'success',
        data: bookings,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: 'Problem fetching bookings',
      });
    }
  }

  // Admin can get a single booking and a user can get one of his/bookings by ID
  static async getABooking(req, res) {
    try {
      const query = req.user.is_admin === true ? {
        text: 'select * from bookings where booking_id = $1 LIMIT 1',
        values: [req.params.id],
      } : {
        text: 'select * from bookings where (user_id, booking_id) = ($1, $2) LIMIT 1',
        values: [req.user.user_id, req.params.id],
      };
      const result = await db.query(query);
      const booking = result.rows;

      if (booking.length < 1 && req.user.is_admin === false) {
        return res.status(404).json({
          status: 'error',
          error: 'This booking by this user does not exist',
        });
      }

      if (booking.length < 1) {
        return res.status(404).json({
          status: 'error',
          error: 'Booking with this ID doesn\'t exist',
        });
      }

      return res.status(200).json({
        status: 'success',
        data: booking,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: 'Problem fetching this booking',
      });
    }
  }
}
