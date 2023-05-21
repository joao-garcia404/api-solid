import request from 'supertest';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import { createAndAuthenticateUser } from '@/utils/test/createAndAuthenticateUser';

describe('Create check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        title: 'Test e2e gym',
        description: 'Gym for e2e workouts',
        phone: '1111112222',
        latitude: -27.2092052,
        longitude: -49.6401091
      }
    });

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-in`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -27.2092052,
        longitude: -49.6401091
      });

    expect(response.statusCode).toEqual(201);
  });
});
