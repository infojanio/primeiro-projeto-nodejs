import { container } from 'tsyringe';

import IHashProvider from './HashProvider/models/IHashProvider';
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';

// Toda vez que tiver injeção da classe IHashProvider retornara instância da classe BCyptHashProvider
container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
