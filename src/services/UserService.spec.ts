import { User, UserService } from "./UserService";

describe("UserService", () => {
  const mockDb: User[] = [];
  const userService = new UserService(mockDb);

  it("Deve adicionar um novo usuário", () => {
    const users = userService.createUser("nath", "nath@test.com");
    expect(users).toMatchObject([{ email: "nath@test.com", name: "nath" }]);
  });

  it("Deve retornar um erro caso usuário não informe o email", () => {
    expect(userService.createUser("Valdir", "")).toMatchObject({
      message: "Nome e email são campos Obrigatórios.",
    });
  });

  it("Deve retornar um erro caso usuário não informe o nome", () => {
    expect(userService.createUser("", "valdir@dio.tech")).toMatchObject({
      message: "Nome e email são campos Obrigatórios.",
    });
  });

  it("Deve retornar a lista de usuários", () => {
    userService.createUser("Valdir", "valdir@diobank.tech");
    const users = userService.getAllUsers();
    expect(users).toMatchObject([
      {
        name: "nath",
        email: "nath@test.com",
      },
      {
        name: "Valdir",
        email: "valdir@diobank.tech",
      },
    ]);
  });

  it("Deve deletar um usuário", () => {
    const result = userService.deleteUser("valdir@diobank.tech");
    expect(result).toContain("Usuário Deletado com sucesso.");
  });

  it("Deve retornar um erro ao tentar deletar um usuário não existente", () => {
    expect(userService.deleteUser("valdir@di.tech")).toBeNull();
  });
});
