import Vue from "vue";
import VueRouter from "vue-router";

// Store
import store from "../store";

// Components
import Index from "../views/Index.vue";

import NewPostPanel from "../views/NewPostPanel.vue";
import PostPanel from "../views/PostPanel.vue";
import EditPostPanel from "../views/EditPostPanel.vue";
import NotFound from "../views/NotFound.vue";
import NewContestPanel from "../views/NewContestPanel.vue";
import AllContestsPanel from "../views/AllContestsPanel.vue";
import ContestPanel from "../views/ContestPanel.vue";
import NewWorkPanel from "../views/NewWorkPanel.vue";
import AllWorksPanel from "../views/AllWorksPanel.vue";
import WorkPanel from "../views/WorkPanel.vue";
import MyWorksPanel from "../views/MyWorksPanel.vue";
import ApproveWorksPanel from "../views/ApproveWorksPanel.vue";
import EditContestPanel from "../views/EditContestPanel.vue";
import AboutPalice from "../views/AboutPalice.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Index,
    meta: {
      title: "Chytrá palice - literární soutěž GJK",
    },
  },

  {
    path: "/o-palici",
    component: AboutPalice,
    meta: {
      title: "Chytrá palice - O Chytré palici",
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
    path: "/nova-prace/:contestID",
    component: NewWorkPanel,
    meta: {
      title: "Chytrá palice - Nahrání práce",
      is_logged: true,
    },
  },
  {
    path: "/schvaleni",
    component: ApproveWorksPanel,
    meta: {
      title: "Chytrá palice - Schválení prací",
      is_admin: true,
      is_logged: true,
    },
  },
  {
    path: "/prace",
    component: AllWorksPanel,
    meta: {
      title: "Chytrá palice - Přehled prací",
    },
  },
  {
    path: "/prace/:id",
    component: WorkPanel,
    meta: {
      title: "Chytrá palice - ",
    },
  },
  {
    path: "/moje-prace",
    component: MyWorksPanel,
    meta: {
      title: "Chytrá palice - Moje práce",
      is_logged: true,
      is_not_admin: true,
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
    component: AllContestsPanel,
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
    path: "/souteze/edit/:id",
    component: EditContestPanel,
    meta: {
      title: "Chytrá palice - Úprava soutěže",
      is_logged: true,
      is_admin: true,
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
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
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
    // FIXME hideous way to fix router async problems
    setTimeout(() => {
      if (!store.getters.isAdmin) {
        next({
          path: "/",
          query: { err: "admin" },
        });
      } else {
        next();
      }
    }, 100);
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.is_not_admin)) {
    if (store.getters.isAdmin) {
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
