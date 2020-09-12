import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

// Teste verifica se o usuário foi criado
describe('ResetPasswordService', () => {
  // a função beforeEach será disparada antes de cada teste it
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository(); // criação de repositorio fake
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      // tem que estar na mesma ordem do ResetPasswordService
      fakeUsersRepository, // @inject('UsersRepository')
      fakeUserTokensRepository, // @inject('UserTokensRepository')
      fakeHashProvider,
    );
  });

  // Testa se a senha será resetada
  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      // cria o usuário
      name: 'John Doe',
      email: 'teste@example.com.br',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id); // gera o token

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPassword.execute({
      password: '123123',
      token,
    });

    const updateUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('123123');
    expect(updateUser?.password).toBe('123123'); // o ? faz a verificação se o updateUser está nulo
  });
  it('should not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPassword.execute({
        token: 'non-existing-token',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existing-user',
    );

    await expect(
      resetPassword.execute({
        token: 'non-existing-token',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password if passed more than 2 hours ', async () => {
    const user = await fakeUsersRepository.create({
      // cria o usuário
      name: 'John Doe',
      email: 'teste@example.com.br',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id); // gera o token

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      // função p/ retornar uma data do futuro
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        password: '123123',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
