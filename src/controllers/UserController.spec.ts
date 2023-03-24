import { Request } from "express";
import { UserService } from "../services/UserService";
import { makeMockResponse } from "../__mocks__/mockResponse.mock";
import { UserController } from "./UserController";

describe("UserController", () => {
  const mockUserService: Partial<UserService> = {
    createUser: jest.fn(),
    getAllUsers: jest.fn(),
    deleteUser: jest.fn(),
  };

  const userController = new UserController(mockUserService as UserService);

  it("Deve adicionar um novo usuário", () => {
    const mockRequest = {
      body: {
        name: "Nath",
        email: "nath@test.com",
      },
    } as Request;
    const mockResponse = makeMockResponse();
    userController.createUser(mockRequest, mockResponse);
    expect(mockResponse.state.status).toBe(201);
    expect(mockResponse.state.json).toMatchObject({
      message: "Usuário criado",
    });
  });

  it("Deve retornar a lista de usuários", () => {
    const mockRequest = {
      body: {
        name: "Valdir",
        email: "valdir@test.com",
      },
    } as Request;
    const mockResponse = makeMockResponse();
    userController.createUser(mockRequest, mockResponse);
    userController.getAllUsers(mockRequest, mockResponse);

    expect(mockResponse.state.status).toBe(200);
  });

  it("Deve deletar um usuário existente", () => {
    const mockRequest = {
      body: {
        name: "Nath",
        email: "nath@test.com",
      },
    } as Request;

    const mockResponse = makeMockResponse();
    userController.deleteUser(mockRequest, mockResponse);

    expect(mockResponse.state.status).toBe(204);
    expect(mockResponse.state.json).toMatchObject({
      message: "Usuário Deletado com sucesso.",
    });
  });
});
