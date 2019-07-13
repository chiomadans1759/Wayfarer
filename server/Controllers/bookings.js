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
        // text: 'SELECT * FROM trips Inner JOIN buses ON trips.bus_id = buses.bus_id WHERE trip_id = $1',
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

  // Admin Gets all bookings
  static async getAllBookings(req, res) {
    try {
      const query = { text: 'SELECT * FROM bookings Inner JOIN users ON bookings.user_id = users.user_id' };
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
}
