import { Router } from 'express';

import ProfileController from '../controllers/ProfileController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticated); // as rotas abaixo só serão acessíveis se o usuário estiver logado
// As rotas acessíveis recuperamos o id pelo request.user.id

profileRouter.get('/', profileController.show);
profileRouter.put('/', profileController.update);

export default profileRouter;
