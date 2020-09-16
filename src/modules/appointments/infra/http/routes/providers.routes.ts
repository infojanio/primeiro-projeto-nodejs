import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersControllers';

const providersRouter = Router();
const providersController = new ProvidersController();

providersRouter.use(ensureAuthenticated); // consulta se o token é válido em todas as rotas

providersRouter.get('/', providersController.index);

export default providersRouter;
