import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';

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

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    // Verifica se o email já foi cadastrado
    const checkUserExist = await this.usersRepository.findByEmail(email);

    if (checkUserExist) {
      throw new AppError('Atenção: Este email já está sendo usado!');
    }
    const hashedPassword = await this.hashProvider.generateHash(password); // cryptografa a senha do usuário

    // Criação de usuário
    const user = await this.usersRepository.create({
      // cria a instância
      name,
      email,
      password: hashedPassword, // atribui a senha crytografada
    });

    // Invalidando cache quando novo usuário for criado
    await this.cacheProvider.invalidatePrefix('providers-list');

    return user;
  }
}
export default CreateUserService;
