# h5页面使用

## 使用yarn管理依赖包
```bash
yarn
```

### 启动命令
```bash
quasar dev
```


### 打包命令
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).


### 左部导航及其显示权限
需在leftRouter数组中设置，左部导航才能够显示，设置时请跟模板保持一直，避免出现错误或样式误差

### api使用方式
在models文件下创建目录
#### 增删查改及分页的使用
创建 model.js
```bash
import Http from '../util/http'
class Model extends Http{
    constructor(model){
        super(model)  // model为后台的model，使用下划线的驼峰写法
    }
}
const user = new Model('user') // 参数为后台的model，使用下划线的驼峰写法
export {
    user
}
```

使用
```bash
import {user} from 'api/model'


user.get().then(res=>{})
```
#### 其他扩展api
```bash
class Model extends Http{
    constructor(model){
        super(model) // model为后台的model，使用下划线的驼峰写法
    }
    // 登录
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

const user = new Model('user') // 参数为后台的model，使用下划线的驼峰写法
export {
    user
}
```
使用
```bash
import {user} from 'api/model'


user.getUserByToken().then(res=>{})
```

### post方式文件流下载
```
yarn add js-file-download

接口配置中添加 extend:{responseType: 'blob'}

import fileDownload from 'js-file-download'
import {model} from 'api/config'
model.download(config).then(res=>{
    let disposition = res.headers['content-disposition']
    let name = disposition.split("filename*=utf-8''")[1]
    let filename = decodeURI(name)
    fileDownload(res.data, filename)
})
```

### 文件路径简写
查看quasar.conf.js文件中的[extendWebpack]
