<template>
  <div class="q-ma-sm" style="width:100%;height:100%;">
    <div style="width:100%;height:90%;">
      <span class="title">{{subtitle}}</span>
      <div ref="Echarts" style="width:100%;height:100%;"></div>
      <q-btn
        v-if="model=='design'"
        @click="showSettingDialog()"
        color="purple"
        icon="edit_location"
      >图形设置</q-btn>
    </div>
    <q-dialog v-model="showDialog" full-height persistent>
      <q-card class="column full-height" style="width:1200px">
        <q-card-section class="row items-center q-pa-xl">
          <div class="text-h6">配置</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="col q-pt-none">
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md" ref="Form">
            <q-input
              outlined
              v-model="subtitle"
              label="主标题"
            />
            <sourceSelect
              :id="source_id"
              :name="source_name"
              :showTable="true"
              @selected_source="changeSource($event)"
            ></sourceSelect>
            <div class="row q-gutter-md">
              <q-input
                v-model="size"
                type="number"
                label="仪表盘大小（1-10）"
                min="1"
                max="10"
                class="input col"
              />
              <q-input v-model.number="min" type="number" label="最小值" class="input col" />
              <q-input v-model.number="max" type="number" label="最大值" class="input col" />
            </div>
            <div class="row q-gutter-md">
              <q-input
                v-model.number="greenSize"
                type="number"
                label="绿色区域（1-100）"
                min="1"
                max="100"
                class="input col"
              />
              <q-input
                v-model.number="blueSize"
                type="number"
                label="蓝色区域（1-100）"
                min="1"
                max="100"
                class="input col"
              />
              <q-input
                v-model.number="redSize"
                type="number"
                label="红色区域（1-100）"
                min="1"
                max="100"
                class="input col"
              />
            </div>
            <div class="row q-gutter-md">
              <q-input v-model.number="splitNumber" type="number" label="数值间隔" class="input col" />
              <q-checkbox v-model="if_interval" class="input col" label="是否间隔刷新" />
              <q-input
                v-if="if_interval"
                v-model.number="interval"
                type="number"
                label="刷新时间间隔（秒）"
                class="input col"
                min="1"
              />
            </div>
            <div align="left">
              <q-btn label="确定" type="submit" color="primary" />
              <q-btn label="取消" type="reset" color="primary" flat class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
        <q-card-actions align="right"></q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
