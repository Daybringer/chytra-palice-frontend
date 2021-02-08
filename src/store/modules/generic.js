const state = () => ({
  loggedIn: true,
  admin: true,
  name: "Blanka Činátlova",
  posts: JSON.parse(window.localStorage.getItem("posts")) || [],
  contests: JSON.parse(window.localStorage.getItem("contests")) || [],
});

const getters = {
  isLoggedIn: (state) => {
    return state.loggedIn;
  },
  isAdmin: (state) => {
    return state.admin;
  },
  getName: (state) => {
    return state.name;
  },
  getPosts: (state) => {
    return state.posts;
  },
  getPostByID: (state) => (id) => {
    for (let i = 0; i < state.posts.length; i++) {
      if (state.posts[i].id == id) {
        return state.posts[i];
      }
    }
    return null;
  },
  getContests: (state) => {
    return state.contests;
  },
};

const actions = {
  savePosts({ state }) {
    window.localStorage.setItem("posts", JSON.stringify(state.posts));
  },
  removePost({ dispatch, commit }, id) {
    commit("removePost", id);
    dispatch("savePosts");
  },
  logOut({ commit }) {
    commit("logOut");
  },
  logIn({ commit }) {
    commit("logIn");
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
  // Contests
  saveContests({ state }) {
    window.localStorage.setItem("contests", JSON.stringify(state.contests));
  },
  newContest({ dispatch, commit, getters }, contest) {
    console.log(contest);
    const { name, endDate, category, description } = contest;
    const date = new Date();

    // TODO may move this to separate function
    let id;
    const contests = getters.getContests;
    if (contests.length === 0) {
      id = 0;
    } else {
      id = contests[contests.length - 1].id + 1;
    }

    const newContest = {
      id,
      dateCreated: date,
      dateEnding: endDate,
      name: name.trim(),
      category,
      description: description.trim(),
      //
      isClosed: false,
      winners: [],
      nominated: [],
    };

    commit("addContest", newContest);
    dispatch("saveContests");
  },
};

const mutations = {
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
  logOut(state) {
    state.loggedIn = false;
  },
  logIn(state) {
    state.loggedIn = true;
  },
  // Contests
  addContest(state, contest) {
    state.contests.push(contest);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
