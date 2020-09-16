import { uuid } from 'uuidv4';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

import User from '../../infra/typeorm/entities/User';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = []; // criação de array de usuários, vazio

  // método encontrar usuário por id
  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id);
    return findUser;
  }

  // método encontrar usuário por email
  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);
    return findUser;
  }

  // retorna todos os providers exceto o logado (excet_user_id)
  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let { users } = this;

    if (except_user_id) {
      users = this.users.filter(user => user.id !== except_user_id);
    }
    return users;
  }

  // método para criar usuário
  public async create(userDate: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, { id: uuid() }, userDate);
    this.users.push(user);

    return user;
  }

  // método para salva usuário
  public async save(user: User): Promise<User> {
    // verifica se já existe o usuário
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user; // adiciona o usuário na posição
    return user;
  }
}
export default FakeUsersRepository;
