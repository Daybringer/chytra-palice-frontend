import authRepository from "./auth.repository";
import contestsRepository from "./contests.repository";
import rootRepository from "./root.repository";
const repositories = {
  auth: authRepository,
  root: rootRepository,
  contests: contestsRepository,
};

export const RepositoryFactory = {
  get: (name) => repositories[name],
};
