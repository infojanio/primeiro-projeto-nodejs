import { Request, Response, Router } from 'express';
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/CreateUserService';

// controllers devem possuir no máximo 5 métodos(show, create, delete, index, update)
export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    // Cria a instancia
    const createUser = container.resolve(CreateUserService);
    const user = await createUser.execute({
      name,
      email,
      password,
    });
    delete user.password; // deleta a senha da rota de usuário, por segurança
    return response.json(user);
  }
}
