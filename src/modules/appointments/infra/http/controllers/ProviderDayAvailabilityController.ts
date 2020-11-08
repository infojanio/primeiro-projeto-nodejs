import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params; // precisamos do usuário logado
    const { day, month, year } = request.query; // os query retornam em formato string

    const ListProviderDayAvailability = container.resolve(
      ListProviderDayAvailabilityService,
    ); // injeção de dependência

    const availability = await ListProviderDayAvailability.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year), // é necessário fazer a conversão de string p/ Number
    });
    return response.json(availability);
  }
}
