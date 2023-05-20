import type { FastifyInstance } from 'fastify';

import request from 'supertest';

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server)
    .post('/users')
    .send({
      name: 'Test name',
      email: 'e2e-register@email.com',
      password: '123456'
    });

  const authResponse = await request(app.server)
    .post('/sessions')
    .send({
      email: 'e2e-register@email.com',
      password: '123456'
    });

  const { token } = authResponse.body;

  return {
    token,
  };
}
