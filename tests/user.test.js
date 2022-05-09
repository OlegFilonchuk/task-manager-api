const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');

const user1 = {
  name: 'oleh',
  email: 'sdfamail@mail.com',
  password: '1fs2345678',
};

describe('User', () => {
  beforeAll(async () => {
    await User.deleteMany();
    await new User(user1).save();
  });

  test('should sign up a new user', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'oleh',
        email: 'mail@mail.com',
        password: '12345678',
      })
      .expect(201);
  });

  test('should login existing user', async () => {
    await request(app)
      .post('/users/login')
      .send({
        email: user1.email,
        password: user1.password,
      })
      .expect(200);
  });

  test('should not log in inexistent user', async () => {
    await request(app)
      .post('/users/login')
      .send({
        email: user1.email,
        password: 'inexistent_password',
      })
      .expect(400);
  });
});
