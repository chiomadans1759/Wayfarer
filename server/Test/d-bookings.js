import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
chai.should();

const booking = {
  trip_id: 1,
  seat_number: 2,
};
const login = {
  email: 'victor@gmail.com',
  password: 'victor419',
};
const admin = {
  email: 'admin@gmail.com',
  password: 'omadamsel',
};

describe('Bookings', () => {
  // Test for creating new booking
  describe('/POST register a booking', () => {
    it('it should throw an error if the request body is empty', (done) => {
      chai.request(app)
        .post('/api/v1/login')
        .send(login)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          res.body.data.should.have.property('token');
          const { token } = res.body.data;

          chai.request(app)
            .post('/api/v1/bookings')
            .set('x-access-token', token)
            .send([])
            .end((error, data) => {
              data.should.have.status(400);
              data.body.should.be.an('object');
              data.body.should.have.property('status').eql('error');
              data.body.should.have.property('error').eql('The request body must not be empty');
              done();
            });
        });
    });

    it('it should not create a booking without all required fields', (done) => {
      chai.request(app)
        .post('/api/v1/login')
        .send(admin)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          res.body.data.should.have.property('token');
          const { token } = res.body.data;

          chai.request(app)
            .post('/api/v1/bookings')
            .set('x-access-token', token)
            .send({
              trip_id: 1,
            })
            .end((error, data) => {
              data.should.have.status(400);
              data.body.should.be.an('object');
              data.body.should.have.property('status').eql('error');
              data.body.should.have.property('error').eql('seat_number is required');
              done();
            });
        });
    });

    it('it should return unauthorized if user is not logged in', (done) => {
      chai.request(app)
        .post('/api/v1/bookings')
        .end((error, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('No token provided.');
          done();
        });
    });

    it('it should create a booking with all required fields', (done) => {
      chai.request(app)
        .post('/api/v1/login')
        .send(login)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          res.body.data.should.have.property('token');
          const { token } = res.body.data;

          chai.request(app)
            .post('/api/v1/bookings')
            .set('x-access-token', token)
            .send(booking)
            .end((error, data) => {
              data.should.have.status(201);
              data.body.should.be.an('object');
              data.body.should.have.property('status').eql('success');
              data.body.should.have.property('data');
              data.body.data.should.have.property('trip_id');
              data.body.data.should.have.property('bus_id');
              data.body.data.should.have.property('seat_number');
              done();
            });
        });
    });

    it('it should return error if booking already exists', (done) => {
      chai.request(app)
        .post('/api/v1/login')
        .send(login)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          res.body.data.should.have.property('token');
          const { token } = res.body.data;

          chai.request(app)
            .post('/api/v1/bookings')
            .set('x-access-token', token)
            .send(booking)
            .end((error, data) => {
              data.should.have.status(400);
              data.body.should.be.an('object');
              data.body.should.have.property('status').eql('error');
              data.body.should.have.property('error').eql('This seat has already been booked');
              done();
            });
        });
    });

    it('it should return error if trip doesn\'t exist', (done) => {
      chai.request(app)
        .post('/api/v1/login')
        .send(login)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          res.body.data.should.have.property('token');
          const { token } = res.body.data;

          chai.request(app)
            .post('/api/v1/bookings')
            .set('x-access-token', token)
            .send({
              trip_id: 7,
              seat_number: 2,
            })
            .end((error, data) => {
              data.should.have.status(400);
              data.body.should.be.an('object');
              data.body.should.have.property('status').eql('error');
              data.body.should.have.property('error').eql('This trip does not exist or has not been created yet');
              done();
            });
        });
    });
  });

  // Test for Fetching existing bookings
  describe('/Get Bookings', () => {
    it('it should Login an admin and GET all registered bookings', (done) => {
      chai.request(app)
        .post('/api/v1/login')
        .send(admin)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          res.body.data.should.have.property('token');
          const { token } = res.body.data;

          chai.request(app)
            .get('/api/v1/bookings')
            .set('x-access-token', token)
            .end((error, data) => {
              data.should.have.status(200);
              data.body.should.be.an('object');
              data.body.should.have.property('status').eql('success');
              data.body.should.have.property('data');
              done();
            });
        });
    });

    it('it should Login a GET all registered bookings by this user', (done) => {
      chai.request(app)
        .post('/api/v1/login')
        .send(login)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          res.body.data.should.have.property('token');
          const { token } = res.body.data;

          chai.request(app)
            .get('/api/v1/bookings')
            .set('x-access-token', token)
            .end((error, data) => {
              data.should.have.status(200);
              data.body.should.be.an('object');
              data.body.should.have.property('status').eql('success');
              data.body.should.have.property('data');
              done();
            });
        });
    });

    it('it should Login and GET any booking by ID if user is admin', (done) => {
      chai.request(app)
        .post('/api/v1/login')
        .send(admin)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          res.body.data.should.have.property('token');
          const { token } = res.body.data;

          chai.request(app)
            .get('/api/v1/bookings/1')
            .set('x-access-token', token)
            .end((error, data) => {
              data.should.have.status(200);
              data.body.should.be.an('object');
              data.body.should.have.property('status').eql('success');
              data.body.should.have.property('data');
              done();
            });
        });
    });

    it('it should Login and GET a specific booking by a user using ID', (done) => {
      chai.request(app)
        .post('/api/v1/login')
        .send(login)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          res.body.data.should.have.property('token');
          const { token } = res.body.data;

          chai.request(app)
            .get('/api/v1/bookings/1')
            .set('x-access-token', token)
            .end((error, data) => {
              data.should.have.status(200);
              data.body.should.be.an('object');
              data.body.should.have.property('status').eql('success');
              data.body.should.have.property('data');
              done();
            });
        });
    });

    it('it should return error if booking doesn\'t exist', (done) => {
      chai.request(app)
        .post('/api/v1/login')
        .send(admin)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          res.body.data.should.have.property('token');
          const { token } = res.body.data;

          chai.request(app)
            .get('/api/v1/bookings/5')
            .set('x-access-token', token)
            .end((error, data) => {
              data.should.have.status(404);
              data.body.should.be.an('object');
              data.body.should.have.property('status').eql('error');
              data.body.should.have.property('error').eql('Booking with this ID doesn\'t exist');
              done();
            });
        });
    });

    it('it should return error if booking by this user doesn\'t exist', (done) => {
      chai.request(app)
        .post('/api/v1/login')
        .send(login)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          res.body.data.should.have.property('token');
          const { token } = res.body.data;

          chai.request(app)
            .get('/api/v1/bookings/5')
            .set('x-access-token', token)
            .end((error, data) => {
              data.should.have.status(404);
              data.body.should.be.an('object');
              data.body.should.have.property('status').eql('error');
              data.body.should.have.property('error').eql('This booking by this user does not exist');
              done();
            });
        });
    });

    it('it should return invalid id if id is not valid', (done) => {
      chai.request(app)
        .post('/api/v1/login')
        .send(admin)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          res.body.data.should.have.property('token');
          const { token } = res.body.data;

          chai.request(app)
            .get('/api/v1/bookings/p')
            .set('x-access-token', token)
            .end((error, data) => {
              data.should.have.status(400);
              data.body.should.be.an('object');
              data.body.should.have.property('status').eql('error');
              data.body.should.have.property('error').eql('This id is invalid. ID must be a number!');
              done();
            });
        });
    });
  });

  // Test for Update booking
  describe('/UPDATE Booking', () => {
    it('it should Login, check token, and GET a specific trip by id', (done) => {
      chai.request(app)
        .post('/api/v1/login')
        .send(login)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          res.body.data.should.have.property('token');
          const { token } = res.body.data;

          chai.request(app)
            .put('/api/v1/bookings/1')
            .set('x-access-token', token)
            .send({
              trip_id: 1,
              seat_number: 7,
            })
            .end((error, data) => {
              data.should.have.status(200);
              data.body.should.be.an('object');
              data.body.should.have.property('status').eql('success');
              data.body.should.have.property('data');
              done();
            });
        });
    });
  });

});
