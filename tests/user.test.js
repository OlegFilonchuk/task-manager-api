const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = require('../src/app');
const User = require('../src/models/user');

const _id = new mongoose.Types.ObjectId();

const user1 = {
  _id,
  name: 'oleh',
  email: 'sdfamail@mail.com',
  password: '1fs2345678',
  tokens: [
    {
      token: jwt.sign({ _id }, process.env.JWT_SECRET),
    },
  ],
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(user1).save();
});

test('should sign up a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'oleh',
      email: 'mail@mail.com',
      password: '12345678',
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: {
      name: 'oleh',
      email: 'mail@mail.com',
    },
    token: user.tokens[0].token,
  });
});

test('should login existing user', async () => {
  const res = await request(app)
    .post('/users/login')
    .send({
      email: user1.email,
      password: user1.password,
    })
    .expect(200);

  const user = await User.findById(res.body.user._id);

  expect(res.body).toMatchObject({
    user: {
      email: user1.email,
      name: user1.name,
    },
    token: user.tokens[1].token,
  });
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

test('should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200);
});

test('should not get profile for an unauthenticated user', async () => {
  request(app).get('/users/me').send().expect(401);
});

test('should delete account for user', async () => {
  const res = await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(res.body._id);
  expect(user).toBeNull();
});
