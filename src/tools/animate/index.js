import Vue from "vue";
import com from "./index.vue";

const Animate = Vue.extend(com);

export default function({ startX, startY, endX, endY, src, width, height }) {
  //  创建一个app实例，
  const app = new Animate({
    el: document.createElement("div"),
    data() {
      return {
        moveX: startX, //x轴的偏移量
        moveY: startY, //y轴的偏移量
        sx: 1, //x轴的缩放
        sy: 1, //y轴的缩放
        opacity: 1,
        exist: true,
        src,
        width,
        height,
      };
    },
  });
  // 创建一个app实例，并将这个实例挂在到body中
  document.body.appendChild(app.$el);
  setTimeout(() => {
    app.moveX = endX;
    app.moveY = endY;
    app.sx = 0.1;
    app.sy = 0.1;
    app.opacity = 0;
  }, 0);
  setTimeout(() => {
    app.exist = false;
  }, 1000);
}
