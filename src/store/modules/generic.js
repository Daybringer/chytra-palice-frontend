const state = () => ({
  loggedIn: true,
  admin: true,
  name: "Blanka Činátlová",
  email: "cinatlova@gjk.cz",
  posts: JSON.parse(window.localStorage.getItem("posts")) || [],
  contests: JSON.parse(window.localStorage.getItem("contests")) || [],
  works: JSON.parse(window.localStorage.getItem("works")) || [],
  tags: JSON.parse(window.localStorage.getItem("tags")) || [],
  comments: JSON.parse(window.localStorage.getItem("comments")) || {},
});

const getters = {
  // Generic
  isLoggedIn: (state) => {
    return state.loggedIn;
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
  // getter for the next numeric ID (in posts,contests,works)
  getNextID: (state) => (category) => {
    if (state[category].length === 0) {
      return 0;
    } else {
      return state[category][state[category].length - 1].ID + 1;
    }
  },

  // Posts
  getPosts: (state) => {
    return state.posts;
  },
  getPostByID: (state) => (id) => {
    state.posts.forEach((post) => {
      if (post.id == id) {
        return post;
      }
    });
    return null;
  },
  // Contests
  getContests: (state) => {
    return state.contests;
  },
  getContestByID: (state) => (id) => {
    for (let i = 0; i < state.contests.length; i++) {
      if (state.contests[i].id == id) {
        return state.contests[i];
      }
    }
    return null;
  },
  // Works & tags
  getWorks: (state) => {
    return state.works;
  },
  getWorkByID: (state) => (id) => {
    for (let i = 0; i < state.works.length; i++) {
      if (state.works[i].ID == id) {
        return state.works[i];
      }
    }
    return null;
  },
  getWorksByAuthor: (state) => (authorEmail) => {
    const works = [];

    state.works.forEach((work) => {
      if (work.authorEmail == authorEmail) {
        works.push(work);
      }
    });
    return works;
  },
  getTags: (state) => {
    return state.tags;
  },
  // Comments
  getCommentCollectionByWorkID: (state) => (workID) => {
    if (state.comments[workID]) {
      return state.comments[workID];
    } else {
      null;
    }
  },
  getIDOfLastComment: (state) => (workID) => {
    return state.comments[workID][state.comments[workID].length - 1].ID;
  },
};

const actions = {
  // Dev methods
  changeUser({ commit }, payload) {
    commit("setUser", payload);
    commit("logIn");
  },

  // Generic
  logOut({ commit }) {
    commit("logOut");
  },
  logIn({ commit }) {
    commit("logIn");
  },

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

  // Contests
  saveContests({ state }) {
    window.localStorage.setItem("contests", JSON.stringify(state.contests));
  },

  newContest({ dispatch, commit, getters }, contest) {
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

  // Works
  saveWorks({ state }) {
    window.localStorage.setItem("works", JSON.stringify(state.works));
  },
  newWork({ dispatch, commit, getters }, work) {
    const {
      name,
      authorEmail,
      authorName,
      contestID,
      file,
      keywords,
      maturita,
      subject,
    } = work;
    const dateAdded = new Date();
    const ID = getters.getNextID("works");

    const newWork = {
      ID,
      dateAdded,
      name: name.trim(),
      authorName,
      authorEmail,
      contestID,
      subject,
      maturita,
      keywords,
      // file
      fileName: file.name,
      approvedState: "pending",
      guarantorEmail: "",
      guarantorMessage: "",
    };

    commit("addWork", newWork);
    dispatch("saveWorks");
  },
  approveWork({ commit, dispatch }, { id }) {
    commit("approveWork", id);
    dispatch("saveWorks");
  },
  rejectWork({ commit, dispatch }, { id, quarantorMessage }) {
    commit("rejectWork", { id, quarantorMessage });
    dispatch("saveWorks");
  },
  addNewTags({ commit, dispatch }, tags) {
    commit("addNewTags", tags);
    dispatch("saveTags");
  },
  saveTags({ state }) {
    window.localStorage.setItem("tags", JSON.stringify(state.tags));
  },

  // Comments

  addComment(
    { commit, state, dispatch },
    { authorEmail, authorName, workID, message }
  ) {
    let ID;
    if (Object.keys(state.comments).length === 0) {
      ID = 0;
    } else {
      if (!state.comments[workID]) {
        ID = 0;
      } else {
        ID =
          state.comments[workID][Object.keys(state.comments[workID]).length - 1]
            .ID + 1;
      }
    }

    const newComment = { ID, authorEmail, authorName, workID, message };

    commit("addComment", newComment);
    dispatch("saveComments");
  },

  saveComments({ state }) {
    window.localStorage.setItem("comments", JSON.stringify(state.comments));
  },
};

const mutations = {
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
};

export default {
  state,
  getters,
  actions,
  mutations,
};
