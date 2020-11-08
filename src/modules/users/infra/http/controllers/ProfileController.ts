import { Request, Response, Router } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

// controllers devem possuir no máximo 5 métodos(show, create, delete, index, update)
export default class ProfileController {
  // rota para mostrar os dados do perfil
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const showProfile = container.resolve(ShowProfileService);
    const user = await showProfile.execute({ user_id });
    // delete user.password; // não mostrar a senha na rota
    return response.json(classToClass(user)); // não mostrar a senha na rota e mostra a url do avatar
  }

  // rota para atualizar os dados do perfil
  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { name, email, old_password, password } = request.body;

    // Cria a instancia
    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      old_password,
      password,
    });
    // delete user.password; // deleta a senha da rota de usuário, por segurança
    return response.json(classToClass(user));
  }
}
