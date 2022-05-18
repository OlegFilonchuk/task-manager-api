const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Task = require('../../src/models/task');
const User = require('../../src/models/user');

const user1Id = new mongoose.Types.ObjectId();

const user1 = {
  _id: user1Id,
  name: 'oleh',
  email: 'sdfamail@mail.com',
  password: '1fs2345678',
  tokens: [
    {
      token: jwt.sign({ _id: user1Id }, process.env.JWT_SECRET),
    },
  ],
};

const setupDB = async () => {
  await User.deleteMany();
  await new User(user1).save();
};

const clearDB = async () => {
  await User.deleteMany();
  await Task.deleteMany();
};

module.exports = {
  user1,
  user1Id,
  setupDB,
  clearDB,
};
