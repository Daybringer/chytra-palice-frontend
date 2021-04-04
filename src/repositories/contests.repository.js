import Repository from "./Repository";

const resource = "/contests";

export default {
  getAllContests() {
    return Repository.get(`${resource}`);
  },
  createContest(createContestDto) {
    return Repository.post(`${resource}`, createContestDto);
  },
  getContestByID(id) {
    return Repository.get(`${resource}/${id}`);
  },
};
