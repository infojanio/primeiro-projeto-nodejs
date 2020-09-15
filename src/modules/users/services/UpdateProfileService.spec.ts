import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository; // criação de repositorio fake
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

// Teste

// verifica se o usuário foi criado
describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository(); // criação de repositorio fake
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider, // salvamos na memória
    );
  });

  // Testa se isso permite a atualização de perfil
  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Fulano John Doe',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Fulano De Tal',
      email: 'fulanoteste@teste.com.br',
    });

    expect(updatedUser.name).toBe('Fulano De Tal');
    expect(updatedUser.email).toBe('fulanoteste@teste.com.br');
  });

  // erro ao atualizar usuário que não existe
  it('should not be able to update the profile from non-existing user', async () => {
    expect(
      updateProfile.execute({
        user_id: 'non-existing-user-id',
        name: 'Test',
        email: 'test@test.com.br',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

// testa se vai permitir atualizar email já existente
it('should not be able to change to another user email', async () => {
  await fakeUsersRepository.create({
    name: 'Fulano John Doe',
    email: 'teste@teste.com.br',
    password: '123456',
  });

  const user = await fakeUsersRepository.create({
    name: 'Test',
    email: 'test@teste.com.br',
    password: '123456',
  });

  await expect(
    updateProfile.execute({
      user_id: user.id, // sempre quando fazemos algo assincrono, usamos await
      name: 'Fulano De Tal',
      email: 'teste@teste.com.br',
    }),
  ).rejects.toBeInstanceOf(AppError);
});

// testa se o usuário informou a senha antiga para atualizar
it('should be able to update the password', async () => {
  const user = await fakeUsersRepository.create({
    name: 'Fulano John Doe',
    email: 'teste@teste.com.br',
    password: '123456',
  });

  const updatedUser = await updateProfile.execute({
    user_id: user.id,
    name: 'Fulano De Tal',
    email: 'fulanoteste@teste.com.br',
    old_password: '123456',
    password: '123123',
  });

  expect(updatedUser.password).toBe('123123');
});

// causa erro se a senha antiga não for informada
it('should not be able to update the password with old password', async () => {
  const user = await fakeUsersRepository.create({
    name: 'Fulano John Doe',
    email: 'teste@teste.com.br',
    password: '123456',
  });

  await expect(
    updateProfile.execute({
      user_id: user.id,
      name: 'Fulano De Tal',
      email: 'fulanoteste@teste.com.br',
      password: '123123',
    }),
  ).rejects.toBeInstanceOf(AppError);
});

// não pode atualizar o perfil se a senha antiga for informada errada.
it('should not be able to update the password with wrong old password', async () => {
  const user = await fakeUsersRepository.create({
    name: 'Fulano John Doe',
    email: 'teste@teste.com.br',
    password: '123456',
  });

  await expect(
    updateProfile.execute({
      user_id: user.id,
      name: 'Fulano De Tal',
      email: 'fulanoteste@teste.com.br',
      old_password: 'wrong-old-password',
      password: '123123',
    }),
  ).rejects.toBeInstanceOf(AppError);
});
