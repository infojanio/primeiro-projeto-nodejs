import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';
import User from '../models/User';

interface Request {
    user_id: string;
    avatarFilename: string;
}

class UpdateUserAvatarService {
public async execute ( { user_id, avatarFilename }:Request): Promise<User> {
const usersRepository = getRepository(User);
const user = await usersRepository.findOne(user_id);

if(!user) {
    throw new AppError('Só usuários autenticados podem mudar o avatar!', 401); //401 serve p/ indicar que falta autenticação    
} 
if (user.avatar) { //deleta avatar anterior, p/ não encher o banco de dados
const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath); //stat tras o status 

if (userAvatarFileExists) {
    await fs.promises.unlink(userAvatarFilePath); //deleta o avatar
    }
}
user.avatar = avatarFilename;
await usersRepository.save(user); //atualiza o avatar, a função save serve tb para atualização
return user;     
    }
}
export default UpdateUserAvatarService;