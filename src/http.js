import axios from 'axios';
import router from './router';
import {Message} from 'element-ui'

// axios 配置
axios.defaults.timeout = 30000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';

axios.defaults.transformRequest = [function (data) {
    let ret = ''
    for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    return ret
}]
// http request 拦截器
axios.interceptors.request.use(
    config => {
        if (localStorage.getItem('auth-token')) { //判断token是否存在

            config.headers.token = localStorage.getItem('auth-token');  //将token设置成请求头
            //设置全局token为请求参数
            if(config.method=='post'){
                config.data = {
                    token: localStorage.getItem('auth-token'),
                    ...config.data,
                }
            }else if(config.method=='get'){
                config.params = {
                    ...config.params,
                    token: localStorage.getItem('auth-token'),

                }
            }
        }




        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

// http response 拦截器
// TODO 处理token失效
axios.interceptors.response.use(
    response => {
        if (response.status === 200) {
            if (response.data.code == 0) {
                return response
            } else if (response.data.code === 419 || response.data.code === 403 || response.data.code === 5002 || response.data.code === 5001) {
                // token 过期处理
                Message.error({
                    message: '登录超时，请重新登录',
                    duration: 1500,
                    onClose () {
                        location.href = '/login'
                    }
                })
                localStorage.removeItem('auth-token')
                localStorage.removeItem('auth-user-info')
                localStorage.removeItem('auth-username')
                return Promise.reject(`Response code is : ${response.data.code}, message is : ${response.data.msg || response.data.message}`)
            } else {
                // console.log('234324',response);

                Message.error(response.data.msg || response.data.message)
                return Promise.reject(`Response code is : ${response.data.code}, message is : ${response.data.msg || response.data.message}`)
            }
        } else {
            Message.error(`请求失败，服务端状态码：${response.status}`)
            return Promise.reject(`Http response code is ${response.status}`)
        }
    },
    error => {
        Message.error(`服务端错误：${error}`)
        return Promise.reject(error);
    }
);
export default axios
