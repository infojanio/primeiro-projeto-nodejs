import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUser: CreateUserService;

// Teste verifica se o usuário foi criado
describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  // Testa se isso deve permitir criar novo agendamento
  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Fulano John Doe',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    await expect(user).toHaveProperty('id');
  });

  // teste verifica se o e-mail já foi criado
  it('should not be able to create a new user with same email from another', async () => {
    const user = await createUser.execute({
      name: 'Fulano John Doe',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'Fulano John Doe',
        email: 'teste@teste.com.br',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError); // Se o email estiver duplicado, o teste deverá ser rejeitado
  });
});
