import request from 'supertest';
import { app } from '@/app';

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import { createAndAuthenticateUser } from '@/utils/test/createAndAuthenticateUser';

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should be able to create a Gym', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test e2e gym',
        description: 'Gym for e2e workouts',
        phone: '1111112222',
        latitude: -27.2092052,
        longitude: -49.6401091
      });

    expect(response.statusCode).toEqual(204);
  });
});
