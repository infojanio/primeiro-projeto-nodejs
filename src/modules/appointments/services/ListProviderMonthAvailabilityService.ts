import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns'; // retorna quantos dias tem no mês

import { is } from 'date-fns/locale';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

// import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable() // disponibilidade de um prestador no mês
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
  }: IRequest): Promise<IResponse> {
    // todos os agendamentos de um mês específico
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        year,
        month,
      },
    );

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));
    // p/ cada dia do mês
    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth }, // Array que vai contar até chegar no último dia do mês
      (_, index) => index + 1,
    );

    // verifica se tem algum agendamento neste dia específico
    const availability = eachDayArray.map(day => {
      const compareDate = new Date(year, month - 1, day, 23, 59, 59); // deixa apenas o dia atual disponível

      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      return {
        day,
        // compara se o dia atual já ultrapassou 13:59 e agendamento de 8 às 17, então são 10 por dia
        available:
          isAfter(compareDate, new Date()) && appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}
export default ListProviderMonthAvailabilityService;
