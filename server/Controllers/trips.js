import db from '../DB/config';

export default class TripsController {
  /* Adds a new user */
  static async addTrip(req, res) {
    try {
      const query = {
        text:
          'insert into trips (bus_id, origin, destination, trip_date, fare, status) values ($1, $2, $3, $4, $5, $6) returning *',
        values: [
          req.body.bus_id,
          req.body.origin,
          req.body.destination,
          req.body.trip_date,
          req.body.fare,
          req.body.status,
        ],
      };

      const result = await db.query(query);
      const trip = result.rows[0];

      return res.status(201).json({
        status: 'success',
        data: {
          id: trip.id,
          bus_id: trip.bus_id,
          origin: trip.origin,
          destination: trip.destination,
          trip_date: Date(trip.trip_date),
          fare: trip.fare,
          status: trip.status,
        },
      });
    } catch (error) {
      return res.status(500)
        .json({
          status: 'error',
          error: 'Problem creating Trip',
        });
    }
  }
}
