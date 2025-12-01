const request = require('supertest');
const app = require('../src/server');

describe('health', () => {
  test('GET /healthz', async () => {
    const res = await request(app).get('/healthz');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('todos', () => {
  test('POST happy path', async () => {
    const res = await request(app).post('/api/v1/todos').send({ title: 'first' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
  test('GET list', async () => {
    const res = await request(app).get('/api/v1/todos');
    expect(Array.isArray(res.body)).toBe(true);
  });
  test('validation error', async () => {
    const res = await request(app).post('/api/v1/todos').send({ title: 123 });
    expect(res.statusCode).toBe(400);
  });
});
