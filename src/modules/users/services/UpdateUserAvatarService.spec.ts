import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

// Teste verifica se o usuário foi criado
describe('UpdateUserAvatar', () => {
  // Testa se isso deve permitir criar novo agendamento
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository(); // criação de repositorio fake
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider, // salvamos na memória
    );

    const user = await fakeUsersRepository.create({
      name: 'Fulano John Doe',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  // testa se usuário existe para que atualize o avatar
  it('should not be able to update avatar from non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository(); // criação de repositorio fake
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider, // salvamos na memória
    );

    expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  // Deve testar se vai deletar o avatar antigo quando atualizado um novo
  it('should delete old avatar when updating new one', async () => {
    const fakeUsersRepository = new FakeUsersRepository(); // criação de repositorio fake
    const fakeStorageProvider = new FakeStorageProvider();

    // spyOn é uma função de espionagem, ele verifica se algum método foi disparado
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider, // salvamos na memória
    );

    const user = await fakeUsersRepository.create({
      name: 'Fulano John Doe',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    // Avatar antigo
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    // Avatar novo
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg'); // espero que seja chamado com avatar antigo
    expect(user.avatar).toBe('avatar2.jpg'); // espero que agora seja atualizado para avatar2.jpg
  });
});
