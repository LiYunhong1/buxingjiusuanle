<template>
<div>
  <q-btn v-if="fullScreen" @click="toggle()" color="secondary" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'" class="btn-fullscreen" size="xs"></q-btn>
  <div class="chart" ref="chart"></div>
</div>
</template>

<script>
var posList = [
  "left",
  "right",
  "top",
  "bottom",
  "inside",
  "insideTop",
  "insideLeft",
  "insideRight",
  "insideBottom",
  "insideTopLeft",
  "insideTopRight",
  "insideBottomLeft",
  "insideBottomRight"
];

var configParameters = {
  rotate: {
    min: -90,
    max: 90
  },
  align: {
    options: {
      left: "left",
      center: "center",
      right: "right"
    }
  },
  verticalAlign: {
    options: {
      top: "top",
      middle: "middle",
      bottom: "bottom"
    }
  },
  position: {
    options: echarts.util.reduce(
      posList,
      function(map, pos) {
        map[pos] = pos;
        return map;
      },
      {}
    )
  },
  distance: {
    min: 0,
    max: 100
  }
};

var config = {
  rotate: 90,
  align: "left",
  verticalAlign: "middle",
  position: "insideBottom",
  distance: 15,
  onChange: function() {
    var labelOption = {
      normal: {
        rotate: config.rotate,
        align: config.align,
        verticalAlign: config.verticalAlign,
        position: config.position,
        distance: config.distance
      }
    };
  }
};

import echarts from "echarts";
require('echarts/theme/vintage')
require('echarts/theme/dark')
require('echarts/theme/dark-blue')
require('echarts/theme/shine')


export default {
  name: "",
  props: {
    chartOpt: {
      type: String,
      default: "bar"
    },
    legend: {
      type: Array,
      default: []
    },
    xAxis: {
      type: Array,
      default: []
    },
    series: {
      type: Array,
      default: []
    },
    theme:{
      type:String|Object,
      default:()=>''
    },
    fullScreen:{
      type: Boolean,
      default:false
    }
  },
  data() {
    return {
      chart: null,
      lastArea: 0,
      option: {
        color: ["#003366", "#006699", "#4cabce", "#e5323e"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          data: []
        },
        toolbox: {
          show: true,
          orient: "vertical",
          left: "right",
          top: "center",
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar", "tiled", "pie"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: "category",
            axisTick: { show: false },
            data: [],
            show: true
          }
        ],
        yAxis: [
          {
            type: "value",
            show: true
          }
        ],
        series: []
      },
      labelOption: {
        show: true,
        position: config.position,
        distance: config.distance,
        align: config.align,
        verticalAlign: config.verticalAlign,
        rotate: config.rotate,
        formatter: "{c}  {name|{a}}",
        fontSize: 12,
        rich: {
          name: {
            // textBorderColor: "#fff",
            color:'white'
          }
        }
      }
    };
  },
  watch: {
    chartOpt() {
      this.setData();
      this.chart.setOption(this.option);
    },
    legend() {
      this.option.legend.data = this.legend;
      this.setData()
      this.chart.setOption(this.option);
    },
    xAxis() {
      this.option.xAxis[0].data = this.xAxis;
      this.setData()
      this.chart.setOption(this.option);
    },
    series() {
      this.setData();
      this.chart.setOption(this.option);
    },
    theme(){
      this.chart.showLoading();
        this.chart.dispose();
        this.chart = echarts.init(this.$refs.chart, this.theme)
        this.setData()
        this.chart.setOption(this.option);
    }
  },
  methods: {
    init() {
      this.option.legend.data = this.legend;
      this.option.xAxis[0].data = this.xAxis;
      this.setData();
      // echarts.registerTheme('purple-passion', theme)
      this.chart = echarts.init(this.$refs.chart,this.theme);
      this.chart.setOption(this.option);
      let elementResizeDetectorMaker = require("element-resize-detector");
      //监听元素变化
      let erd = elementResizeDetectorMaker();
      let that = this;
      erd.listenTo(this.$refs.chart, function(element) {
        that.$nextTick(function() {
          //使echarts尺寸重置
          that.chart.resize();
        });
      });
      //监听元素变化
    },
    setOpt(bool) {
      this.option.toolbox.show = bool;
      this.option.xAxis[0].show = bool;
      this.option.yAxis[0].show = bool;
    },
    setData() {
      switch(this.chartOpt){
        case 'pie':
          this.setOpt(false);
        this.labelOption.show = true;
        break;
        case 'line':
          this.labelOption.show = false;
        this.setOpt(true);
        break;
        case 'gauge':
          this.labelOption.show = true;
        this.setOpt(false);
        break;
        default:
          this.setOpt(true);
        this.labelOption.show = true;
          break;
      }
      let seriesData = this.series.map(o => {
        return {
          type: this.chartOpt,
          barGap: 0,
          label: this.labelOption,
          ...o
        };
      });
      this.option.series = seriesData;
    },
    toggle(){
      this.$q.fullscreen.request(this.$refs.chart).then(res=>{
        this.chart.setOption(this.option);
      })
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style scoped>
.chart{
  width:100%;
  min-height:400px;
  clear: both;
}
.btn-fullscreen{
  float: right;
  right: 10px;
}
</style>