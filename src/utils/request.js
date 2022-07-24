// 引入 luch-request 插件
import luchRequest from "./luch-request/index";

// 默认配置，和luch-request基本一致
const defeaultConfig = {
  baseURL: "",
  header: {},
  method: "POST",
  dataType: "json",
  // #ifndef MP-ALIPAY
  responseType: "text",
  // #endif
  // 注：如果局部custom与全局custom有同名属性，则后面的属性会覆盖前面的属性，相当于Object.assign(全局，局部)
  custom: {}, // 全局自定义参数默认值
  // #ifdef H5 || APP-PLUS || MP-ALIPAY || MP-WEIXIN
  timeout: 60000,
  // #endif
  // #ifdef APP-PLUS
  sslVerify: true,
  // #endif
  // #ifdef H5
  // 跨域请求时是否携带凭证（cookies）仅H5支持（HBuilderX 2.6.15+）
  withCredentials: false,
  // #endif
  // #ifdef APP-PLUS
  firstIpv4: false, // DNS解析时优先使用ipv4 仅 App-Android 支持 (HBuilderX 2.8.0+)
  // #endif
  // 局部优先级高于全局，返回当前请求的task,options。请勿在此处修改options。非必填
  // getTask: (task, options) => {
  // 相当于设置了请求超时时间500ms
  //   setTimeout(() => {
  //     task.abort()
  //   }, 500)
  // },
  // 全局自定义验证器。参数为statusCode 且必存在，不用判断空情况。
  validateStatus: (statusCode) => {
    // statusCode 必存在。此处示例为全局默认配置
    return statusCode >= 200 && statusCode < 300;
  },
};

// 错误提示
const handleError = (title) => {
  uni.showToast({
    title,
    icon: "none",
  });
};

/**
 * 创建http实例
 * @param {Object} config 用户自定义配置
 */
function request(config) {
  // 对luch-request 实例化，并且合并用户配置和默认配置
  const request = new luchRequest({
    ...defeaultConfig,
    ...config,
  });
  // 请求拦截，可以根据需求自定义配置
  request.interceptors.request.use(
    (config) => {
      uni.showLoading();
      return config;
    },
    (err) => {
      handleError(err.message);
      return Promise.reject(err);
    }
  );
  // 响应拦截，可以根据需求自定义配置
  request.interceptors.response.use(
    async (response) => {
      try {
        uni.hideLoading();
        return await intercept(response);
      } catch (err) {
        handleError(err.message);
        return Promise.reject(err);
      }
    },
    (err) => {
      handleError(err.message);
      return Promise.reject(err);
    }
  );
  return request;
}

/**
 * 响应拦截器，抽成一个方法，比较灵活
 * @param {*} promise
 */
async function intercept(response) {
  const { data } = response || {};
  if (data?.code !== 200) throw new Error(data.message);
  return data?.data;
}

export default request;
