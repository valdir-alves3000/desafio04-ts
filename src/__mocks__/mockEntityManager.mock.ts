import { EntityManager } from "typeorm";
import { User } from "../entities/User";

interface MockManagerArgs {
  saveReturn?: object | [object];
  findOneReturn?: object | null;
  removeReturn: void;
  findAllReturn: User[];
}

export const getMockEntityManager = async ({
  saveReturn,
  findOneReturn,
  removeReturn,
  findAllReturn,
}: MockManagerArgs): Promise<EntityManager> => {
  const manager: Partial<EntityManager> = {};

  manager.save = jest
    .fn()
    .mockImplementation(() => Promise.resolve(saveReturn));
  manager.findOne = jest
    .fn()
    .mockImplementation(() => Promise.resolve(findOneReturn));
  manager.remove = jest
    .fn()
    .mockImplementation(() => Promise.resolve(removeReturn));
  manager.find = jest
    .fn()
    .mockImplementation(() => Promise.resolve(findAllReturn));

  return manager as EntityManager;
};
