import 'reflect-metadata';

import express from 'express';
import routes from './routes';
import './database';

const app = express();

app.use(express.json());
app.use(routes);

app.get('/', (request, response)=> {
return response.json({Message: "hello Go Stack"});
});

app.listen(3333, ()=> {
    console.log("Servidor funcionando!");
});
