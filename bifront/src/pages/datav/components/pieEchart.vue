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
            <q-select v-model="config.x" :options="tableColumns" label="名称" filled />
             <q-select v-model="config.y" :options="tableColumns" label="图列" filled />
            <!-- <q-select v-model="config.x" :options="tableColumns" label="名称" filled />
            <q-select v-model="config.y" :options="tableColumns" label="图列" filled /> -->

            <!-- 新增刷新数据 -->
            <div class="row q-gutter-md">
              <q-checkbox v-model="if_interval" class="input col" label="是否间隔刷新" />
              <q-input
                v-if="if_interval"
                v-model.number="interval"
                type="number"
                label="刷新时间间隔（秒）"
                min="1"
                class="input col"
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
  name: "lineEchart",
  props: ["id", "div", "model"],
  data() {
    return {
      subtitle:'',
      if_interval: false,
      interval_job: null,
      interval: 30,
      source_id: 0,
      source_name: "",
      tableColumns: [],
      tableData: [],
      params: [],
      options: [],
      sourceTree: [], // 数据源树
      treeData: [],
      design: true,
      showDialog: false,
      config: {
        data: [],
        dataSource: {},
        backgroundColor: "rgba(0, 0, 0, 0.0)",
        title: {
          top: "20px",
          left: "20px",
          text: ""
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: []
        },
        tooltip: {},
        series: [
          {
            type: "pie",
            data: []
          }
        ]
      }
    };
  },
  components: { sourceSelect },
  watch: {
    source_id() {
      this.config.dataSource.id = this.source_id;
      this.config.dataSource.name = this.source_name;
    }
  },
  methods: {
    changeSource(event) {
      this.tableColumns = event.tableColumns;
      this.tableData = event.tableData;
      this.config.dataSource.id = event.id;
      this.config.dataSource.name = event.name;
    },

    // 设置x轴
    // setX(value) {
    //   this.config.series[0].data = this.tableData.map(row => {
    //         return {
    //           value: row[this.config.y.name],
    //           name: row[this.config.x.name]
    //         };
    //       });
    // },

    // 设置显示内容
    // setY(value) {
    //   this.config.legend.data = this.tableData.map(
    //         row => row[this.config.x.name]
    //       );
    // },
    async execTable() {
      let params = [];
      let res = await source.execSourceList(this.source_id, params);
      this.tableColumns = [];
      this.tableData = res.data.data;
      if (res.data.data.length > 0) {
        this.tableColumns = Object.keys(res.data.data[0]).map(i => {
          return {
            name: i,
            align: "center",
            label: i,
            field: i
          };
        });
      }
      this.config.series[0].data = this.tableData.map(row => {
        return {
          value: row[this.config.y.name],
          name: row[this.config.x.name]
        };
      });
    },
    onSubmit() {
      debugger
      this.$refs.Form.validate().then(success => {
        if (success) {
          this.setConfig();
          this.config.series[0].data = this.tableData.map(row => {
            return {
              value: row[this.config.y.name],
              name: row[this.config.x.name]
            };
          });

          this.config.legend.data = this.tableData.map(
            row => row[this.config.x.name]
          );
          let data = {
            config: {
              ...this.$lodash.cloneDeep(this.config),
              subtitle: this.subtitle,
            }
          }

          // data.config.xAxis.data = [];
        //  data.config.series[0].data = [];
          chartconfig.post(data).then(res => {
            this.$emit("chartConfigChanged", {
              div: this.div,
              id: res.data.data.id
            });
          });
          this.drawChart();
          this.showDialog = false;
        }
      });
    },
   //设置时间刷新后台数据
    setConfig() {
      debugger
      if (this.interval_job) clearInterval(this.interval_job);
      if (this.if_interval && this.interval>0) {
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
      let myChart = echarts.init(this.$refs.Echarts);
      // 调用setOption将config输入echarts，然后echarts渲染图表
      myChart.setOption(this.config);
      // -----------------------------------------------------------------
      // 响应式变化
      window.addEventListener("resize", () => myChart.resize(), false);
      //侧边栏变化
      if (sidebar) {
        myChartPieLeft.resize();
      }
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
        let a = await this.execTable();
        this.drawChart();
      }

      
    }
  },
  mounted() {
    this.getData();
  },
  destroyed() {
    window.onresize = null;
  }
};
</script>

<style scoped>
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