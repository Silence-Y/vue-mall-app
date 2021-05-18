<template>
  <div class="history">
    <h4>历史记录：</h4>
    <div
      class="his-item"
      v-for="item in searchList"
      :key="item.time"
      @click="search(item.value)"
    >
      {{ item.value }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    searchList: {
      default() {
        return [];
      },
    },
  },
  methods: {
    search(value) {
      this.$emit("search", value);
    },
  },
};
</script>

<style lang="less" scoped>
.history {
  margin: 20px;
}
.his-item {
  display: inline-block;
  background: #eee;
  margin: 10px;
  padding: 5px 10px;
  border-radius: 5px;
}
</style>
