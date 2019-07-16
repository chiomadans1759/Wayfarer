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
        text: 'select * from buses where id = $1',
        values: [req.body.bus_id],
      };
      const result = await db.query(query);
      const trip = result.rows[0];
      const output = await db.query(findBus);
      const bus = output.rows[0];

      return res.status(201).json({
        status: 'success',
        data: {
          trip_id: trip.id,
          bus_id: trip.bus_id,
          origin: trip.origin,
          destination: trip.destination,
          trip_date: Date(trip.trip_date),
          fare: trip.fare,
          status: 'active',
          capacity: bus.capacity,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 'error',
        error,
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
        error: 'Server Error',
      });
    }
  }

  // Filter Trips by Origin
  static async filterTripsByOrigin(req, res) {
    try {
      const query = {
        text: 'select * from trips where LOWER(origin) = $1',
        values: [req.params.origin.toLowerCase()],
      };
      const result = await db.query(query);
      const trips = result.rows;

      if (trips.length < 1) {
        return res.status(404).json({
          status: 'error',
          error: `There is no trip going from ${req.params.origin} at this time`,
        });
      }
      return res.status(200).json({
        status: 'success',
        data: trips,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: 'Server Error',
      });
    }
  }

  // Filter Trips by Origin
  static async filterTripsByDestination(req, res) {
    try {
      const query = {
        text: 'select * from trips where LOWER(destination) = $1',
        values: [req.params.destination.toLowerCase()],
      };
      const result = await db.query(query);
      const trips = result.rows;

      if (trips.length < 1) {
        return res.status(404).json({
          status: 'error',
          error: `There is no trip going to ${
            req.params.destination
          } at this time`,
        });
      }
      return res.status(200).json({
        status: 'success',
        data: trips,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: 'Server Error',
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
        error: 'Server Error',
      });
    }
  }

  // Admin can cancel trip
  static async cancelATrip(req, res) {
    try {
      const query = {
        text: 'UPDATE trips SET status=$1 WHERE id=$2 returning *',
        values: ['cancelled', req.trip.trip_id],
      };
      const result = await db.query(query);
      const booking = result.rows[0];

      return res.status(200).json({
        status: 'success',
        data: {
          message: 'Trip Cancelled Successfully',
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
}
