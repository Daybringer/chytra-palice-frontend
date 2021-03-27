import Repository from "./Repository";

const resource = "/auth";

export default {
  googleLogin(authCode) {
    return Repository.post(`${resource}/google`, { authCode });
  },
  googleLogout() {
    return Repository.post(`${resource}/logout`);
  },
};
