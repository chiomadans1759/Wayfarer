import db from './config';

const dropTables = () => {
  const dropBuses = 'DROP TABLE IF EXISTS buses';
  db.query(dropBuses)
    .then((res) => {
      console.log(res);
      console.log('Table dropped successfully');
      db.end();
    })
    .catch((err) => {
      console.log(err);
      db.end();
    });

  const dropTrips = 'DROP TABLE IF EXISTS trips';
  db.query(dropTrips)
    .then((res) => {
      console.log(res);
      console.log('Table dropped successfully');
      db.end();
    })
    .catch((err) => {
      console.log(err);
      db.end();
    });

  const dropBookings = 'DROP TABLE IF EXISTS bookings';
  db.query(dropBookings)
    .then((res) => {
      console.log(res);
      console.log('Table dropped successfully');
      db.end();
    })
    .catch((err) => {
      console.log(err);
      db.end();
    });
};

dropTables();
