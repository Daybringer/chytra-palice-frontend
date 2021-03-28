import Repository from "./Repository";

const resource = "/auth";

export default {
  googleLogin(id_token) {
    return Repository.post(`${resource}/google`, { id_token });
  },
};
