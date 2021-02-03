import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../views/Index.vue";
import DevPanel from "../views/DevPanel.vue";
import NewPostPanel from "../views/NewPostPanel.vue";
import PostPanel from "../views/PostPanel.vue";
import EditPostPanel from "../views/EditPostPanel.vue";

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
    meta: {
      title: "Chytrá palice - Dev Dashboard",
    },
  },
  {
    path: "/clanek/:id",
    component: PostPanel,
  },
  {
    path: "/clanek/edit/:id",
    component: EditPostPanel,
  },
  {
    path: "/novy-clanek",
    component: NewPostPanel,
    meta: {
      title: "Chytrá palice - Nový článek",
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
