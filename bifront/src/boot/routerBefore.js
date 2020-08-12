import { LocalStorage } from 'quasar'
export default ({ router, store, Vue }) => {
  // router.beforeEach((to, from, next) => {
  //   //现在您需要在这里添加验证逻辑，比如调用一个API
  //   let token = store.state.user.token
  //   if (!token || token == null) {
  //     if (to.path == '/login') {
  //       next()
  //     } else {
  //       next({
  //         path: '/login'
  //       })
  //     }
  //   } else {
  //     store.dispatch('user/getUser').then(res => {
  //       if (res.data.code == 0) {
  //         if (to.path == '/') {
  //           next({
  //             path: '/home'
  //           })
  //         } else {
  //           next()
  //         }
  //       }
  //     }).catch(err=>{
  //       next({
  //         path:'/login'
  //       })
  //     })

  //   }
  // })
}