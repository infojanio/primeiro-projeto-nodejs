import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository; // criação de repositorio fake
let showProfile: ShowProfileService;

// Teste

// verifica se o usuário foi criado
describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository(); // criação de repositorio fake

    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  // Testa se isso mostra o perfil
  it('should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Fulano John Doe',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('Fulano John Doe');
    expect(profile.email).toBe('teste@teste.com.br');
  });

  // mostra erro ao tentar exibir perfil inexistente
  it('should not be able to show the profile from non-existing user', async () => {
    expect(
      showProfile.execute({
        user_id: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
