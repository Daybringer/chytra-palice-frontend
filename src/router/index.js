import Vue from "vue";
import VueRouter from "vue-router";

// Store
import store from "../store";

// Components
import Index from "../views/Index.vue";
import DevPanel from "../views/DevPanel.vue";
import NewPostPanel from "../views/NewPostPanel.vue";
import PostPanel from "../views/PostPanel.vue";
import EditPostPanel from "../views/EditPostPanel.vue";
import NotFound from "../views/NotFound.vue";
import NewContestPanel from "../views/NewContestPanel.vue";
import ContestsPanel from "../views/ContestsPanel.vue";
import ContestPanel from "../views/ContestPanel.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Index,
    meta: {
      title: "Chytrá palice - literární soutěž GJK",
    },
  },
  // TODO remove on deployment
  {
    path: "/dev",
    component: DevPanel,
    meta: {
      title: "Chytrá palice - Dev Dashboard",
    },
  },
  {
    path: "/clanek/:id",
    component: PostPanel,
    // Title is overwritten in component
    meta: {
      title: "Chytrá palice - Článek",
    },
  },
  {
    path: "/clanek/edit/:id",
    component: EditPostPanel,
    meta: {
      title: "Chytrá palice - Úprava článku",
      is_logged: true,
      is_admin: true,
    },
  },
  {
    path: "/novy-clanek",
    component: NewPostPanel,
    meta: {
      title: "Chytrá palice - Nový článek",
      is_logged: true,
      is_admin: true,
    },
  },
  {
    path: "/nova-soutez",
    component: NewContestPanel,
    meta: {
      title: "Chytrá palice - Vytvoření soutěže",
      is_logged: true,
      is_admin: true,
    },
  },
  {
    path: "/souteze",
    component: ContestsPanel,
    meta: {
      title: "Chytrá palice - Přehled soutěží",
    },
  },
  {
    path: "/souteze/:id",
    component: ContestPanel,
    // Title is overwritten in component
    meta: {
      title: "Chytrá palice - Soutěž",
    },
  },
  {
    path: "*",
    component: NotFound,
    meta: {
      title: "Chytrá palice - 404",
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.is_logged)) {
    if (!store.getters.isLoggedIn) {
      next({
        path: "/",
        query: { err: "login" },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.is_admin)) {
    if (!store.getters.isAdmin) {
      next({
        path: "/",
        query: { err: "admin" },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
