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

  it('Should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Far Gym',
        description: 'Gym for e2e workouts',
        phone: '1111112222',
        latitude: -23.4608597,
        longitude:  -46.4490813,
      });

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Near Gym',
        description: 'Gym for e2e workouts',
        phone: '1111112222',
        latitude: -23.5162129,
        longitude:  -46.5681198,
      });

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -23.5162129,
        longitude:  -46.5681198,
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Near Gym'
      })
    ]);
  });
});
