import { startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  date: Date;
}
// todo service possui um único método
@injectable() // usamos em toda classe que recebe injeção de dependências
class CreateAppointmentService {
  constructor(
    @inject('IAppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  // Toda vez que temos uma função async retornamos uma Promise
  public async execute({ date, provider_id }: IRequest): Promise<Appointment> {
    // Recebimento de informações

    const appointmentDate = startOfHour(date); // converte em horas inteiras, ex: 20:00:00 zera minuto e segundo

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    ); // se tiver agendamento na mesma data

    if (findAppointmentInSameDate) {
      // Tratativa de erros
      throw new AppError('O horário já foi agendado!'); // o service não usa request e response,
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}
export default CreateAppointmentService;
