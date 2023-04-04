import { Request, Response } from "express";
import { User } from "../entities/User";
import { UserService } from "../services/UserService";

export class UserController {
  private userService: UserService;

  constructor(userService = new UserService()) {
    this.userService = userService;
  }

  async getAllUsers(request: Request, response: Response) {
    const users = await this.userService.getAllUsers();
    return response.status(200).json(users);
  }

  async createUser(request: Request, response: Response) {
    const { email, name, password } = request.body as User;

    if (!name || !email || !password) {
      return response
        .status(404)
        .json({ message: "Bad Request! Todos os campos são obrigatórios!" });
    }

    await this.userService.createUser(name, email, password);
    response.status(201).json({ message: "Usuário criado" });
  }

  async getUserById(request: Request, response: Response): Promise<Response> {
    const { userId } = request.params;
    const user = await this.userService.getUserById(userId);

    return response.status(200).json({ ...user, password: undefined });
  }

  async deleteUser(request: Request, response: Response): Promise<Response> {
    const { userId } = request.body;
    this.userService.deleteUser(userId);

    return response
      .status(200)
      .json({ message: "Usuário Deletado com sucesso." });
  }
}
