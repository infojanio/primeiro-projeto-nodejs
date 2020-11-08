import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/cache';

import ICacheProvider from '../models/ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value)); // no banco de dados Redis só enviamos chave e valor
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }
    const parseData = JSON.parse(data) as T;
    return parseData;
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key); // deleta a chave do banco de dados
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`); // id dos usuários salvos

    const pipeline = this.client.pipeline(); // pipeline, executar multiplas operações ao mesmo tempo

    keys.forEach(key => {
      pipeline.del(key);
    });
    await pipeline.exec(); // faz todos os deletes ao mesmo tempo
  }
}
