import Http from '../util/http'

class Model extends Http{
    constructor(model){
        super(model)
    }
}

const datavtemplate = new Model('datav_template')
const chartconfig = new Model('chart_config')
export {
    datavtemplate,
    chartconfig,
}