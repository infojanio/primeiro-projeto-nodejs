import { hash, compare } from 'bcryptjs';
import IHashProvider from '../models/IHashProvider';

class FakeHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return payload;
  }

  // compara uma senha não criptografada com uma criptografada
  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed;
  }
}
export default FakeHashProvider;
