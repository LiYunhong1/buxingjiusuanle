/*
 * @Author: your name
 * @Date: 2020-03-27 10:20:58
 * @LastEditTime: 2020-04-01 17:59:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Bi_quasar\src\models\report.js
 */
import Http from '../util/http'

class Model extends Http{
    constructor(model){
        super(model)
    }

    /**
     * @获取报表树: 
     * @param {type:1：excel,2:web,3:mobile} 
     * @return: 
     */
    async getByTree(type){
        const req = {
            url: '/api/report_tree/'+type,
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
    // 执行获取报表展示内容
    async reportExec(id,data={}){
        const req = {
            url: '/api/report_exec/'+id,
            method: 'post',
            data
        }
        let res = await this.request(req)
        return res
    }
    // excel下载
    async downloadExcel(id,data={}){
        const req = {
            url: '/api/report_exec_excel/'+id,
            method: 'post',
            extend:{responseType: 'blob'},
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              },
            data
        }
        let res = await this.request(req)
        return res
    }
}

const report = new Model('report')
export {
    report
}