import authRepository from "./auth.repository";
import rootRepository from "./root.repository";
const repositories = {
  auth: authRepository,
  root: rootRepository,
};

export const RepositoryFactory = {
  get: (name) => repositories[name],
  getRootRepository: repositories["root"],
  getAuthRepository: repositories["auth"],
};
