import { beforeEach, describe, expect, it } from 'vitest';

import { CheckInUseCase } from './check-in';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';

let checkInRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe('Check in Profile Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(checkInRepository);
  });

  it('Should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});

