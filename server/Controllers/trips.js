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
          status: 'active',
          number_plate: bus.number_plate,
          manufacturer: bus.manufacturer,
          model: bus.model,
          capacity: bus.capacity,
          year: bus.year,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: 'Problem creating trips',
      });
    }
  }

  // Get all available trips
  static async getTrips(req, res) {
    try {
      const query = { text: 'SELECT * FROM trips' };
      // const query = { text: 'SELECT * FROM trips Inner JOIN buses ON trips.bus_id = buses.bus_id' };
      const result = await db.query(query);
      const trips = result.rows;
      return res.status(200).json({
        status: 'success',
        data: trips,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: 'Problem fetching trips',
      });
    }
  }

  // Get a single trip
  static async getATrip(req, res) {
    try {
      return res.status(200).json({
        status: 'success',
        data: req.trip,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: 'Problem fetching this trip',
      });
    }
  }

  // Admin can cancel trip
  static async cancelATrip(req, res) {
    try {
      const query = {
        text: 'UPDATE trips SET status=$1 WHERE trip_id=$2 returning *',
        values: [
          'cancelled',
          req.trip.trip_id,
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
      console.log(error);
      return res.status(500).json({
        status: 'error',
        error: 'Problem fetching this booking',
      });
    }
  }
}
