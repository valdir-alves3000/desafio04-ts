import { User } from "../entities/User";

export function buildMockUser(overrides: Partial<User> = {}): User {
  return {
    user_id: overrides.user_id ?? "123456",
    email: overrides.email ?? "valdir@dio.tech",
    name: overrides.name ?? "Valdir",
    password: overrides.password ?? "Abc@1234",
    ...overrides,
  };
}
