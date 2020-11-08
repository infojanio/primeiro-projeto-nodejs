import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id; // precisamos do usuário logado

    const listProviders = container.resolve(ListProvidersService); // injeção de dependência

    const providers = await listProviders.execute({
      user_id,
    });
    return response.json(classToClass(providers));
  }
}
