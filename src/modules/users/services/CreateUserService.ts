import { hash } from 'bcryptjs';
import { getRepository } from 'typeorm';

import User from '../infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

interface Request {
    name: string;
    email: string;
    password: string;

}
class CreateUserService {
    public async execute({name, email, password}:Request): Promise<User> {
    const usersRepository = getRepository(User); //cria uma constante que habilita usar os métodos do Repository do typeorm    
   
    //Verifica se o email já foi cadastrado
    const checkUserExist = await usersRepository.findOne({
        where: { email },
    });

    if(checkUserExist) {
        throw new AppError('Atenção: Este email já está sendo usado!');     
    }
    const hashedPassword = await hash(password, 8); //cryptografa a senha do usuário
    const user = usersRepository.create({ //cria a instância
        name,
        email,
        password: hashedPassword, //atribui a senha crytografada
    });

    await usersRepository.save(user); //salva a instância no banco de dados
    return user; 
}
 }
export default CreateUserService;