import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

// Teste verifica se o usuário foi criado
describe('AuthenticateUser', () => {
  // Testa se isso deve permitir criar novo agendamento
  it('should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository(); // criação de repositorio fake
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    ); // salvamos na memória

    // cria o usuário, pois não tem como autenticar sem que exista usuário
    const user = await createUser.execute({
      name: 'Fulano John Doe',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    // Depois faz o tste de autenticação
    const response = await authenticateUser.execute({
      email: 'teste@teste.com.br',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  // testes que podem falhar se usuário estiver errado
  it('should not be able to authenticate with non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository(); // criação de repositorio fake
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    ); // salvamos na memória

    await expect(
      authenticateUser.execute({
        email: 'teste@teste.com.br',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  // Testa se a senha está errada
  it('should be able to authenticate with wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository(); // criação de repositorio fake
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    ); // salvamos na memória

    // cria o usuário, pois não tem como autenticar sem que exista usuário
    await createUser.execute({
      name: 'Fulano John Doe',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'teste@teste.com.br',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
