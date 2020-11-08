import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}
// todo service possui um único método
@injectable() // usamos em toda classe que recebe injeção de dependências
class CreateAppointmentService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  // Toda vez que temos uma função async retornamos uma Promise
  public async execute({
    date,
    provider_id,
    user_id,
  }: IRequest): Promise<Appointment> {
    // Recebimento de informações

    const appointmentDate = startOfHour(date); // converte em horas inteiras, ex: 20:00:00 zera minuto e segundo

    if (isBefore(appointmentDate, Date.now())) {
      // se a data do agendamento for antes de agora
      throw new AppError("You can't create an appointment on a past date");
    }
    // verifica se o usuário provider marcou horário com ele mesmo
    if (user_id === provider_id) {
      throw new AppError('Você não pode criar um agendamento com você mesmo!'); // o service não usa request e response,
    }

    // verifica se o agendamento foi feito fora do horário de atendimento
    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        'Você não pode criar agendamento fora do horário de atendimento!',
      );
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate, // se tiver agendamento na mesma data
      provider_id,
    );

    if (findAppointmentInSameDate) {
      // Tratativa de erros
      throw new AppError('O horário já foi agendado!'); // o service não usa request e response,
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    // Envia notificação para o usuário
    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'"); // formato retirado da documentação do date-fns
    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento dia ${dateFormatted} `,
    });
    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    );

    return appointment;
  }
}
export default CreateAppointmentService;
