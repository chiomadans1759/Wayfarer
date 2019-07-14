import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
chai.should();

const trip = {
  bus_id: 1,
  origin: 'Lagos',
  destination: 'Benin',
  trip_date: '07-09-2019',
  fare: 'N5,600',
};
const login = {
  email: 'victor@gmail.com',
  password: 'victor419',
};
const admin = {
  email: 'admin@gmail.com',
  password: 'omadamsel',
};

describe('Trips', () => {
  // Test for creating new trip
  describe('/POST register a trip', () => {
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
            .post('/api/v1/trips')
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

    it('it should not create a trip without all required trip fields', (done) => {
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
            .post('/api/v1/trips')
            .set('x-access-token', token)
            .send({
              bus_id: 1,
              origin: 'Lagos',
              destination: 'Benin',
              trip_date: '07-09-2019',
            })
            .end((error, data) => {
              data.should.have.status(400);
              data.body.should.be.an('object');
              data.body.should.have.property('status').eql('error');
              data.body.should.have.property('error').eql('fare is required');
              done();
            });
        });
    });

    it('it should return unauthorized if user is not logged in', (done) => {
      chai.request(app)
        .post('/api/v1/trips')
        .end((error, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('No token provided.');
          done();
        });
    });

    it('it should create a trip with all required fields', (done) => {
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
            .post('/api/v1/trips')
            .set('x-access-token', token)
            .send(trip)
            .end((error, data) => {
              data.should.have.status(201);
              data.body.should.be.an('object');
              data.body.should.have.property('status').eql('success');
              data.body.should.have.property('data');
              data.body.data.should.have.property('trip_id');
              data.body.data.should.have.property('bus_id');
              data.body.data.should.have.property('origin');
              data.body.data.should.have.property('destination');
              data.body.data.should.have.property('trip_date');
              data.body.data.should.have.property('fare');
              done();
            });
        });
    });

    it('it should return error if trip already exists', (done) => {
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
            .post('/api/v1/trips')
            .set('x-access-token', token)
            .send(trip)
            .end((error, data) => {
              data.should.have.status(400);
              data.body.should.be.an('object');
              data.body.should.have.property('status').eql('error');
              data.body.should.have.property('error').eql('This bus has already been assign for a trip on this date');
              done();
            });
        });
    });
  });

  // Test for Fetching existing trips
  describe('/Get Trips', () => {
    it('it should Login, check token, and GET all registered trips', (done) => {
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
            .get('/api/v1/trips')
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

    it('it should Login, check token, and GET a specific trip by id', (done) => {
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
            .get('/api/v1/trips/1')
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
            .get('/api/v1/trips/p')
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
