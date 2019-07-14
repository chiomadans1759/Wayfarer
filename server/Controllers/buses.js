import db from '../DB/config';

export default class BusesController {
  /* Registers a new bus */
  static async addBus(req, res) {
    try {
      const query = {
        text: 'insert into buses (user_id, number_plate, manufacturer, model, year, capacity) values ($1, $2, $3, $4, $5, $6) returning id, user_id, number_plate, manufacturer, model, year, capacity',
        values: [
          req.user.id,
          req.body.number_plate,
          req.body.manufacturer,
          req.body.model,
          req.body.year,
          req.body.capacity,
        ],
      };
    
      const result = await db.query(query);
      const bus = result.rows[0];

      return res.status(201).json({
        status: 'success',
        data: {
          bus_id: bus.id,
          user_id: req.user.id,
          number_plate: bus.number_plate,
          manufacturer: bus.manufacturer,
          model: bus.model,
          year: bus.year,
          capacity: bus.capacity,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500)
        .json({
          status: 'error',
          error: 'Server Error',
        });
    }
  }

  // Admin Gets all registered buses
  static async getAllBuses(req, res) {
    try {
      const query = { text: 'select * from buses' };
      const result = await db.query(query);
      const buses = result.rows;
      return res.status(200).json({
        status: 'success',
        data: buses,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: 'Server Error',
      });
    }
  }

  // Admin Gets a single bus
  static async getABus(req, res) {
    try {
      const query = {
        text: 'select * from buses where id = $1 LIMIT 1',
        values: [req.params.id],
      };
      const result = await db.query(query);
      const bus = result.rows;

      if (bus.length < 1) {
        return res.status(404).json({
          status: 'error',
          error: 'This bus does not exist',
        });
      }
      return res.status(200).json({
        status: 'success',
        data: bus,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: 'Problem fetching this bus',
      });
    }
  }
}
