import authRepository from "./auth.repository";

const repositories = {
  auth: authRepository,
};

export const RepositoryFactory = {
  get: (name) => repositories[name],
};
