declare namespace Express { //sobscrever métodos de bibliotecas
    export interface Request {
        user: {
            id: string;
        };
    }
}