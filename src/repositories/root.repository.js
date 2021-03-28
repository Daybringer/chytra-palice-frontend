import Repository from "./Repository";

export default {
  testing() {
    return Repository.get(`/secure`);
  },
};
