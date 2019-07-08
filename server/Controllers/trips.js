import db from '../DB/config';

export default class TripsController {
  // create a new Trip
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
          'active',
        ],
      };
      const findBus = {
        text: 'select * from buses where bus_id = $1',
        values: [req.body.bus_id],
      };
      const result = await db.query(query);
      const trip = result.rows[0];
      const output = await db.query(findBus);
      const bus = output.rows[0];
      return res.status(201).json({
        status: 'success',
        data: {
          trip_id: trip.trip_id,
          bus_id: trip.bus_id,
          origin: trip.origin,
          destination: trip.destination,
          trip_date: Date(trip.trip_date),
          fare: trip.fare,
          status: 'status',
          capacity: bus.capacity,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 'error',
        error: 'Problem creating trips',
      });
    }
  }

  // Get a single trip
  static async getATrip(req, res) {
    try {
      const query = {
        text: 'select * from trips where id = $1 LIMIT 1',
        values: [req.params.id],
      };
      const result = await db.query(query);
      const trip = result.rows;
      return res.status(201).json({
        status: 'success',
        data: trip,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: 'Problem fetching this user',
      });
    }
  }
}
