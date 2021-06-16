import axios from 'axios'
import VueCookies from 'vue-cookies'
export function request(config) {
  //实例化axios的对象
  const instance = axios.create({
    // baseURL: 'http://192.168.199.117:7010/front',
    baseURL: 'http://39.108.229.142/front',
    // baseURL: 'http://192.168.43.153:7010/front',
    timeout: 60000
  });
  //请求拦截器
  instance.interceptors.request.use(config => {

    let token = VueCookies.get('user_token');
    if (token) {
      config.headers['token'] = token;
    }
    if (config.params !== '') {
      for (let i in config.params) {
        config.url = config.url + '/' + config.params[i];
      }
    }
    // console.log(config)
    return config;
  })
  //响应拦截器
  instance.interceptors.response.use(res => {
    // console.log(res)
    
    return res.data;
  })
  //发送网络请求，将对象返回，并通过config参数初始化对象
  return instance(config);
}