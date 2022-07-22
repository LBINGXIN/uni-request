// lodash 合并函数，也可以自己实现
import merge from "lodash.merge";

// 默认配置
const DEFAULT_CONFIG = {
  baseUrl: "http://baidu.com/",
  data: {},
  header: {},
  method: "post",
  timeout: 150000,
  dataType: "json",
  responseType: "text",
  sslVerify: true,
  withCredentials: false,
  firstIpv4: false,
};
class Request {
  constructor(options = {}) {
    // 合并用户自定义配置
    this.config = merge({}, DEFAULT_CONFIG, options);
  }
  // 请求拦截 主要是合并url，合并接口特定配置，可以根据自己情况进行扩展
  requestInterceptor(url, data, config, method) {
    const { baseUrl } = this.config;
    // 拼接Url
    url = baseUrl + url;
    const configs = {
      ...this.config,
      url,
      data,
      ...config,
      method,
    };
    // 返回组装的配置
    return configs;
  }
  // 响应拦截，这里只是做了示例，可以根据自己情况进行扩展
  async responseInterceptor(res) {
    const { data: _data } = res;
    const { code, message, data } = _data;
    if (code !== "200") {
      this.handleError(message);
      return Promise.reject(message);
    }
    return data;
  }
  // 请求方法，做了Promise封装，返回Promise
  /**
   * @param {String} url 接口
   * @param {Object} data 参数
   * @param {Object} config 某个接口自定义配置
   * @param {String} method 请求方法，只实现post和get，这么做了原因是 只有这两个没有兼容问题
   * @returns
   */
  request(url, data, config, method) {
    // 显示loading
    uni.showLoading();
    // 请求拦截，返回处理过的结果配置
    const _config = this.requestInterceptor(url, data, config, method);
    // Promise 封装
    return new Promise((resolve, reject) => {
      uni.request({
        ..._config,
        success: (res) => {
          // 这种简写方式一时看不懂，可以替换为注释的写法
          this.responseInterceptor(res).then(resolve).catch(reject);
          // this.responseInterceptor(res).then(res => {
          //   resolve(res)
          // }).catch(err => {
          //   reject(err)
          // });
        },
        fail: (err) => {
          // 提示错误
          this.handleError(err.message);
          console.log("fail", err);
        },
        complete: () => {
          // 关闭Loading
          uni.hideLoading();
        },
      });
    });
  }
  // 只实现post和get，这么做了原因是 只有这两个没有兼容问题
  // 需要其他方式，可以以同样的方式自行扩展

  /**
   * get请求
   * @param {String} url 接口
   * @param {Object} data 请求参数 可选
   * @param {Object} config 接口自定义配置 可选
   * @returns
   */
  get(url, data = {}, config = {}) {
    return this.request(url, data, config, "GET");
  }
  /**
   * post请求
   * @param {String} url 接口
   * @param {Object} data 请求参数 可选
   * @param {Object} config 接口自定义配置 可选
   * @returns
   */
  post(url, data = {}, config = {}) {
    return this.request(url, data, config, "POST");
  }
  // 错误提示
  handleError(title) {
    uni.showToast({
      title,
      icon: "none",
    });
  }
}

export default Request;
