import { Request, Response, Router } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

// controllers devem possuir no máximo 5 métodos(show, create, delete, index, update)
export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateUser.execute({
      email,
      password,
    });
    // delete user.password; // exclui a senha do retorno

    return response.json({ user: classToClass(user), token }); // classToClass faz com que  @Exclude() e @Expose do User.ts funcione
  }
}
