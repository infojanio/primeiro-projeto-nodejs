import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

// Teste verifica se o usuário foi criado
describe('CreateUser', () => {
  // Testa se isso deve permitir criar novo agendamento
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository(); // criação de repositorio fake
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider, // salvamos na memória
    );

    const user = await createUser.execute({
      name: 'Fulano John Doe',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  // teste verifica se o e-mail já foi criado
  it('should not be able to create a new user with same email from another', async () => {
    const fakeUsersRepository = new FakeUsersRepository(); // criação de repositorio fake
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider, // salvamos na memória
    );

    const user = await createUser.execute({
      name: 'Fulano John Doe',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    expect(
      createUser.execute({
        name: 'Fulano John Doe',
        email: 'teste@teste.com.br',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError); // Se o email estiver duplicado, o teste deverá ser rejeitado
  });
});
