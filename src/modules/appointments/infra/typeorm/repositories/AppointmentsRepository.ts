import { getRepository, Repository } from 'typeorm';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    // verificar se horário está disponível, se já tem o mesmo horário marcado
    const findAppointment = await this.ormRepository.findOne({
      where: { date }, // encontra os agendamentos where data, caso já exista retornará null
    });

    return findAppointment;
  }

  public async create({
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({ provider_id, date }); // cria uma instância

    await this.ormRepository.save(appointment); // salva no banco de dados

    return appointment;
  }
}
export default AppointmentsRepository;
