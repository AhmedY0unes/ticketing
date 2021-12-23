import request from 'supertest';
import { app } from '../../app';

it('return a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
});

it('return a 400 on Invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test.com',
      password: 'password',
    })
    .expect(400);
});

it('return a 400 on Invalid Password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'ad',
    })
    .expect(400);
});

it('return a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com' })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({ password: 'shkjhdskfsd' })
    .expect(400);
});

it('dissallows dupliate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});

//
