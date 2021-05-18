<template>
  <div class="search-wrapper">
    <div class="search-head">
      <van-icon
        name="arrow-left"
        class="arr-left"
        @click="$router.push('home/classify')"
      />
      <van-search
        class="search-content"
        v-model="value"
        show-action
        :placeholder="place"
        @search="onSearch"
        @input="input"
        @focus="focus"
        autofocus
      >
        <template #action v-if="showList">
          <div @touchend="onSearch(value)">搜索</div>
        </template>
        <template #action v-else>
          <van-icon
            name="cart-o"
            id="shop-car"
            class="shop-car"
            :badge="badge"
            @click="$router.push('home/shopping')"
          />
        </template>
      </van-search>
    </div>

    <div class="like-search" v-if="likeList.length && showList">
      <van-list>
        <van-cell v-for="item in likeList" :key="item" @click="onSearch(item)">
          <template>
            <span class="custom-title" v-html="formatHTML(item)"></span>
          </template>
        </van-cell>
      </van-list>
    </div>

    <div class="goods-list" v-if="!showList">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有了"
        @load="onLoad"
        :immediate-check="false"
      >
        <goods-card
          v-for="item in goodsList"
          :key="item.id"
          v-bind="item"
          :num="counterMap[item.id]"
        ></goods-card>
      </van-list>
    </div>

    <!-- 历史记录 -->
    <div class="my-history" v-if="showList && likeList.length <= 0">
      <my-history :searchList="searchList" @search="onSearch"></my-history>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import goodsCard from "../components/GoodsCard.vue";
import myHistory from "../components/MyHistory.vue";
export default {
  data() {
    return {
      place: "酒",
      value: this.place,
      likeList: [],
      timer: null,
      loading: false,
      finished: false,
      page: 1,
      size: 5,
      goodsList: [],
      showList: true,
      total: 0,
      searchList: [], //历史记录
    };
  },
  components: {
    goodsCard,
    myHistory,
  },
  created() {
    this.searchList = JSON.parse(localStorage.getItem("searchList")) || [];
  },

  computed: {
    ...mapState({
      counterMap: (state) => state.counterMap,
    }),
    // 购物车总量
    badge() {
      const count = Object.values(this.counterMap).reduce(
        (prev, next) => prev + next,
        0
      );
      if (count > 99) {
        return "99+";
      }
      return count;
    },
  },
  methods: {
    async onLoad() {
      const value = await this.$api.search(this.value, this.page, this.size);
      this.goodsList = [...this.goodsList, ...value.list];
      this.total = value.total;
      this.loading = false;
      if (this.goodsList.length >= this.total) {
        this.finished = true;
      } else {
        this.page += 1;
      }
    },
    async onSearch(value) {
      if (value) {
        this.value = value;
      } else {
        this.value = this.place;
      }

      //   历史记录
      const result = this.searchList.find((item) => item.value === this.value);
      if (result) {
        result.time = new Date().getTime();
        this.searchList.sort((a, b) => b.time - a.time);
      } else {
        this.searchList.unshift({
          value: this.value,
          time: new Date().getTime(),
        });

        if (this.searchList.length >= 11) {
          this.searchList.pop();
        }
      }
      localStorage.setItem("searchList", JSON.stringify(this.searchList));

      this.likeList = [];
      this.goodsList = [];
      this.page = 1;
      this.finished = false;
      this.onLoad();
      this.showList = false;
    },
    async input() {
      // 写一个防抖函数,如果没有搜索内容，就让搜索列表为空
      if (this.value === "") {
        this.likeList = [];
        return;
      }
      //   如果正在获取数据,就清除定时器,
      //   在输入的时候不发送请求，在0.3s之后发送
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      } else {
        this.timer = setTimeout(async () => {
          const value = await this.$api.likeSearch(this.value);

          this.likeList = value.result;
          clearTimeout(this.timer);
          this.timer = null;
        }, 300);
      }
    },
    focus() {
      this.showList = true;
    },
    formatHTML(item) {
      const reg = new RegExp(this.value, "g");
      return item.replace(reg, this.value.fontcolor("red"));
    },
  },
};
</script>

<style lang="less" scoped>
.search-wrapper {
  width: 100%;
  height: 100vh;
  z-index: 10;
  background-color: #fff;
  .search-head {
    width: 345px;
    display: flex;
    align-items: center;
    .arr-left {
      font-size: 22px;
      margin-left: 10px;
    }
    .search-content {
      flex: 1;
    }
  }

  .like-search {
    padding: 0 20px;
  }
  .goods-list {
    position: relative;
    width: 345px;
    margin: 0 40px;
    z-index: 10;
    background: #fff;
  }
}
</style>
