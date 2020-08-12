import Http from '../util/http'

class Model extends Http{
    constructor(model){
        super(model)
    }
    // 密码登录
    async login(data) {
        const req = {
            url: '/api/_login',
            method: 'post',
            data: data
        }
        let res = await this.request(req)
        return res
    }
    // 根据token获取用户信息
    async getUserByToken(token){
        const req = {
            url:'/api/token/'+token
        }
        let res = await this.request(req)
        return res
    }
}

const user = new Model('user')
const role = new Model('role')
export {
    user,
    role
}