import { beforeEach, describe, expect, it } from 'vitest';
import { hash } from 'bcryptjs';

import { AuthenticateUseCase } from './authenticate';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it('Should be able to authenticate', async () => {
    await usersRepository.create({
      email: 'email@email.com',
      name: 'Name',
      password_hash: await hash('123456', 6)
    });

    const { user } = await sut.execute({
      email: 'email@email.com',
      password: '123456'
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('Should not able to authenticate with wrong email', async () => {
    await expect(() => sut.execute({
      email: 'email@email.com',
      password: '123456'
    })).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('Should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      email: 'email@email.com',
      name: 'Name',
      password_hash: await hash('123456', 6)
    });

    await expect(() => sut.execute({
      email: 'email@email.com',
      password: '111111'
    })).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});

