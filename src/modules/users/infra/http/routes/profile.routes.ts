import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate'; // pacote faz validade de route params, query params, body

import ProfileController from '../controllers/ProfileController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticated); // as rotas abaixo só serão acessíveis se o usuário estiver logado
// As rotas acessíveis recuperamos o id pelo request.user.id

profileRouter.get('/', profileController.show);
profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      // pode-se fazer uma melhoria, -> os 2 campos abaixo ser obrigatórios apenas se existir o old_password
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')), // só será válido se as senhas forem iguais
    },
  }),
  profileController.update,
);

export default profileRouter;
