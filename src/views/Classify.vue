<template>
  <div class="classify-wrapper">
    <!-- 搜索 -->
    <router-link class="search-bth" tag="div" to="/search">
      <van-icon name="search" />
      <div>苹果9.9包邮</div>
    </router-link>

    <!-- 一级导航 -->
    <one-tab></one-tab>

    <!-- 二级导航 -->
    <template v-if="showContent">
      <side-bar></side-bar>
      <goods-list></goods-list>
    </template>
    <van-loading size="2rem" vertical v-else />
  </div>
</template>

<script>
import { mapState } from "vuex";
import oneTab from "../components/OneTab";
import sideBar from "../components/SideBar";
import goodsList from "../components/GoodsList.vue";
export default {
  computed: {
    ...mapState({
      showContent: (state) => state.showContent,
    }),
  },
  components: {
    oneTab,
    sideBar,
    goodsList,
  },
};
</script>

<style lang="less" scoped>
.classify-wrapper {
  width: 375px;
}
.search-bth {
  width: 355px;
  height: 33px;
  line-height: 33px;
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin: 10px auto;
  color: #a1a1a1;
}
</style>
