import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeCacheProvider: FakeCacheProvider;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();
    fakeAppointmentsRepository = new FakeAppointmentsRepository(); // criação de repositorio fake
    fakeNotificationsRepository = new FakeNotificationsRepository();

    createAppointment = new CreateAppointmentService(
      fakeCacheProvider,
      fakeAppointmentsRepository, // salvamos na memória
      fakeNotificationsRepository,
    );
  });

  // Testa se isso deve permitir criar novo agendamento
  it('should be able to create a new appointment', async () => {
    // simula uma nova implementação com nova data
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    // cria uma data agendamento após a data simulada
    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      user_id: 'user-id',
      provider_id: 'provider-id',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider-id');
  });

  // Testa se isso permite criar 2 agendamentos no mesmo horário
  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 8, 27, 11); // Tem que ser uma data futura

    // cria o 1º agendamento
    await createAppointment.execute({
      date: appointmentDate,
      user_id: 'user-id',
      provider_id: 'provider-id',
    });

    // Testa se o 2º agendamento vai resultar em erro
    await expect(
      createAppointment.execute({
        date: appointmentDate,
        user_id: 'user-id',
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  // Testa se permite criar agendamentos em datas passadas
  it('should not be able to create appointments on a past date', async () => {
    // simula que está em data passada
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    // informa data agendamento anterior
    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        user_id: 'user-id',
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  // Testa se permite criar agendamento do usuário com o mesmo id do prestador com ele mesmo
  it('should not be able to create an appointment with same user as provider', async () => {
    // simula que está em data passada
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    // informa data agendamento anterior
    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 13),
        user_id: 'user-id',
        provider_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  // Testa se permite criar agendamento do usuário com o mesmo id do prestador com ele mesmo
  it('should not be able to create an appointment before 8am and afther 5pm', async () => {
    // simula que está em data passada
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    // informa data agendamento fora do horário 08 as 17h
    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 7),
        user_id: 'user-id',
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);

    // informa data agendamento fora do horário 08 as 17h
    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 18),
        user_id: 'user-id',
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
