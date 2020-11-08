import { createConnections } from 'typeorm';

createConnections(); // não passamos nada, pois o typeorm vai buscar as configurações dentro do ormconfig.json
