import { describe, expect, it } from 'vitest';
import { compare } from 'bcryptjs';

import { RegisterUseCase } from './register';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

describe('Register Use Case', () => {
  it('Should be able to reigster', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: 'John doe',
      email: 'email@email.com',
      password: '123456'
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('Should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: 'John doe',
      email: 'email@email.com',
      password: '123456'
    });

    const isPasswordCorrectlyHashed = await compare('123456', user.password_hash);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('Should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const email = 'email@email.com';

    await registerUseCase.execute({
      name: 'John doe',
      email,
      password: '123456'
    });

    await expect(() => registerUseCase.execute({
      name: 'John doe',
      email,
      password: '123456'
    })).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});

