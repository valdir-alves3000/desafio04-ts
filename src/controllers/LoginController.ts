import { Request, Response } from "express";
import { User } from "../entities/User";
import { UserService } from "../services/UserService";

export class LoginController {
  private userService: UserService;
  constructor(userService = new UserService()) {
    this.userService = userService;
  }

  async login(request: Request, response: Response) {
    const { email, password } = request.body as User;

    try {
      const token = await this.userService.getToken(email, password);

      return response.status(200).json({ token });
    } catch (error) {
      return response.status(500).json(error);
    }
  }
}
