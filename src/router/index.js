import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../views/Index.vue";
import DevPanel from "../views/DevPanel.vue";
import NewPost from "../views/NewPost.vue";

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
    path: "/dev",
    component: DevPanel,
  },
  {
    path: "novy-clanek",
    component: NewPost,
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
