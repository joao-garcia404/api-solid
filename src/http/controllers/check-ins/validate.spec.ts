import request from 'supertest';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import { createAndAuthenticateUser } from '@/utils/test/createAndAuthenticateUser';

describe('Validate check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should be able to validate a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const user = await prisma.user.findFirstOrThrow();

    const gym = await prisma.gym.create({
      data: {
        title: 'Test e2e gym',
        description: 'Gym for e2e workouts',
        phone: '1111112222',
        latitude: -27.2092052,
        longitude: -49.6401091
      }
    });

    let checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id
      }
    });

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(204);

    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id
      }
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
  });
});
