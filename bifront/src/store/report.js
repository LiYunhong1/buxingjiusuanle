export default {
    namespaced: true,
    state: {
        // 列数据类型
        column_type:[
            {label: '文本（字符）',value:'string'},{label: '数值',value:'number'},{label: '日期',value:'datetime'},
        ],
        // 统计方法
        data_type:[
            {label: '总数',value:'sum'},{label: '平均值',value:'mean'},{label: '计数',value: 'count'},{label: '最大值',value:'max'},{label: '最小值',value:'min'},{label:'方差',value:'var'},
            {label: '标准差',value: 'std'}
        ],
        base_column:[
            {label:'文本（字符）',value:'object'},{label:'整数',value:'int64'},{label:'小数（浮点数）',value:'float64'},{label:'日期',value:'datetime64[ns]'}
        ]
    },
    getters: {},
    mutations: {},
    actions: {},
}