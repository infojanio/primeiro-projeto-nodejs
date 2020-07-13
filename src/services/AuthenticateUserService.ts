import { hash, compare } from 'bcryptjs';
import { getRepository } from 'typeorm';
import User from '../models/User';
import { sign } from 'jsonwebtoken';

 interface Request {
     email: string;
     password: string;
 }

interface Response {
    user: User;
    token: string;
}

 class AuthenticateUserService {
     public async execute({email, password}:Request): Promise<Response> {
        //Verificar se o email é válido
        const usersRepository = getRepository(User);
        const user = await usersRepository.findOne({
            where: {email} });
        
        if (!user) {
            throw new Error('Email ou senha incorreta!');
        }
        //user.password -> senha criptografada
        //password -> senha não criptografada
        const passwordMatched = await compare(password, user.password); //compare é um método que compara a senha com a criptografada
        
        if(!passwordMatched) {
            throw new Error ('Email ou senha incorreta!');
        }

        const token = sign({}, '2593d40e8e21eada45123bf7a2a7b6b6', {
            subject: user.id,
            expiresIn: '1d' //deixe o usuário ser deslogado, após logar vai expirar depois de 1 dia
        });

        //Usuário autenticado
        return {
            user,
            token,
        };
     } 
 }
  export default AuthenticateUserService;