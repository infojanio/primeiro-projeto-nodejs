import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';

container.registerSingleton<IAppointmentsRepository>( // O register Singleton instância a classe 1 única vez
  'AppointmentsRepository',
  AppointmentsRepository,
);

container.registerSingleton<IUsersRepository>( // O register Singleton instância a classe 1 única vez
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>( // O register Singleton instância a classe 1 única vez
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<INotificationsRepository>( // O register Singleton instância a classe 1 única vez
  'NotificationsRepository',
  NotificationsRepository,
);
