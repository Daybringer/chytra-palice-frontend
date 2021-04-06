import authRepository from "./auth.repository";
import commentsRepository from "./comments.repository";
import contestsRepository from "./contests.repository";
import rootRepository from "./root.repository";
import worksRepository from "./works.repository";
import postsRepository from "./posts.repository";

const repositories = {
  auth: authRepository,
  root: rootRepository,
  contests: contestsRepository,
  works: worksRepository,
  comments: commentsRepository,
  posts: postsRepository,
};

export const RepositoryFactory = {
  get: (name) => repositories[name],
};
