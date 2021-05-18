import Axios from "axios";
import baseURL, { URLS } from "./URLS";

const appkey = "Silence_1613926006790";
// const appkey = "dd_1597654682810";
// 创建一个axios实例
const request = Axios.create({
  baseURL,
  params: {
    appkey,
  },
});
// 拦截器
request.interceptors.response.use((value) => value.data);

const getSideList = (type) => request.get(URLS.getSide, { params: { type } });

// 商品列表
const getGoodsList = (type, page, size, sort) =>
  request.get(URLS.getGoodsList, {
    params: {
      type,
      size,
      sort,
      page,
    },
  });

const likeSearch = (value) =>
  request.get(URLS.likeSearch, { params: { likeValue: value } });

const search = (type, page, size) =>
  request.get(URLS.search, { params: { type, page, size } });

const getGoodsByIds = (value) =>
  request.get(URLS.getGoodsByIds, { params: { value } });
export default {
  getSideList,
  getGoodsList,
  search,
  likeSearch,
  getGoodsByIds,
};
