import { getRepository, Repository, Raw } from 'typeorm';
import { startOfMonth, endOfMonth } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    // verificar se horário está disponível, se já tem o mesmo horário marcado
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id }, // encontra os agendamentos where data, caso já exista retornará null
    });

    return findAppointment;
  }

  // encontrar todos agendamentos do provider no mês
  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0'); // coloca o zero a esquerda 2 = 02

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`, // converte outro tipo p/ string no Postgres
        ),
      },
    });
    return appointments;
  }

  // encontrar todos agendamentos do provider no dia
  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0'); // coloca o zero a esquerda 2 = 02
    const parsedMonth = String(month).padStart(2, '0'); // coloca o zero a esquerda 2 = 02

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`, // converte outro tipo p/ string no Postgres
        ),
      },
      relations: ['user'], // Eager loading
    });
    console.log(appointments);
    return appointments;
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date,
    }); // cria uma instância

    await this.ormRepository.save(appointment); // salva no banco de dados

    return appointment;
  }
}
export default AppointmentsRepository;
