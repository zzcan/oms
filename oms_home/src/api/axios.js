import axios from 'axios';
import message from 'antd/lib/message';


axios.defaults.baseURL = 'http://oms-deploy.yunmof.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;
// 添加请求拦截器
// axios.interceptors.request.use(config => {
//     // 在发送请求之前做些什么
//     return config;
// }, error => {
//     // 对请求错误做些什么
//     return Promise.reject(error);
// });

// 添加响应拦截器
axios.interceptors.response.use(response => {
    // 对响应数据做点什么
    return response;
}, error => {
    // 对响应错误做点什么
    if(error.response.status === 400) {
        message.error(error.response.data.Msg)
    }
    // 未登录
    if(error.response.status === 403) {
        // message.error(error.response.data.Msg);
        if(error.response.data.Code === 403001) {
            window.location.replace("#/login");
        }
    }
    return Promise.reject(error);
});

export default axios;