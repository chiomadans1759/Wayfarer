import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
chai.should();

const bus = {
  number_plate: 'LAG-Y46-E3',
  manufacturer: 'Lexus',
  model: 'Jeep-2019',
  year: 2019,
  capacity: 14,
};
const login = {
  email: 'victor@gmail.com',
  password: 'victor419',
};
const admin = {
  email: 'admin@gmail.com',
  password: 'omadamsel',
};

describe('Buses', () => {
  // Test for creating new user
  describe('/POST register a bus', () => {
    it('it should throw an error if the request body is empty', (done) => {
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
            .post('/api/v1/buses')
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

    it('it should not create a bus without all required bus fields', (done) => {
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
            .post('/api/v1/buses')
            .set('x-access-token', token)
            .send({
              manufacturer: 'Lexus',
              model: 'Jeep-2019',
              year: 2019,
              capacity: 14,
            })
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
            .post('/api/v1/buses')
            .set('x-access-token', token)
            .send({
              number_plate: 'LAG-Y46-E3',
              manufacturer: 'Lexus',
              model: 'Jeep-2019',
              year: 2019,
              capacity: 'four',
            })
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
            .post('/api/v1/buses')
            .set('x-access-token', token)
            .send(bus)
            .end((error, data) => {
              data.should.have.status(201);
              data.body.should.be.an('object');
              data.body.should.have.property('status').eql('success');
              data.body.should.have.property('data');
              data.body.data.should.have.property('bus_id');
              data.body.data.should.have.property('user_id');
              data.body.data.should.have.property('number_plate');
              data.body.data.should.have.property('manufacturer');
              data.body.data.should.have.property('model');
              data.body.data.should.have.property('year');
              data.body.data.should.have.property('capacity');
              done();
            });
        });
    });

    it('it should return error if bus already exists', (done) => {
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
            .post('/api/v1/buses')
            .set('x-access-token', token)
            .send(bus)
            .end((error, data) => {
              data.should.have.status(400);
              data.body.should.be.an('object');
              data.body.should.have.property('status').eql('error');
              data.body.should.have.property('error').eql('The bus with this plate number already exists');
              done();
            });
        });
    });
  });

  // Test for Fetching existing buses
  describe('/Get Buses', () => {
    it('it should return unauthorized if user is not logged in', (done) => {
      chai.request(app)
        .get('/api/v1/users')
        .end((error, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('No token provided.');
          done();
        });
    });

    it('it should return unauthorized user if user is not an admin', (done) => {
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
            .get('/api/v1/buses')
            .set('x-access-token', token)
            .end((error, data) => {
              data.should.have.status(401);
              data.body.should.be.an('object');
              data.body.should.have.property('status').eql('error');
              data.body.should.have.property('error').eql('Hi! This resource can only be accessed by an admin');
              done();
            });
        });
    });

    it('it should Login, check token, and GET all registered buses', (done) => {
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
            .get('/api/v1/buses')
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

    it('it should Login, check token, and GET a specific bus by id', (done) => {
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
