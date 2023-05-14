import { beforeEach, describe, expect, it } from 'vitest';

import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch Nearbt Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it('Should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -23.4608597,
      longitude:  -46.4490813,
    });

    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -23.5162129,
      longitude:  -46.5681198,
    });

    const { gyms } = await sut.execute({
      userLatitude: -23.5210923,
      userLongitude: -46.5836981
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Near Gym' })
    ]);
  });
});
