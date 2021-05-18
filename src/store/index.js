import Vue from "vue";
import Vuex from "vuex";
import api from "../api/index";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sideList: [],
    showContent: false,
    size: 5,
    goodsList: [],
    type: null,
    // 添加数量的集合
    counterMap: {},
  },
  mutations: {
    storageChange(state, { id, value }) {
      // 如果存在
      if (state.counterMap[id]) {
        // 当只有一个，还要减,就相当于删除
        if (
          (value === -1 && state.counterMap[id] === 1) ||
          value === -Infinity
        ) {
          Vue.delete(state.counterMap, id);
        } else {
          Vue.set(state.counterMap, id, state.counterMap[id] + value);
        }
      } else {
        Vue.set(state.counterMap, id, 1);
      }
      localStorage.setItem("goods", JSON.stringify(state.counterMap));
    },
    setCounterMap(state, map) {
      state.counterMap = map;
    },
    setSideList(state, list) {
      state.sideList = list;
    },
    setShowContent(state, bool) {
      state.showContent = bool;
    },
    setGoodsList(state, list) {
      state.goodsList = [...state.goodsList, ...list];
    },
    resetGoodsList(state) {
      state.goodsList = [];
    },
    setGoodsType(state, type) {
      state.type = type;
    },
  },
  actions: {
    async getSideList({ commit }, type) {
      commit("setShowContent", false);
      const value = await api.getSideList(type);
      commit("setSideList", value);
      commit("setShowContent", true);
    },
    async getGoodsList({ state, commit }, options) {
      const { page, sortType } = options;
      const type = options.type || state.type;
      commit("setGoodsType", type);
      const { list, total } = await api.getGoodsList(
        type,
        page,
        state.size,
        sortType
      );
      commit("setGoodsList", list);
      if (total > state.goodsList.length) {
        return true;
      }
      return false;
    },
  },
  modules: {},
});
