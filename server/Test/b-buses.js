/* eslint-disable object-curly-newline */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
chai.should();

const bus = { number_plate: 'LAG-Y46-E3', manufacturer: 'Lexus', model: 'Jeep-2019', year: 2019, capacity: 14 };
const login = { email: 'victor@gmail.com', password: 'victor419' };
const admin = { email: 'admin@gmail.com', password: 'omadamsel' };

describe('Buses', () => {
  // Test for creating new user
  describe('/POST register a bus', () => {
    it('it should not send request if the body of request is empty', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(admin)
        .end((err, res) => {
          const { token } = res.body.data;
          chai.request(app)
            .post('/api/v1/buses')
            .set('x-access-token', token)
            .send([])
            .end((error, data) => {
              data.should.have.status(400);
              data.body.should.be.an('object');
              data.body.should.have.property('error').eql('The request body must not be empty');
              done();
            });
        });
    });

    it('it should not create a bus if the request body fields are more than the required fields', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(admin)
        .end((err, res) => {
          const { token } = res.body.data;
          chai.request(app)
            .post('/api/v1/buses')
            .set('x-access-token', token)
            .send({ number_plate: 'LAG-Y46-E3', manufacturer: 'Lexus', model: 'Jeep-2019', year: 2019, capacity: 14, color: 'Red' })
            .end((error, data) => {
              data.should.have.status(400);
              data.body.should.have.property('status').eql('error');
              data.body.should.have.property('error').eql('You cannot add extra fields to this bus');
              done();
            });
        });
    });

    it('it should not create a bus without all required bus fields', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(admin)
        .end((err, res) => {
          const { token } = res.body.data;
          chai.request(app)
            .post('/api/v1/buses')
            .set('x-access-token', token)
            .send({ manufacturer: 'Lexus', model: 'Jeep-2019', year: 2019, capacity: 14 })
            .end((error, data) => {
              data.should.have.status(400);
              data.body.should.be.an('object');
              data.body.should.have.property('status').eql('error');
              data.body.should.have.property('error').eql('number_plate is required');
              done();
            });
        });
    });

    it('it should throw an error if the capacity of the bus is NOT a number', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(admin)
        .end((err, res) => {
          const { token } = res.body.data;
          chai.request(app)
            .post('/api/v1/buses')
            .set('x-access-token', token)
            .send({ number_plate: 'LAG-Y46-E3', manufacturer: 'Lexus', model: 'Jeep-2019', year: 2019, capacity: 'four',})
            .end((error, data) => {
              data.should.have.status(400);
              data.body.should.be.an('object');
              data.body.should.have.property('status').eql('error');
              data.body.should.have.property('error').eql('The capacity of the bus must be a number');
              done();
            });
        });
    });

    it('it should register a bus with all required fields', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(admin)
        .end((err, res) => {
          const { token } = res.body.data;
          chai.request(app)
            .post('/api/v1/buses')
            .set('x-access-token', token)
            .send(bus)
            .end((error, data) => {
              data.should.have.status(201);
              data.body.should.be.an('object');
              data.body.should.have.property('status').eql('success');
              data.body.should.have.property('data');
              done();
            });
        });
    });

    it('it should return error if this bus has already been created', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(admin)
        .end((err, res) => {
          const { token } = res.body.data;
          chai.request(app)
            .post('/api/v1/buses')
            .set('x-access-token', token)
            .send(bus)
            .end((error, data) => {
              data.should.have.status(400);
              data.body.should.be.an('object');
              data.body.should.have.property('error').eql('The bus with this plate number already exists');
              done();
            });
        });
    });
  });

  // Test for Fetching existing buses
  describe('/Get Buses', () => {
    it('it should return unauthorized when a user tries to get bus without being logged in', (done) => {
      chai.request(app)
        .get('/api/v1/buses')
        .end((error, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('No token provided.');
          done();
        });
    });

    it('it should return unauthorized user if user is not an admin', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(login)
        .end((err, res) => {
          const { token } = res.body.data;
          chai.request(app)
            .get('/api/v1/buses')
            .set('x-access-token', token)
            .end((error, data) => {
              data.body.should.be.an('object');
              data.body.should.have.property('status').eql('error');
              data.should.have.status(401);
              data.body.should.have.property('error').eql('Hi! This resource can only be accessed by an admin');
              done();
            });
        });
    });

    it('it should Login, check token, and GET all registered buses', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(admin)
        .end((err, res) => {
          const { token } = res.body.data;
          chai.request(app)
            .get('/api/v1/buses')
            .set('x-access-token', token)
            .end((error, data) => {
              data.body.should.be.an('object');
              data.should.have.status(200);
              data.body.should.have.property('status').eql('success');
              data.body.should.have.property('data');
              done();
            });
        });
    });

    it('it should Login, check token, and GET a specific bus by id', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(admin)
        .end((err, res) => {
          const { token } = res.body.data;
          chai.request(app)
            .get('/api/v1/buses/1')
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

    it('it should return invalid id if id is not valid', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(admin)
        .end((err, res) => {
          const { token } = res.body.data;
          chai.request(app)
            .get('/api/v1/buses/p')
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
});
