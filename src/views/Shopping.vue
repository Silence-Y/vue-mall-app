<template>
  <div class="shopping">
    <div class="top-nav">
      <van-nav-bar title="购物车" right-text="删除" @click-right="del" />
    </div>

    <div class="card-list">
      <van-checkbox-group ref="checkboxGroup" v-model="shoppingList">
        <div class="card-box" v-for="item in list" :key="item.id">
          <van-checkbox class="check" :name="item.id"></van-checkbox>
          <goods-card
            v-bind="item"
            :num="counterMap[item.id]"
            :nofly="true"
          ></goods-card>
        </div>
      </van-checkbox-group>
    </div>
    <div class="card-none"></div>
    <van-submit-bar
      :price="allMoney"
      :button-text="`去结算(${totalNum})`"
      @submit="onSubmit"
    >
      <van-checkbox v-model="checked" @click="checkAll">全选</van-checkbox>
    </van-submit-bar>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { Dialog, Toast } from "vant";
import goodsCard from "../components/GoodsCard.vue";
export default {
  data() {
    return {
      shoppingList: [], //选中的值，
      list: [], //渲染的购物车列表
      checked: false,
    };
  },
  computed: {
    ...mapState({
      counterMap: (state) => state.counterMap,
    }),
    // 物品的总数
    totalNum() {
      const resArr = this.list.filter((item) =>
        this.shoppingList.includes(item.id)
      );
      const res = resArr.reduce(
        (prev, next) => prev + (this.counterMap[next.id] || 0),
        0
      );
      return res;
    },
    // 钱的数量
    allMoney() {
      // console.log(this.shoppingList);
      const resArr = this.list.filter((item) =>
        this.shoppingList.includes(item.id)
      );
      // console.log(resArr);
      return resArr.reduce((prev, next) => {
        const num = this.counterMap[next.id] || 0;
        return Math.round(num * next.price * 100) + prev;
      }, 0);
    },
  },
  components: {
    goodsCard,
  },
  watch: {
    shoppingList() {
      if (this.shoppingList.length === this.list.length) {
        this.checked = true;
      } else {
        this.checked = false;
      }
    },
  },
  created() {
    this.getAllData();
  },
  methods: {
    ...mapMutations(["storageChange"]),
    async getAllData() {
      const result = Object.keys(this.counterMap);
      // 是商品的id
      // console.log(result);
      const res = await this.$api.getGoodsByIds(result.join());
      this.list = res.list;
    },
    async del() {
      if (this.shoppingList.length === 0) {
        Toast("你没有选中商品");
      }
      try {
        await Dialog.confirm({ message: "您是否要删除已选中商品" });
        console.log(this.shoppingList);
        this.shoppingList.forEach((id) => {
          this.storageChange({ id, value: -Infinity });
          this.list = this.list.filter(
            (item) => !this.shoppingList.includes(item.id)
          );
        });
      } catch (error) {
        Toast("用户点击了取消");
      }
    },
    onSubmit() {},
    checkAll() {
      if (this.checked) {
        this.$refs.checkboxGroup.toggleAll(true);
      } else {
        this.$refs.checkboxGroup.toggleAll(false);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.top-nav {
  // position: sticky;
}
.card-box {
  display: flex;
  justify-content: center;
  .check {
    margin: 10px;
    flex-shrink: 0;
  }
}
.van-submit-bar {
  bottom: 50px;
}
</style>
