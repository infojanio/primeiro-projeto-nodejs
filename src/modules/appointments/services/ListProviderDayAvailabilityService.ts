import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns'; // retorna quantos dias tem no mês

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

// import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean; // hora disponível ou não
}>;

@injectable() // disponibilidade de um prestador no mês
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        day,
        month,
        year,
      },
    );

    const hourStart = 8; // 1º horário do dia

    // todos horários do dia
    const eachHourArray = Array.from(
      { length: 10 }, // horários de 8 às 17h
      (_, index) => index + hourStart, // percorre o array, e começa as 8h
    );

    const availability = eachHourArray.map(hour => {
      // verifica se tem agendamento p/ esta hora
      const hasAppointmentInHour = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      const currentDate = new Date(Date.now()); // data atual
      const compareDate = new Date(year, month - 1, day, hour); // data de agora - 2020-09-17 08:00:00

      return {
        hour, // se não tiver um agendamento available=true && data agendamento ser depois da atual
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}
export default ListProviderDayAvailabilityService;
