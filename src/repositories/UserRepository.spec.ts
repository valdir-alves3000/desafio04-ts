import { EntityManager } from "typeorm";
import { getMockEntityManager } from "../__mocks__/mockEntityManager.mock";
import { buildMockUser } from "../__mocks__/mockUser.mock";
import { User } from "../entities/User";
import { UserRepository } from "./UserRepository";

describe("UserRepository", () => {
  let userRepository: UserRepository;
  let managerMock: Partial<EntityManager>;
  const findAllReturn: User[] = [
    buildMockUser({ user_id: "1", name: "Mario", email: "mario@dio.tech" }),
    buildMockUser({ user_id: "2", name: "Maria", email: "maria@dio.tech" }),
    buildMockUser({
      user_id: "3",
      name: "Ferreira",
      email: "ferreira@dio.tech",
    }),
  ];

  beforeEach(async () => {
    managerMock = await getMockEntityManager({
      saveReturn: buildMockUser(),
      findOneReturn: buildMockUser(),
      removeReturn: undefined,
      findAllReturn,
    });
    userRepository = new UserRepository(managerMock as EntityManager);
  });

  it("deve cadastrar um novo usuário no banco de dados", async () => {
    const mockUser = buildMockUser();
    const response = await userRepository.createUser(mockUser);
    expect(managerMock.save).toHaveBeenCalled();
    expect(response).toMatchObject(mockUser);
  });

  it("deve buscar um usuário pelo ID", async () => {
    const mockUser = buildMockUser();
    const response = await userRepository.getUserById(mockUser.user_id);
    expect(managerMock.findOne).toHaveBeenCalledWith(User, {
      where: {
        user_id: mockUser.user_id,
      },
    });

    expect(response).toMatchObject(mockUser);
  });

  it("deve retornar um erro ao tentar buscar um usuário não existente", async () => {
    const mockId = "invalid-id";
    managerMock.findOne = jest.fn().mockImplementation(() => {
      throw new Error("User not found");
    });

    expect(userRepository.getUserById(mockId)).rejects.toThrow(
      "User not found"
    );
  });

  it("deve excluir um usuário existente", async () => {
    const mockUser = buildMockUser();
    const response = await userRepository.deleteUser(mockUser.user_id);
    expect(managerMock.remove).toHaveBeenCalledWith(User, mockUser);
    expect(response).toBeUndefined();
  });

  it("deve retornar um erro ao tentar deletar um usuário não existente", async () => {
    const mockUser = buildMockUser({ user_id: "invalid-id" });
    managerMock.remove = jest.fn().mockImplementation(() => {
      throw new Error(`User with ID ${mockUser.user_id} not found.`);
    });

    expect(userRepository.deleteUser(mockUser.user_id)).rejects.toThrow(
      `User with ID ${mockUser.user_id} not found.`
    );
  });

  it("deve retornar todos os usuários do banco de dados", async () => {
    const response = await userRepository.getAllUsers();
    expect(managerMock.find).toHaveBeenCalledWith(User);
    expect(response).toMatchObject(findAllReturn);
  });

  it("deve buscar um usuário pelo email e password", async () => {
    const mockUser = buildMockUser();

    const response = await userRepository.getUserByEmailAndPassword(
      mockUser.email,
      mockUser.password
    );

    expect(managerMock.findOne).toHaveBeenCalledWith(User, {
      where: {
        email: mockUser.email,
        password: mockUser.password,
      },
    });
    expect(response).toEqual(mockUser);
  });
});
