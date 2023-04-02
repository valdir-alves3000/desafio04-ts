import * as jwt from "jsonwebtoken";
import { buildMockUser } from "../__mocks__/mockUser.mock";
import { UserService } from "./UserService";

jest.mock("../repositories/UserRepository");
jest.mock("../database", () => {
  initialize: jest.fn();
});
jest.mock("jsonwebtoken");

const mockUserRepository = require("../repositories/UserRepository");

describe("UserService", () => {
  const userService = new UserService(mockUserRepository);
  const errorMessage = "Todos os campos são obrigatórios!";
  const mockUserId = "invalid-id";

  it("deve adicionar um novo usuário", async () => {
    const mockUser = buildMockUser({
      user_id: "125639",
      name: "Nath",
      email: "nath@test.com",
      password: "Abc@1234",
    });
    mockUserRepository.createUser = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockUser));
    const response = await userService.createUser(
      "Nath",
      "nath@test.com",
      "Abc@1234"
    );
    expect(mockUserRepository.createUser).toHaveBeenCalled();
    expect(response).toMatchObject({
      user_id: "125639",
      name: "Nath",
      email: "nath@test.com",
      password: "Abc@1234",
    });
  });

  it("deve retornar um erro caso usuário não informe o email", async () => {
    expect(userService.createUser("Valdir", "", "Abc@1234")).rejects.toThrow(
      errorMessage
    );
  });

  it("deve retornar um erro caso usuário não informe o nome", async () => {
    expect(
      userService.createUser("", "valdir@dio.tech", "Abc@1234")
    ).rejects.toThrow(errorMessage);
  });

  it("deve retornar um erro caso usuário não informe o password", async () => {
    expect(
      userService.createUser("Valdir", "valdir@dio.tech", "")
    ).rejects.toThrow(errorMessage);
  });

  it("deve buscar um usuário pelo ID", async () => {
    const mockUser = buildMockUser({
      user_id: "89654",
      email: "lucas@test.com",
      name: "Lucas",
    });

    mockUserRepository.getUserById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockUser));

    const response = await userService.getUserById(mockUser.user_id);
    expect(response).toMatchObject(mockUser);
  });

  it("deve retornar um erro ao tentar buscar um usuário não existente", () => {
    mockUserRepository.getUserById = jest.fn().mockImplementation(() => {
      throw new Error(`User with ID ${mockUserId} not found.`);
    });

    expect(userService.getUserById(mockUserId)).rejects.toThrow(
      `User with ID ${mockUserId} not found.`
    );
  });

  it("deve retornar a lista de usuários", async () => {
    const mockUsers = [
      buildMockUser({
        user_id: "125896",
        name: "nath",
        email: "nath@test.com",
      }),
      buildMockUser({
        user_id: "2369755",
        name: "Valdir",
        email: "valdir@diobank.tech",
      }),
    ];
    mockUserRepository.getAllUsers = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockUsers));
    const users = await userService.getAllUsers();
    expect(users).toMatchObject([
      {
        name: "nath",
        email: "nath@test.com",
        user_id: "125896",
      },
      {
        name: "Valdir",
        user_id: "2369755",
        email: "valdir@diobank.tech",
      },
    ]);
  });

  it("deve deletar um usuário", async () => {
    const mockUser = buildMockUser({
      user_id: "589655",
      email: "delete-user@dio.tech",
    });
    mockUserRepository.deleteUser = jest.fn().mockResolvedValue(undefined);

    expect(userService.deleteUser(mockUser.user_id)).resolves.toBeUndefined();
  });

  it("deve retornar um erro ao tentar deletar um usuário não existente", async () => {
    mockUserRepository.deleteUser = jest.fn().mockImplementation(() => {
      throw new Error(`User with ID ${mockUserId} not found.`);
    });
    expect(userService.deleteUser(mockUserId)).rejects.toThrow(
      `User with ID ${mockUserId} not found.`
    );
  });

  it("deve retornar um token de usuário", async () => {
    jest
      .spyOn(userService, "getAuthenticatedUser")
      .mockImplementation(() => Promise.resolve(buildMockUser()));

    jest.spyOn(jwt, "sign").mockImplementation(() => "token");

    const token = await userService.getToken("valdir@dio.tech", "Abc@1234");

    expect(token).toBe("token");
  });

  it("deve retornar nulo ao buscar um usuário pelo password/email incorreto", async () => {
    jest
      .spyOn(userService, "getAuthenticatedUser")
      .mockImplementation(() => Promise.resolve(null));

    expect(
      userService.getToken("invalid@dio.tech", "inavalid@1234")
    ).rejects.toThrow("Usuário/senha incorreto!");
  });
});
