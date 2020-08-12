<template>
<div style="width:100%;height:100%;">
<div id='d9' style="width:100%;height:100%;">
    <!-- <q-btn v-if="setting" @click="show=!show" class="btn">配置</q-btn> -->
    <div class="d-flex">
          <span class="fs-xl text mx-2">{{subtitle.title}}</span>
          <dv-decoration-3 style="width:100px;height:20px; position:relative;top:-3px;" />
    </div>
    <div ref="tryEcharts" style="width:100%;height: 100%;"></div>
  </div>
</div>
  

</template>

<script>
const echarts = require("echarts");
export default {
  name: 'tryEcharts',
 props:{
    subtitle:{
      type:Object,
      default:()=>{}
    }
  },
  data() {
    return {
      show:false,
      iData: [{'城市':'昆明','人口':'800','气温':10,'PM':10},
              {'城市':'曲靖','人口':'500','气温':20,'PM':15},
              {'城市':'玉溪','人口':'400','气温':30,'PM':30},
              ],
      columns:[],
      config: {     
        backgroundColor: 'auto',
        title: {
          top: '20px',
          left: '20px',
          textStyle: {
            color: '#ffffff'
            },
        text: ''
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      boundaryGap: false,
      nameTextStyle: {
        color: '#ffffff'
      },
      data: [],
        // data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [{
        name: '销量',
        type: 'bar',
        color: '#d48265',
        data: [5, 20, 36, 10, 10, 20]
    }
    ]
     }
    };
  },
  mounted() {

    //从服务器获取数据
    //1.读取配置信息 
    //2.读取数据，this.iData = ... 
    //分析数据
    // console.log(this.iData[0],)
    // this.config.xAxis.data =Object.keys(this.iData[0])
    this.index();
    // for( var key in this.iData[0]){
    //   this.config.xAxis.data.push(key);
    // }
    this.drawPie();
  },
  methods: {
    index() {
      console.log("iData",this.iData)
       this.iData.forEach((value, index) =>{
        this.config.xAxis.data.push(value.城市)
      })
    },
    drawPie(sidebar) {
      // 基于准备好的dom，初始化echarts实例
      let myChartPieLeft = echarts.init(this.$refs.tryEcharts, 'dark');
      // 调用setOption将config输入echarts，然后echarts渲染图表
      myChartPieLeft.setOption(this.config);
      // -----------------------------------------------------------------
      // 响应式变化
      window.addEventListener("resize", () => myChartPieLeft.resize(), false);
      //侧边栏变化
      if (sidebar) {
        myChartPieLeft.resize();
      }
    }
  },
  destroyed() {
    window.onresize = null;
  }
};
</script>

<style>
.btn{
  position: absolute;
  right: 5px;
  top:10px;
  z-index: 9999;
}
</style>