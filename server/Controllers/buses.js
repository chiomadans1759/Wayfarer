import db from '../DB/config';

export default class BusesController {
  /* Adds a new user */
  static async addBus(req, res) {
    try {
      const query = {
        text: 'insert into buses (number_plate, manufacturer, model, year, capacity) values ($1, $2, $3, $4, $5) returning id, number_plate, manufacturer, model, year, capacity',
        values: [
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
          id: bus.id,
          number_plate: bus.number_plate,
          manufacturer: bus.manufacturer,
          model: bus.model,
          year: bus.year,
          capacity: bus.capacity,
        },
      });
    } catch (error) {
      return res.status(500)
        .json({
          status: 'error',
          error: 'Problem registering this bus',
        });
    }
  }
}
