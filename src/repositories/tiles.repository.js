import Repository from "./Repository";

const resource = "/tiles";

export default {
  setAktualita(content) {
    return Repository.post(`${resource}/aktualita`, { text: content });
  },
  setSpotify(content) {
    return Repository.post(`${resource}/spotify`, { episode: content });
  },
  getAktualita() {
    return Repository.get(`${resource}/aktualita`);
  },
  getSpotify() {
    return Repository.get(`${resource}/spotify`);
  },
};
