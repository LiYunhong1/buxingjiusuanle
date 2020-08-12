/*
 * @Author: your name
 * @Date: 2020-03-17 16:42:40
 * @LastEditTime: 2020-04-01 18:01:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Bi_quasar\src\util\http.js
 */
import axios from 'axios'
import {baseUrl} from 'cfg/system.js'

//http request 拦截器
axios.interceptors.request.use(
    config => {
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
  
  //响应拦截器即异常处理
  axios.interceptors.response.use(response => {
    return Promise.resolve(response)
  }, err => {
      return Promise.reject(err.response)
  })
  

class Http {
    constructor(model) {
        this.model = model
    }
    async request(config) {
        const req = {
            url: baseUrl + config.url,
            method: config.method || 'get',
            data: config.data || {},
            headers:config.headers||{},
            ...(config.extend||{})
        }
        return axios(req)
    }
    async get() {
        const req = {
            url: '/api/' + this.model,
            method: 'get'
        }
        let res = await this.request(req)
        return res
    }
    async post(data = {}) {
        const req = {
            url: '/api/' + this.model+'/',
            method: 'post',
            data: data
        }
        let res = await this.request(req)
        return res
    }
    async put(id,data = {}) {
        const req = {
            url: '/api/' + this.model+'/'+id,
            method: 'put',
            data: data
        }
        let res = await this.request(req)
        return res
    }
    async delete(id) {
        const req = {
            url: '/api/' + this.model + '/' + id,
            method: 'delete'
        }
        let res = await this.request(req)
        return res
    }
    async getById(id) {
        const req = {
            url: '/api/' + this.model+'/'+id,
            method: 'get'
        }
        let res = await this.request(req)
        return res
    }
    async getByPage(page,pageSize) {
        const req = {
            url: '/api/' + this.model+'/page/'+page+'/'+pageSize,
            method: 'get'
        }
        let res = await this.request(req)
        return res
    }
}
export default Http