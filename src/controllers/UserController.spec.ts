import { Request } from "express";
import { makeMockRequest } from "../__mocks__/mockRequest.mock";
import { makeMockResponse } from "../__mocks__/mockResponse.mock";
import { UserController } from "./UserController";

const mockUserService = {
  createUser: jest.fn(),
  getUserById: jest.fn(),
  deleteUser: jest.fn(),
  getAllUsers: jest.fn(),
};

jest.mock("../services/UserService", () => {
  return {
    UserService: jest.fn().mockImplementation(() => {
      return mockUserService;
    }),
  };
});

describe("UserController", () => {
  const userController = new UserController();
  const mockResponse = makeMockResponse();

  it("deve adicionar um novo usuário", async () => {
    const mockRequest = {
      body: {
        name: "Nath",
        email: "nath@test.com",
        password: "Abc@1234",
      },
    } as Request;
    await userController.createUser(mockRequest, mockResponse);
    expect(mockResponse.state.status).toBe(201);
    expect(mockResponse.state.json).toMatchObject({
      message: "Usuário criado",
    });
  });

  it("deve retornar um erro caso o usuário não informe o name", async () => {
    const mockRequest = {
      body: {
        name: "",
        email: "nath@test.com",
        password: "Abc@1234",
      },
    } as Request;
    await userController.createUser(mockRequest, mockResponse);
    expect(mockResponse.state.status).toBe(404);
    expect(mockResponse.state.json).toMatchObject({
      message: "Bad Request! Todos os campos são obrigatórios!",
    });
  });

  it("deve retornar um erro caso o usuário não informe o email", async () => {
    const mockRequest = {
      body: {
        name: "Valdir",
        email: "",
        password: "Abc@1234",
      },
    } as Request;
    await userController.createUser(mockRequest, mockResponse);
    expect(mockResponse.state.status).toBe(404);
    expect(mockResponse.state.json).toMatchObject({
      message: "Bad Request! Todos os campos são obrigatórios!",
    });
  });

  it("deve retornar um erro caso o usuário não informe o password", async () => {
    const mockRequest = {
      body: {
        name: "Valdir",
        email: "valdir@dio.tech",
        password: "",
      },
    } as Request;
    await userController.createUser(mockRequest, mockResponse);
    expect(mockResponse.state.status).toBe(404);
    expect(mockResponse.state.json).toMatchObject({
      message: "Bad Request! Todos os campos são obrigatórios!",
    });
  });

  it("deve retornar a lista de usuários", async () => {
    const mockUsers = [
      {
        name: "John Doe",
        email: "johndoe@example.com",
        user_id: "123",
      },
      {
        name: "Jane Smith",
        email: "janesmith@example.com",
        user_id: "456",
      },
    ];
    mockUserService.getAllUsers = jest.fn().mockResolvedValue(mockUsers);
    const mockRequest = {} as Request;

    await userController.getAllUsers(mockRequest, mockResponse);
    expect(mockResponse.state.status).toBe(200);
    expect(mockResponse.state.json).toMatchObject(mockUsers);
  });

  it("deve retornar a mensagem de usuário deletado", async () => {
    const mockRequest = {
      body: {
        name: "Nath",
        email: "nath@test.com",
      },
    } as Request;

    await userController.deleteUser(mockRequest, mockResponse);

    expect(mockResponse.state.status).toBe(200);
    expect(mockResponse.state.json).toMatchObject({
      message: "Usuário Deletado com sucesso.",
    });
  });

  it("deve retornar o usuário com userId informado", async () => {
    const mockRequest = makeMockRequest({
      params: { userId: "123456" },
    });

    userController.getUserById(mockRequest, mockResponse);
    expect(mockUserService.getUserById).toHaveBeenCalledWith("123456");
    expect(mockResponse.state.status).toBe(200);
  });
});
