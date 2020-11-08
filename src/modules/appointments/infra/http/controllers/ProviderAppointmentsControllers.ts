import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import { classToClass } from 'class-transformer';

export default class ProviderAppointmentsController {
  // listar agendamentos de provider específico
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id; // recuperar prestador logado, pelo ensureAuthenticated

    const { day, month, year } = request.query;

    const ListProviderAppointments = container.resolve(
      ListProviderAppointmentsService,
    ); // injeção de dependência

    const appointments = await ListProviderAppointments.execute({
      provider_id,
      // é necessário fazer a conversão de string p/ Number
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });
    // console.log(appointments);
    return response.json(classToClass(appointments));
  }
}
