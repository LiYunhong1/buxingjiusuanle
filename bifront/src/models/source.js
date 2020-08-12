/*
 * @Author: your name
 * @Date: 2020-03-19 09:47:29
 * @LastEditTime: 2020-03-30 09:54:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Bi_quasar\src\models\source.js
 */
import Http from '../util/http'

class Model extends Http{
    constructor(model){
        super(model)
    }
    // 获取树结构
    async getByTree(id){
        const req = {
            url: '/api/data_source_tree/'+id,
            method: 'get',
        }
        let res = await this.request(req)
        return res
    }
    // 测试
    async test(id,data={}){
        const req = {
            url: '/api/test_tool/'+id,
            method: 'post',
            data
        }
        let res = await this.request(req)
        return res
    }
    // 数据预览
    async previewTask(id){
        const req = {
            url: '/api/task_result/'+id,
            method: 'get'
        }
        let res = await this.request(req)
        return res
    }
    /**
     * @description: 获取数据源参数列表
     * @param {type} 
     * @return: 
     */
    async getSourceParamList(id){
        const req = {
            url: '/api/data_source_params/'+id,
            method: 'get'
        }
        let res = await this.request(req)
        return res
    }

    /**
     * @description: 行数据源获取数据
     * @param {id:数据源id} 
     * @return: 
     */
    async execSourceList(id,data){
        const req = {
            url: '/api/exec_data_source/'+id,
            method: 'post',
            data
        }
        let res = await this.request(req)
        return res
    }
}

const source = new Model('data_source')
export {
    source
}