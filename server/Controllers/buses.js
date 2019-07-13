import db from '../DB/config';

export default class BusesController {
  /* Registers a new bus */
  static async addBus(req, res) {
    try {
      const query = {
        text: 'insert into buses (user_id, number_plate, manufacturer, model, year, capacity) values ($1, $2, $3, $4, $5, $6) returning bus_id, user_id, number_plate, manufacturer, model, year, capacity',
        values: [
          req.user.user_id,
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
          bus_id: bus.bus_id,
          user_id: req.user.user_id,
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
          error: 'Problem registering this bus',
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
        error: 'Problem fetching all buses',
      });
    }
  }
}
