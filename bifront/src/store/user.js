/*
 * @Author: your name
 * @Date: 2020-03-17 16:42:40
 * @LastEditTime: 2020-03-31 14:35:00
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \Bi_quasar\src\store\user.js
 */
import {LocalStorage} from 'quasar'
import {user} from 'api/model.js'
export default {
    namespaced: true,
    state: {
        token:LocalStorage.getItem('token'),
        userinfo:{},
        access:["base", "userlist","rolelist","data-source","report","excel","web","mobile","charts","datav","datavdesign"]
    },
    getters: {},
    mutations: {
        setUser(state,user){
            state.user = user
            state.access=user.roles[0].access.split(',')||[]
        },
        setToken(state,token){
            state.token=token
        }
    },
    actions: {
        getUser({state,commit}){
            return new Promise((resolve,reject)=>{
                user.getUserByToken(state.token).then(res=>{
                    console.log("登录")
                    commit('setUser',res.data.data)
                    resolve(res)
                }).catch(err=>reject(err))
            })
        },
        getToken({commit},token){
            commit('setToken',token)
        }
    },
}