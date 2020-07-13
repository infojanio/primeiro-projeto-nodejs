import { createConnection } from 'typeorm'; 

createConnection(); //não passamos nada, pois o typeorm vai buscar as configurações dentro do ormconfig.json
