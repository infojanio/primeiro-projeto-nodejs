import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

export default interface ICreateUserDTO {
  name: string;
  email: string;
  password: string;
}
