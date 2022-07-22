import Vue from "vue";
import App from "./App";
import Request from "./utils/request";

const http = new Request();

uni.http = http;
Vue.prototype.http = http;

Vue.config.productionTip = false;

App.mpType = "app";

const app = new Vue({
  ...App,
});
app.$mount();
