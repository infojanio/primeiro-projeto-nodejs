import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate'; // pacote faz validade de route params, query params, body

import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

// recuperação de senha
passwordRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().required(), // validar o email que é obrigatório
    },
  }),
  forgotPasswordController.create,
);

// resetar a senha
passwordRouter.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')), // só será válido se as senhas forem iguais
    },
  }),
  resetPasswordController.create,
);

export default passwordRouter;
