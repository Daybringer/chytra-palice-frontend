import Vue from "vue";
import VueRouter from "vue-router";

// Components
import Index from "../views/Index.vue";
import DevPanel from "../views/DevPanel.vue";
import NewPostPanel from "../views/NewPostPanel.vue";
import PostPanel from "../views/PostPanel.vue";
import EditPostPanel from "../views/EditPostPanel.vue";
import NotFound from "../views/NotFound.vue";

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
    // Title is overwritten with post name
    meta: {
      title: "Chytrá palice - Článek",
    },
  },
  {
    path: "/clanek/edit/:id",
    component: EditPostPanel,
    meta: {
      title: "Chytrá palice - Úprava článku",
    },
  },
  {
    path: "/novy-clanek",
    component: NewPostPanel,
    meta: {
      title: "Chytrá palice - Nový článek",
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

export default router;
