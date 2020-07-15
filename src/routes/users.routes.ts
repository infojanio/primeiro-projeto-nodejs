import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import CreateUserService from '../services/CreateUserService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig); //upload é uma instância de  multer

usersRouter.post('/', async (request, response)=> {
    try {
        const { name, email, password } = request.body;
        const createUser = new CreateUserService();
        const user = await createUser.execute({
            name,
            email,
            password,
        });
        delete user.password; //deleta a senha da rota de usuário, por segurança
        return response.json(user);
     
    }
    catch (err) {
        return response.status(400).json({  error: "Aqui"+err.message });      
    }
});

//atualização de um único dado, avatar... usamos o método patch()
usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), async(request, response)=> {
   // console.log(request.file); //mostra todos os detalhes da img salva 
    
        const updateUserAvatar = new UpdateUserAvatarService();

        const user = await updateUserAvatar.execute({
            user_id: request.user.id,
            avatarFilename: request.file.filename,            
        });
        delete user.password; //evitar que a senha seja retornada p/ o frontend

        return response.json(user);
   
});
export default usersRouter;