import { hash, compare } from 'bcryptjs';
import { getRepository } from 'typeorm';

import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    // Verificar se o email é válido
    const usersRepository = getRepository(User);
    const user = await usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new AppError('Email ou senha incorreta!', 401);
    }
    // user.password -> senha criptografada
    // password -> senha não criptografada
    const passwordMatched = await compare(password, user.password); // compare é um método que compara a senha com a criptografada

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
