**概念**
axios是一个基于promise的HTTP客户端，主要用于浏览器与nodejs环境

**解决的HTTP请求的痛点**
* Axios 提供了统一的 API，可以在**浏览器**和**Node.js**中使用相同的代码发送 HTTP 请求，避免了不同环境下 API 不一致的问题
* Axios 使用 Promise 处理异步请求，避免了传统回调地狱的问题，使代码更易读和维护
* Axios 支持拦截器，可以在请求发送前或响应返回后统一处理逻辑，例如添加认证头、日志记录、错误处理等
* Axios 支持取消请求，避免不必要的网络请求（例如组件卸载时取消未完成的请求）
* Axios 会自动将响应数据转换为 JSON 对象，无需手动解析

**axios二次封装**
- **统一配置**：设置基础 URL、超时时间等全局配置。
     1. 使用axios.create创建自定义实例
     2. 配置baseURL，timeout等
- **拦截器**：添加请求拦截器（如添加认证头）和响应拦截器（如错误处理）
     1. 配置interceptors.request / response
     2. 统一错误处理逻辑
- **简化 API**：提供简洁的请求方法（如 `get`, `post`）。
- **统一错误处理**：集中处理网络错误和业务错误。
- **取消请求**：支持请求取消功能。

```javascript

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 基础 API URL，从环境变量获取
  timeout: 10000, // 请求超时时间
  withCredentials: true, // 跨域请求时携带 cookie
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求前做些什么
    const token = localStorage.getItem('token');
    if (token) {
      // 为请求添加认证头
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 处理请求错误
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据做些什么
    const res = response.data;
    
    // 根据业务状态码处理响应
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败');
      
      // 特殊状态码处理（如未登录）
      if (res.code === 401) {
        // 跳转到登录页
        window.location.href = '/login';
      }
      
      return Promise.reject(new Error(res.message || '请求失败'));
    }
    
    return res.data; // 直接返回业务数据
  },
  (error) => {
    // 处理响应错误
    const { response } = error;
    
    if (response) {
      // 服务器返回错误状态码
      const errorMsg = `HTTP错误 ${response.status}: ${response.statusText}`;
      ElMessage.error(errorMsg);
      console.error(errorMsg, response.data);
    } else if (error.message.includes('timeout')) {
      // 请求超时
      ElMessage.error('请求超时，请稍后重试');
    } else if (error.message === 'Network Error') {
      // 网络错误
      ElMessage.error('网络连接失败，请检查网络');
    }
    
    return Promise.reject(error);
  }
);
```


