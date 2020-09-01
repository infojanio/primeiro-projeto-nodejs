import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import Appointment from '../../infra/typeorm/entities/Appointment';

// Teste unitário usando apenas variáveis salvas em memória
class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  // teste p/ encontrar agendamento por data
  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      appointment => isEqual(appointment.date, date), // verifica se as datas são iguais
    );
    return findAppointment;
  }

  // teste criaçap de agendamento
  public async create({
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), date, provider_id });

    this.appointments.push(appointment);
    return appointment;
  }
}
export default AppointmentsRepository;
