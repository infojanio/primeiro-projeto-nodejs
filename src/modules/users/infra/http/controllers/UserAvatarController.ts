import { Request, Response, Router } from 'express';
import { container } from 'tsyringe';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

// controllers devem possuir no máximo 5 métodos(show, create, delete, index, update)
export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });
    delete user.password; // evitar que a senha seja retornada p/ o frontend

    return response.json(user);
  }
}
