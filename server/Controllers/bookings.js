import db from '../DB/config';


const createdDate = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
export default class BookingsController {
  /* Adds a new user */
  static async bookTrip(req, res) {
    try {
      const query = {
        text: 'insert into bookings (trip_id, seat_number, user_id, created_on) values ($1, $2, $3, $4) returning id, trip_id, seat_number, user_id, created_on',
        values: [
          req.body.trip_id,
          req.body.seat_number,
          req.user.id,
          createdDate,
        ],
      };
      const findTrip = {
        text: 'select * from trips, buses where trips.id = $1 AND trips.bus_id = buses.id',
        values: [req.body.trip_id],
      };

      const result = await db.query(query);
      const booking = result.rows[0];
      const output = await db.query(findTrip);
      const trip = output.rows[0];

      return res.status(201).json({
        status: 'success',
        data: {
          booking_id: booking.id,
          user_id: req.user.id,
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
      return res.status(500)
        .json({
          status: 'error',
          error: 'Server Error',
        });
    }
  }

  // Admin Gets all bookings and User gets all her/his bookings
  static async getAllBookings(req, res) {
    try {
      const query = req.user.is_admin === false ? {
        text: 'select * from bookings where user_id = $1',
        values: [req.user.id],
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
        error: 'Server Error',
      });
    }
  }

  // Admin can get a single booking and a user can get one of his/bookings by ID
  static async getABooking(req, res) {
    try {
      return res.status(200).json({
        status: 'success',
        data: req.booking,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 'error',
        error: 'Problem fetching this booking',
      });
    }
  }

  // Admin/User can change their booking
  static async updateABooking(req, res) {
    try {
      const query = {
        text: 'UPDATE bookings SET trip_id=$1, seat_number=$2, created_on=$3, user_id=$4 WHERE id=$5 returning *',
        values: [
          req.body.trip_id,
          req.body.seat_number,
          createdDate,
          req.user.id,
          req.booking.id,
        ],
      };
      const result = await db.query(query);
      const booking = result.rows[0];

      return res.status(200).json({
        status: 'success',
        data: {
          message: 'Booking Successfully Changed',
          Booking: booking,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: 'Server Error',
      });
    }
  }

  // Admin/User can delete their booking
  static async deleteABooking(req, res) {
    try {
      const queryDelete = req.user.is_admin === true ? {
        text: 'DELETE from bookings where id = $1',
        values: [req.params.id],
      } : {
        text: 'DELETE from bookings where (user_id, id) = ($1, $2)',
        values: [req.user.id, req.params.id],
      };
      await db.query(queryDelete);

      return res.status(200).json({
        status: 'success',
        data: {
          message: 'Booking Deleted Successfully',
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: 'Server Error',
      });
    }
  }
}
