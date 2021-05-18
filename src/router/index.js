import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home";
import Classify from "../views/Classify.vue";
import Shopping from "../views/Shopping";
import Search from "../views/Search";

Vue.use(VueRouter);

const routes = [
  {
    path: "/home",
    component: Home,
    children: [
      {
        path: "classify",
        component: Classify,
      },
      {
        path: "shopping",
        component: Shopping,
      },
    ],
  },
  {
    path: "/search",
    component: Search,
  },
  {
    path: "*",
    redirect: "/home/classify",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
