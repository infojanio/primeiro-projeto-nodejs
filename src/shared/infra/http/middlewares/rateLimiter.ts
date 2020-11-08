import { Request, Response, NextFunction } from 'express';
import redis from 'redis';
import AppError from '@shared/errors/AppError';
import { RateLimiterRedis } from 'rate-limiter-flexible';

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT), // converte para tipo Number
  password: process.env.REDIS_PASS || undefined,
});

// Quantidade de requisições em 1 segundo
const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit',
  points: 5, // 5 requisições
  duration: 1, // em 1 segundo
});

// função para evitar várias requisições que visam derrubar o servidor(contra-ataques hackers)
export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await limiter.consume(request.ip);

    return next();
  } catch (err) {
    throw new AppError('Too many requests', 429);
  }
}
// Sugestão: implementar o código para que ele identifique o ip que está fazendo várias requisições e bloqueie por 24h