const echarts = require("echarts");
import { report } from "api/report.js";
import { source } from "api/source.js";
import { chartconfig } from "api/datav.js";
import sourceSelect from "c/sourceSelect/sourceSelect.vue";
export default {
  name: "gaugeEchart",
  props: ["id", "div", "model"],
  data() {
    return {
      subtitle:'',
      if_interval: false,
      interval_job: {},
      myChart: {},
      size: 8,
      min: 0,
      max: 200,
      greenSize: 10,
      blueSize: 80,
      redSize: 100,
      splitNumber: 10,
      interval: 30,
      source_id: 0,
      source_name: "",
      tableColumns: [],
      tableData: [],
      params: [],
      options: [],
      design: true,
      showDialog: false,
      config: {
        dataSource: {},
        backgroundColor: "rgba(0, 0, 0, 0.0)",
        tooltip: {
          formatter: "{a} <br/>{c} {b}"
        },
        series: [
          {
            name: "速度",
            type: "gauge",
            min: 0,
            max: 100,
            splitNumber: 10,
            radius: "90%",
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [
                  [0.09, "lime"],
                  [0.82, "#1e90ff"],
                  [1, "#ff4500"]
                ],
                width: 3,
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            axisLabel: {
              // 坐标轴小标记
              fontWeight: "bolder",
              color: "#fff",
              shadowColor: "#fff", //默认透明
              shadowBlur: 10
            },
            axisTick: {
              // 坐标轴小标记
              length: 15, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: "auto",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            splitLine: {
              // 分隔线
              length: 25, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                width: 3,
                color: "#fff",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            pointer: {
              // 分隔线
              shadowColor: "#fff", //默认透明
              shadowBlur: 5
            },
            title: {
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: "bolder",
                fontSize: 20,
                // fontStyle: "italic",
                color: "#fff",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              }
            },
            // detail: {
            //   backgroundColor: "rgba(30,144,255,0.8)",
            //   borderWidth: 1,
            //   borderColor: "#fff",
            //   shadowColor: "#fff", //默认透明
            //   shadowBlur: 5,
            //   offsetCenter: [0, "50%"], // x, y，单位px
            //   textStyle: {
            //     // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            //     fontWeight: "bolder",
            //     color: "#fff"
            //   }
            // },
            data: [{ value: 40, name: "km/h" }]
          }
        ]
      }
    };
  },
  watch: {
    source_id() {
      this.config.dataSource.id = this.source_id;
      this.config.dataSource.name = this.source_name;
    }
  },
  components: { sourceSelect },
  methods: {
    changeSource(event) {
      // console.log("this.tableColumns")
      this.tableColumns = event.tableColumns;
      this.tableData = event.tableData;
      this.source_id = event.id;
      this.source_name = event.name;
    },
    execTable() {
      let params = [];
      source.execSourceList(this.source_id, params).then(res => {
        this.tableData = res.data.data;
        let sd = {
          value: this.tableData[0][Object.keys(this.tableData[0])[0]],
          name: this.subtitle
        };
        this.config.series[0].data = [];
        this.config.series[0].data.push(sd);
        this.myChart.setOption(this.config, true);
      });
    },
    onSubmit() {
      this.$refs.Form.validate().then(success => {
        if (success) {
          this.setConfig();
          let data = {
            config: {
              ...this.$lodash.cloneDeep(this.config),
              subtitle: this.subtitle,

            }
          }
          data.config.series[0].data = [];
          chartconfig.post(data).then(res => {
            this.$emit("chartConfigChanged", {
              div: this.div,
              id: res.data.data.id
            });
          });
          this.showDialog = false;
        }
      });
    },
    setConfig() {
      this.config.if_interval = this.if_interval;
      this.config.interval = this.interval;
      this.config.series[0].min = this.min;
      this.config.series[0].max = this.max;
      this.config.series[0].radius = (this.size * 10).toString() + "%";
      this.config.series[0].splitNumber = this.splitNumber;
      this.config.series[0].axisLine.lineStyle.color = [];
      let c1 = [this.greenSize / 100, "lime"];
      this.config.series[0].axisLine.lineStyle.color.push(c1);
      let c2 = [this.blueSize / 100, "#1e90ff"];
      this.config.series[0].axisLine.lineStyle.color.push(c2);
      let c3 = [this.redSize / 100, "#ff4500"];
      this.config.series[0].axisLine.lineStyle.color.push(c3);
      this.myChart.setOption(this.config, true);
      if (this.interval_job) clearInterval(this.interval_job);
      if (this.if_interval && this.interval > 0) {
        this.interval_job = setInterval(() => {
          this.execTable();
        }, this.interval * 1000);
      }
    },
    onReset() {
      this.showDialog = false;
    },
    showSettingDialog() {
      this.showDialog = true;
    },
    drawChart(sidebar) {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(this.$refs.Echarts);
      // 调用setOption将config输入echarts，然后echarts渲染图表
      this.myChart.setOption(this.config);
      // -----------------------------------------------------------------
      // 响应式变化
      window.addEventListener("resize", () => this.myChart.resize(), false);
    },
    async getData() {
      //从服务器获取数据
      //1.读取配置信息
      //2.读取数据，this.iData = ...
      //分析数据
      // console.log(this.iData[0],)
      // this.config.xAxis.data =Object.keys(this.iData[0])
      if (this.id != 0) {
        let res = await chartconfig.getById(this.id);
        this.config = res.data.data.config;
        this.source_id = this.config.dataSource.id;
        this.source_name = this.config.dataSource.name;
        this.subtitle = res.data.data.config.subtitle;
        this.interval = this.config.interval;
        let a = await this.execTable();
      }
      this.drawChart();
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style scoped>
.input {
  width: 100px;
}
.btn {
  position: absolute;
  left: 5px;
  bottom: 10px;
  z-index: 9999;
}
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 9999;
}
</style>
