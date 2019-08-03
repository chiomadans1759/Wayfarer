import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
chai.should();

const user = {
  first_name: 'Victor',
  last_name: 'Ugwueze',
  email: 'victor@gmail.com',
  password: 'victor419',
};
const login = {
  email: 'victor@gmail.com',
  password: 'victor419',
};
const admin = {
  email: 'admin@gmail.com',
  password: 'omadamsel',
};

// Test for creating new user
describe('/POST register users', () => {
  it('it should throw an error if the request body is empty', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send([])
      .end((error, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('The request body must not be empty');
        done();
      });
  });
});

describe('/POST register users', () => {
  it('it should not create a user when the input fields are more than the required', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        first_name: 'Victor',
        last_name: 'Ugwueze',
        email: 'victor@gmail.com',
        password: 'victor419',
        nick_name: 'Thomas',
      })
      .end((error, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('You cannot add extra fields to the user');
        done();
      });
  });
});

describe('/POST register users', () => {
  it('it should throw an error if the fist_name and last_name are not texts', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        first_name: 'Victor55',
        last_name: 'Ugwueze67',
        email: 'victor@gmail.com',
        password: 'victor419',
      })
      .end((error, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Firstname and Lastname must be a text');
        done();
      });
  });
});

describe('/POST register users', () => {
  it('it should not POST a user without all required user fields', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        first_name: 'Okeke',
        last_name: 'Rilwan',
        email: 'virilwan@gmail.com',
      })
      .end((error, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('password is required');
        done();
      });
  });
});

describe('/POST register users', () => {
  it('it should check that password is atleast 6 characters and also contains atleast a number', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        first_name: 'Victor',
        last_name: 'Ugwueze',
        email: 'victoroop@gmail.com',
        password: 'vic',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Password must be atleast 6 digits and should contain atleast a number');
        done();
      });
  });
});

describe('/POST register users', () => {
  it('it should POST a user with all required fields', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('data');
        res.body.data.should.have.property('is_admin');
        res.body.data.should.have.property('first_name');
        res.body.data.should.have.property('last_name');
        res.body.data.should.have.property('email');
        res.body.data.should.have.property('token');
        done();
      });
  });
});

describe('/POST register users', () => {
  it('it should return error if user already exists', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((error, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('User with this email has already been registered');
        done();
      });
  });
});

// Test for loggin in an existing user
describe('/POST login users', () => {
  it('it should not login a user without email and password fields', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'victorAdeoye@gmail.com',
      })
      .end((error, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('password is required');
        done();
      });
  });
});

describe('/POST register users', () => {
  it('it should not login a user with fields more than the required', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'victorAdeoye@gmail.com',
        password: 'victor@45T',
        username: 'Victor',
      })
      .end((error, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('You cannot add extra fields to the login details');
        done();
      });
  });
});

describe('/POST register users', () => {
  it('it should return error if user is not registered', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'tosin@gmail.com',
        password: 'tosinf419',
      })
      .end((error, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('error');
        done();
      });
  });
});

describe('/POST register users', () => {
  it('it should generate an access token when a user is logged in', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send(login)
      .end((error, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('data');
        res.body.data.should.have.property('is_admin');
        res.body.data.should.have.property('first_name');
        res.body.data.should.have.property('last_name');
        res.body.data.should.have.property('email');
        res.body.data.should.have.property('token');
        done();
      });
  });
});

describe('/POST register users', () => {
  it('it should return error if user\'s password is not correct', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'victor@gmail.com',
        password: 'victor',
      })
      .end((error, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('error');
        done();
      });
  });
});

// Test for Fetching existing users
describe('/Get Users', () => {
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
});

describe('/POST register users', () => {
  it('it should return unauthorized user if user is not an admin', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send(login)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('data');
        res.body.data.should.have.property('token');
        const { token } = res.body.data;

        chai.request(app)
          .get('/api/v1/users')
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
});

describe('/POST register users', () => {
  it('it should Login, check token, and GET all users', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send(admin)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('data');
        res.body.data.should.have.property('token');
        const { token } = res.body.data;

        chai.request(app)
          .get('/api/v1/users')
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
});

describe('/POST register users', () => {
  it('it should Login, check token, and GET a specific user by id', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send(admin)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('data');
        res.body.data.should.have.property('token');
        const { token } = res.body.data;

        chai.request(app)
          .get('/api/v1/users/1')
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
});

describe('/POST register users', () => {
  it('it should return invalid id if id is not valid', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send(admin)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('data');
        res.body.data.should.have.property('token');
        const { token } = res.body.data;

        chai.request(app)
          .get('/api/v1/users/p')
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
