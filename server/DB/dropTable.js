import db from './config';

const dropTables = () => {
  const dropBuses = 'DROP TABLE IF EXISTS buses';
  db.query(dropBuses)
    .then(() => { console.log('Table dropped successfully'); db.end(); })
    .catch((err) => { console.log(err); db.end(); });

  const dropTrips = 'DROP TABLE IF EXISTS trips';
  db.query(dropTrips)
    .then(() => { console.log('Table dropped successfully'); db.end(); })
    .catch((err) => { console.log(err); db.end(); });

  const dropUsers = 'DROP TABLE IF EXISTS users';
  db.query(dropUsers)
    .then(() => { console.log('Table dropped successfully'); db.end(); })
    .catch((err) => { console.log(err); db.end(); });

  const dropBookings = 'DROP TABLE IF EXISTS bookings';
  db.query(dropBookings)
    .then(() => { console.log('Table dropped successfully'); db.end(); })
    .catch((err) => { console.log(err); db.end(); });
};

dropTables();
