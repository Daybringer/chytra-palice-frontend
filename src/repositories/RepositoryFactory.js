import authRepository from "./auth.repository";
import contestsRepository from "./contests.repository";
import rootRepository from "./root.repository";
import worksRepository from "./works.repository";
const repositories = {
  auth: authRepository,
  root: rootRepository,
  contests: contestsRepository,
  works: worksRepository,
};

export const RepositoryFactory = {
  get: (name) => repositories[name],
};
