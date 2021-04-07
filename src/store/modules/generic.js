import Repository from "@/repositories/Repository";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
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
  //-----------------------------------------------------------------------------------------------------------
  // Posts
  savePosts({ state }) {
    window.localStorage.setItem("posts", JSON.stringify(state.posts));
  },
  removePost({ dispatch, commit }, id) {
    commit("removePost", id);
    dispatch("savePosts");
  },
  deleteAllPosts({ commit, dispatch }) {
    commit("deleteAllPosts");
    dispatch("savePosts");
  },

  editPost({ dispatch, commit, getters }, post) {
    const { id, title, content } = post;
    // Object copy <= Can't change original object outside of mutations
    const oldPost = JSON.parse(JSON.stringify(getters.getPostByID(id)));
    oldPost.title = title.trim();
    oldPost.content = content.trim();
    commit("editPost", oldPost);
    dispatch("savePosts");
  },
  newPost({ dispatch, commit, getters }, post) {
    const { content, title } = post;
    const date = new Date();

    // TODO may move this to separate function
    let id;
    const posts = getters.getPosts;
    if (posts.length === 0) {
      id = 0;
    } else {
      id = posts[posts.length - 1].id + 1;
    }

    const newPost = {
      id,
      title: title.trim(),
      author: getters.getName,
      date,
      // `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
      content: content.trim(),
    };

    commit("addPost", newPost);
    dispatch("savePosts");
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
  addPost(state, post) {
    state.posts.push(post);
  },
  editPost(state, post) {
    for (let i = 0; i < state.posts.length; i++) {
      if (state.posts[i].id == post.id) {
        state.posts.splice(i, 1, post);
        return;
      }
    }
  },
  deleteAllPosts(state) {
    state.posts = [];
  },
  removePost(state, id) {
    for (let i = 0; i < state.posts.length; i++) {
      if (state.posts[i].id == id) {
        state.posts.splice(i, 1);
        return;
      }
    }
  },
  // Contests
  addContest(state, contest) {
    state.contests.push(contest);
  },
  addWorkToContest(state, { contestID, work }) {
    state.contests.forEach((contest) => {
      if (contest.id === contestID) {
        contest.nominated.push(work.ID);
        // Should break here, every() might be better suited
      }
    });
  },
  setWinners(state, { contestID, winners }) {
    state.contests.forEach((contest) => {
      if (contest.id == contestID) {
        contest.winners = winners;
        contest.isClosed = true;
        // Should break here, every() might be better suited
      }
    });
  },
  removeContest(state, { contestID }) {
    for (let x = 0; x < state.contests.length; x++) {
      if (state.contests[x].id == contestID) {
        state.contests.splice(x, 1);
        break;
      }
    }
  },
  // Works & keywords
  addWork(state, work) {
    state.works.push(work);
  },
  addNewTags(state, tags) {
    tags.forEach((tag) => {
      state.tags.push(tag);
    });
  },
  rejectWork(state, { id, quarantorMessage }) {
    for (let i = 0; i < state.works.length; i++) {
      if (state.works[i].ID == id) {
        state.works[i].approvedState = "rejected";
        state.works[i].quarantorMessage = quarantorMessage;
        return;
      }
    }
  },
  approveWork(state, id) {
    for (let i = 0; i < state.works.length; i++) {
      if (state.works[i].ID == id) {
        state.works[i].approvedState = "approved";
        return;
      }
    }
  },
  // Comments
  addComment(state, comment) {
    if (!state.comments[comment.workID]) state.comments[comment.workID] = [];
    state.comments[comment.workID].push(comment);
  },
  deleteComment(state, { ID, workID }) {
    let arrayIndex;
    for (let i = 0; i < state.comments[workID].length; i++) {
      if (state.comments[workID][i].ID === ID) {
        arrayIndex = i;
      }
    }
    state.comments[workID].splice(arrayIndex, 1);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
