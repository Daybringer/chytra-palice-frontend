import Repository from "../../repositories/Repository.js";
import { RepositoryFactory } from "../../repositories/RepositoryFactory.js";
import jwt_decode from "jwt-decode";
const AuthRepository = RepositoryFactory.get("auth");
const ContestsRepository = RepositoryFactory.get("contests");
const WorksRepository = RepositoryFactory.get("works");
const CommentsRepository = RepositoryFactory.get("comments");
const PostsRepository = RepositoryFactory.get("posts");
const TilesRepository = RepositoryFactory.get("tiles");

const state = () => ({
  admin: false,
  name: "",
  email: "",
  token: window.localStorage.getItem("access-token") || "",

  posts: [],
  contests: [],
  works: [],
  tags: [],
  comments: {},
});

const getters = {
  isLoggedIn: (state) => {
    return !!state.token;
  },
  isAdmin: (state) => {
    return state.admin;
  },
  getEmail: (state) => {
    return state.email;
  },
  getName: (state) => {
    return state.name;
  },
  getToken: (state) => {
    return state.token;
  },
};

const actions = {
  // Authentication
  login({ commit, dispatch }, id_token) {
    return new Promise((resolve, reject) => {
      AuthRepository.googleLogin(id_token)
        .then((res) => {
          const accessToken = res.data;

          commit("setToken", accessToken);
          dispatch("saveToken", accessToken);
          dispatch("consumeToken");
          resolve();
        })
        .catch(() => {
          dispatch("logout");
          reject();
        });
    });
  },
  consumeToken({ dispatch, getters }) {
    const token = getters.getToken;
    dispatch("saveProfile", token);
    dispatch("setBearer", token);
  },
  saveProfile({ commit }, token) {
    const { email, name, isAdmin } = jwt_decode(token);
    commit("saveProfile", { isAdmin, name, email });
  },
  setBearer(context, token) {
    Object.assign(Repository.defaults, {
      headers: { Authorization: "Bearer " + token },
    });
  },
  saveToken({ state }) {
    window.localStorage.setItem("access-token", state.token);
  },

  logout({ commit, dispatch }) {
    dispatch("setBearer", "");
    commit("logout");
    window.localStorage.setItem("access-token", "");
  },

  // Tiles
  fetchSpotify() {
    return new Promise((resolve, reject) => {
      TilesRepository.getSpotify()
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  editSpotify(context, episode) {
    return new Promise((resolve, reject) => {
      TilesRepository.setSpotify(episode)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  fetchAktualita() {
    return new Promise((resolve, reject) => {
      TilesRepository.getAktualita()
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  editAktualita(context, content) {
    return new Promise((resolve, reject) => {
      TilesRepository.setAktualita(content)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  // Works
  createWork(context, { createWorkDto, file }) {
    return new Promise((resolve, reject) => {
      // Creating the work entity without uploading the file
      // Splitting the request due to the formData field limitations (only blob and string)
      WorksRepository.createWork(createWorkDto)
        .then((res) => {
          const work = res.data;
          const formData = new FormData();
          formData.set("file", file);
          // Uploading the actual file
          WorksRepository.uploadDocument(formData, work.id)
            .then(() => {
              resolve(work.id);
            })
            .catch((err) => {
              console.log(err);
              reject(err);
            });
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },

  getWorkByID(context, id) {
    return new Promise((resolve, reject) => {
      WorksRepository.getWorkByID(id)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  getAllWorks(context, filterOptions) {
    return new Promise((resolve, reject) => {
      WorksRepository.getAllWorks(filterOptions)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  rejectWork(context, { id, guarantorMessage }) {
    return new Promise((resolve, reject) => {
      WorksRepository.rejectWork({ id, guarantorMessage })
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  approveWork(context, id) {
    return new Promise((resolve, reject) => {
      WorksRepository.approveWork(id)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  fetchNewestWork() {
    return new Promise((resolve, reject) => {
      WorksRepository.getNewestWork()
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => reject(err));
    });
  },
  fetchPopularWork() {
    return new Promise((resolve, reject) => {
      WorksRepository.getPopularWork()
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => reject(err));
    });
  },
  // Comments
  getAllCommentsByWorkID(context, workID) {
    return new Promise((resolve, reject) => {
      CommentsRepository.getAllCommentsByWorkID(workID)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  createComment(context, createCommentDto) {
    return new Promise((resolve, reject) => {
      CommentsRepository.createComment(createCommentDto)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  deleteComment(context, id) {
    return new Promise((resolve, reject) => {
      CommentsRepository.deleteComment(id)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getAllKeywords() {
    return new Promise((resolve, reject) => {
      WorksRepository.getAllKeywords()
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  // Contests
  createContest(context, createContestDto) {
    return new Promise((resolve, reject) => {
      ContestsRepository.createContest(createContestDto)
        .then((res) => resolve(res.data.id))
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },
  getContestByID(context, id) {
    return new Promise((resolve, reject) => {
      ContestsRepository.getContestByID(id)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getContestByIDUnfiltered(context, id) {
    return new Promise((resolve, reject) => {
      ContestsRepository.getContestByIDUnfiltered(id)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getAllContests() {
    return new Promise((resolve, reject) => {
      ContestsRepository.getAllContests()
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => reject(err));
    });
  },
  setWinners(context, setWinnersDto) {
    return new Promise((resolve, reject) => {
      ContestsRepository.setWinners(setWinnersDto)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  removeContest(context, id) {
    return new Promise((resolve, reject) => {
      ContestsRepository.removeContest(id)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  updateContest(context, { id, updateContestDto }) {
    return new Promise((resolve, reject) => {
      ContestsRepository.updateContest(id, updateContestDto)
        .then(() => resolve(id))
        .catch((err) => reject(err));
    });
  },
  // Posts
  createPost(context, { createPostDto, images }) {
    return new Promise((resolve, reject) => {
      PostsRepository.createPost(createPostDto).then((res) => {
        const post = res.data;
        const formData = new FormData();
        images.forEach((image) => {
          formData.append("images", image);
        });
        if (images.length !== 0) {
          PostsRepository.uploadImages(formData, post.id)
            .then(() => {
              resolve(post.id);
            })
            .catch((err) => {
              console.log(err);
              reject(err);
            });
        } else {
          resolve(post.id);
        }
      });
    });
  },
  removePost(context, id) {
    return new Promise((resolve, reject) => {
      PostsRepository.removePost(id)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },
  getAllPosts() {
    return new Promise((resolve, reject) => {
      PostsRepository.getAll()
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
  getPostByID(context, id) {
    return new Promise((resolve, reject) => {
      PostsRepository.getPostByID(id)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  },
};

const mutations = {
  // General
  setToken(state, token) {
    state.token = token;
  },
  logout(state) {
    state.token = "";
    state.name = "";
    state.email = "";
    state.admin = false;
  },
  saveProfile(state, { isAdmin, name, email }) {
    state.admin = isAdmin;
    state.name = name;
    state.email = email;
  },
  // ------------------------------------------------
  // Dev mutation
  setUser(state, { name, email, admin }) {
    state.name = name;
    state.email = email;
    state.admin = admin;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
