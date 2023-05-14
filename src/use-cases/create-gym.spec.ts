import { beforeEach, describe, expect, it } from 'vitest';

import { CreateGymUseCase } from './create-gym';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it('Should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Gym test',
      description: null,
      phone: null,
      latitude: -23.5211345,
      longitude:  -46.5814662,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});

