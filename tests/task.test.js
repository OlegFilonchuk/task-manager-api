const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const { clearDB, setupDB, user1, user1Id } = require('./fixtures/db');

describe('Task', () => {
  beforeEach(setupDB);

  // afterEach(clearDB);

  test('should create task for user', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${user1.tokens[0].token}`)
      .send({
        description: 'Test desc',
      })
      .expect(201);

    const task = await Task.findById(res.body._id);
    expect(task.description).toBe('Test desc');
  });
});
