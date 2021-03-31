import Repository from "./Repository";

const resource = "/contests";

export default {
  getAll(filterOptions = {}) {
    return Repository.get(`${resource}`, { filterOptions });
  },
  createContest(createContestDto) {
    return Repository.post(`${resource}`, createContestDto);
  },
  getContestByID(id) {
    return Repository.get(`${resource}/${id}`);
  },
};
