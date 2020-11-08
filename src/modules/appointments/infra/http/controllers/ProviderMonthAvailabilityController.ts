import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params; // precisamos do usuário logado
    const { month, year } = request.query;

    const ListProviderMonthAvailability = container.resolve(
      ListProviderMonthAvailabilityService,
    ); // injeção de dependência

    const availability = await ListProviderMonthAvailability.execute({
      provider_id,
      // é necessário fazer a conversão de string p/ Number
      month: Number(month),
      year: Number(year),
    });
    return response.json(availability);
  }
}
