import path from 'path';
import fs from 'fs';
import { injectable, inject } from 'tsyringe';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Só usuários autenticados podem mudar o avatar!', 401); // 401 serve p/ indicar que falta autenticação
    }
    if (user.avatar) {
      // deleta avatar anterior, p/ não encher o banco de dados
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath); // stat tras o status

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath); // deleta o avatar
      }
    }
    user.avatar = avatarFilename;
    await this.usersRepository.save(user); // atualiza o avatar, a função save serve tb para atualização
    return user;
  }
}
export default UpdateUserAvatarService;
