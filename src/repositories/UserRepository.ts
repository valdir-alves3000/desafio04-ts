import { EntityManager } from "typeorm";
import { AppDataSource } from "../database";
import { User } from "../entities/User";

export class UserRepository {
  private manager: EntityManager;

  constructor(manager = AppDataSource.manager) {
    this.manager = manager;
  }

  async createUser(user: User): Promise<User> {
    return await this.manager.save(user);
  }

  async getUserById(user_id: string): Promise<User> {
    const user = await this.manager.findOne(User, {
      where: {
        user_id,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async getUserByEmailAndPassword(
    email: string,
    password: string
  ): Promise<User | null> {
    return this.manager.findOne(User, {
      where: {
        email,
        password,
      },
    });
  }

  async getAllUsers(): Promise<User[]> {
    return await this.manager.find(User);
  }

  async deleteUser(user_id: string): Promise<void> {
    const user = await this.manager.findOne(User, {
      where: { user_id },
    });

    if (!user) {
      throw new Error(`User with ID ${user_id} not found.`);
    }

    await this.manager.remove(User, user);
  }
}
