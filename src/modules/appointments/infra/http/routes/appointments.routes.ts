import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate'; // pacote faz validade de route params, query params, body

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsControllers';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

// consulta se o token é válido em todas as rotas
appointmentsRouter.use(ensureAuthenticated);

// criação de agendamentos
appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  appointmentsController.create,
);

// provider logado consulta agendamentos por dia
appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
