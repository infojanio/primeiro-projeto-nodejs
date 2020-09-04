import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

// Teste verifica se o usuário foi criado
describe('SendForgotPasswordEmail', () => {
  // Testa se isso deve permitir criar novo agendamento
  it('should be able to recover the password using the email', async () => {
    const fakeUsersRepository = new FakeUsersRepository(); // criação de repositorio fake
    const fakeMailProvider = new FakeMailProvider();

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail'); // verifica se sendMail foi disparada

    const sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
    );

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'teste@example.com.br',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'teste@example.com.br',
    });

    expect(sendMail).toHaveBeenCalled();
  });
});

// parei no minuto 09:00
