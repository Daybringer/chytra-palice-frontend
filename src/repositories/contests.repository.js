import Repository from "./Repository";

const resource = "/contests";

export default {
  getAllContests() {
    return Repository.get(`${resource}`);
  },
  createContest(createContestDto) {
    return Repository.post(`${resource}`, createContestDto);
  },
  setWinners(setWinnersDto) {
    return Repository.post(`${resource}/winners`, setWinnersDto);
  },
  getContestByID(id) {
    return Repository.get(`${resource}/${id}`);
  },
  getContestByIDUnfiltered(id) {
    return Repository.get(`${resource}/${id}/unfiltered`);
  },
  removeContest(id) {
    return Repository.delete(`${resource}/${id}`);
  },
  updateContest(id, updateContestDto) {
    return Repository.patch(`${resource}/${id}`, updateContestDto);
  },
};
