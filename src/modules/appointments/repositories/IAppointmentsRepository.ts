import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '../dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '../dtos/IFindAllInDayFromProviderDTO';

export default interface IAppointmentsRepository {
  // criação de agendamentos
  create(data: ICreateAppointmentDTO): Promise<Appointment>;

  // encontrar agendamento por data
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;

  // Encontrar todos os agendamentos do mês do prestador
  findAllInMonthFromProvider(
    data: IFindAllInMonthFromProviderDTO,
  ): Promise<Appointment[]>;

  // Encontrar todos os agendamentos do dia do prestador
  findAllInDayFromProvider(
    data: IFindAllInDayFromProviderDTO,
  ): Promise<Appointment[]>;
}
