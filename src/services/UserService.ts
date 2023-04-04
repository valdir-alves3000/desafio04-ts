import { sign } from "jsonwebtoken";
import { AppDataSource } from "../database";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository = new UserRepository(AppDataSource.manager)) {
    this.userRepository = userRepository;
  }

  async createUser(
    name: string,
    email: string,
    password: string
  ): Promise<User> {
    if (!name || !email || !password) {
      throw new Error("Todos os campos são obrigatórios!");
    }

    const user = new User(name, email, password);
    return this.userRepository.createUser(user);
  }

  async getUserById(user_id: string) {
    return this.userRepository.getUserById(user_id);
  }

  async getAllUsers() {
    return await this.userRepository.getAllUsers();
  }

  async deleteUser(user_id: string) {
    return await this.userRepository.deleteUser(user_id);
  }

  async getAuthenticatedUser(email: string, password: string): Promise<User | null> {
    return this.userRepository.getUserByEmailAndPassword(email, password);
  }

  async getToken(email: string, password: string): Promise<string> {
    const user = await this.getAuthenticatedUser(email, password);

    if (!user) {
      throw new Error("Usuário/senha incorreto!");
    }

    const tokenData = {
      name: user.name,
      email: user.email,
    };
    const tokenKey = "5dws25wf5wf2d58sv2dq5c212";

    const tokenOptions = {
      subject: user.user_id,
    };

    const token = sign(tokenData, tokenKey, tokenOptions);

    return token;
  }
}
