import Vue from "vue";
import App from "./App";
import request from "./utils/request";

// config 配置与luch-request配置一致，可以自定义
// const config = { baseURL: 'xxx.api.com'}
// const http = request(config);
const http = request();

uni.http = http;
Vue.prototype.http = http;

Vue.config.productionTip = false;

App.mpType = "app";

const app = new Vue({
  ...App,
});
app.$mount();
