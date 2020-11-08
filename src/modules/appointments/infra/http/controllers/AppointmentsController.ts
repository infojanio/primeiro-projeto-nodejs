import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id; // recuperar usuário logado, pelo ensureAuthenticated

    const { provider_id, date } = request.body;

    const createAppointment = container.resolve(CreateAppointmentService); // injeção de dependência

    const appointment = await createAppointment.execute({
      date,
      provider_id,
      user_id,
    });
    // console.log(user_id);
    return response.json(appointment);
  }
}
