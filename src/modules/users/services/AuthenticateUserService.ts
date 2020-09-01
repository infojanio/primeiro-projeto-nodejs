import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hasProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    // Verificar se o email é válido
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email ou senha incorreta!', 401);
    }
    // user.password -> senha criptografada
    // password -> senha não criptografada
    const passwordMatched = await this.hasProvider.compareHash(
      password,
      user.password,
    ); // compare é um método que compara a senha com a criptografada

    if (!passwordMatched) {
      throw new AppError('Email ou senha incorreta!', 401);
    }
    const { secret, expiresIn } = authConfig.jwt;
    // não podemos colocar no 1º parâmetro dados confidênciais -> sign
    const token = sign({}, secret, {
      subject: user.id, // o subject será sempre o id do usuário
      expiresIn, // deixe o usuário ser deslogado, após logar vai expirar depois de 1 dia
    });

    // Usuário autenticado
    return {
      user,
      token,
    };
  }
}
export default AuthenticateUserService;
