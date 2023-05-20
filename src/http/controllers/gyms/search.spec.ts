import request from 'supertest';
import { app } from '@/app';

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import { createAndAuthenticateUser } from '@/utils/test/createAndAuthenticateUser';

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should be able to search Gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Javascript gym',
        description: 'Gym for e2e workouts',
        phone: '1111112222',
        latitude: -27.2092052,
        longitude: -49.6401091
      });

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Typescript gym',
        description: 'Gym for e2e workouts',
        phone: '1111112222',
        latitude: -27.2092052,
        longitude: -49.6401091
      });

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: 'Javascript'
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Javascript gym'
      })
    ]);
  });
});
