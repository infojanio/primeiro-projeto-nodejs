import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  // Testa se isso deve permitir criar novo agendamento
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository(); // criação de repositorio fake
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository, // salvamos na memória
    );

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '123123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123');
  });

  // Testa se isso permite criar 2 agendamentos no mesmo horário
  it('should not be able to create two appointments on the some time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository(); // criação de repositorio fake
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository, // salvamos na memória
    );
    const appointmentDate = new Date(2020, 9, 10, 11);

    // cria o 1º agendamento
    await createAppointment.execute({
      date: new Date(),
      provider_id: '123123',
    });

    // Testa se o 2º agendamento vai resultar em erro
    await expect(
      createAppointment.execute({
        date: new Date(),
        provider_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
