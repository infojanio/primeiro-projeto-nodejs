import { hash } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    // Verifica se o email já foi cadastrado
    const checkUserExist = await this.usersRepository.findByEmail(email);

    if (checkUserExist) {
      throw new AppError('Atenção: Este email já está sendo usado!');
    }
    const hashedPassword = await hash(password, 8); // cryptografa a senha do usuário

    const user = await this.usersRepository.create({
      // cria a instância
      name,
      email,
      password: hashedPassword, // atribui a senha crytografada
    });

    return user;
  }
}
export default CreateUserService;
