export interface User {
  name: string;
  email: string;
}

const db = [
  {
    name: "Joana",
    email: "joana@dio.com",
  },
];

export class UserService {
  db: User[];

  constructor(database = db) {
    this.db = database;
  }

  createUser(name: string, email: string): User[] | {} {
    const user = {
      name,
      email,
    };

    if (!name || !email) {
      return { message: "Nome e email são campos Obrigatórios." };
    }

    this.db.push(user);
    return this.db;
  }

  getAllUsers(): User[] {
    return this.db;
  }

  deleteUser(email: string): string | null {
    const users = this.db.filter((user) => user.email === email);
    if (users.length === 0) return null;

    this.db = this.db.filter((user) => user.email != email);

    return "Usuário Deletado com sucesso.";
  }
}
