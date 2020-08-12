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
            <!-- 选择地图的name和value值 -->
            <q-select v-model="config.x" :options="tableColumns" label="选择地区" filled />
            <q-select v-model="config.y" :options="tableColumns" label="显示的值" filled />
            <div>
              <q-input type="file" @input="uploadFile" class="file">选择地图文件</q-input>
            </div>
            <div class="row q-gutter-md">
              <q-checkbox v-model="if_interval" label="是否间隔刷新" style="width: 200px;" />
              <q-input
                v-if="if_interval"
                v-model.number="interval"
                type="number"
                label="刷新时间间隔（秒）"
                outlined
                min="1"
                style="width: 200px;"
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
// 根据上传的json文件返回一个id然后将
// import { file } from "api/file";
// import YunNan from "./geojson/yunnan.json";
export default {
  name: "mapEchart",
  props: ["id", "div", "model"],
  data() {
    return {
      subtitle:'',
      map: [],
      if_interval: false,
      interval_job: {},
      myChart: {},
      interval: 30,
      source_id: 0,
      source_name: "",
      tableColumns: [],
      tableData: [],
      params: [],
      options: [],
      design: true,
      showDialog: false,
      geoJson:null,
      config: {
        dataSource: {},
        backgroundColor: "rgba(0, 0, 0, 0.0)",
        title: {
          top: "40px",
          left: "20px",
          text: ""
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}<br/>{c} (p / km2)"
        },
        visualMap: {
          min: 800,
          max: 50000,
          text: ["High", "Low"],
          realtime: false,
          calculable: true,
          inRange: {
            color: ["lightskyblue", "yellow", "orangered"]
          }
        },
        series: [
          {
            type: "map",
            mapType: "map", // 自定义扩展图表类型
            label: {
              show: true
            },
            data: []
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
    //调用地图
    uploadFile(val) {
      debugger
      let _this = this
      //前端js代码对上传的json文件内容进行处理
      var objFile = val;
      if (objFile.length != 0) {
        debugger
        var reader = new FileReader(); //新建一个FileReader
        reader.readAsText(objFile[0]); //读取文件
        reader.onload = function(evt) {
          debugger
          //读取完文件之后会回来这里
          var fileString = JSON.parse(evt.target.result) // 读取文件内容
          _this.geoJson = fileString;
          echarts.registerMap("map", fileString);
          _this.myChart.setOption(_this.config);
        };
      }
    },
    changeSource(event) {
      this.tableColumns = event.tableColumns;
      this.tableData = event.tableData;
      this.source_id = event.id;
      this.source_name = event.name;
    },
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
      this.$refs.Form.validate().then(success => {
        if (success) {
          debugger
          this.setConfigInterval()
          this.config.series[0].data = this.tableData.map(row => {
            console.log("mapEchart row", row)
            return {
              value: row[this.config.y.name],
              name: row[this.config.x.name]
            };
          });
          // this.config.geoJson = fileString;
          let data = {
            config: {
              ...this.$lodash.cloneDeep(this.config),
              geoJson:this.geoJson,
              subtitle: this.subtitle,

            }
          };
          // data.config.series.map(i => (i["data"] = []));
          data.config.series[0].data = [];
          chartconfig.post(data).then(res => {
            this.$emit("chartConfigChanged", {
              div: this.div,
              id: res.data.data.id
            });
          });
          this.myChart.setOption(this.config);
          this.showDialog = false;
        }
      });
    },
    //是否刷新后台数据
    setConfigInterval() {
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
    drawChart() {
      debugger
      // // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(this.$refs.Echarts);
    
        echarts.registerMap("map", this.geoJson);

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
        this.geoJson = res.data.data.config.geoJson;
        this.subtitle = res.data.data.config.subtitle;
        let a = await this.execTable();
        this.drawChart();
      }
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

/* 按钮的样式 */
.file {
  padding: 8px 10px;
  height: 20px;
  line-height: 20px;
  position: relative;
  cursor: pointer;
  border: 1px solid #1976d2;
  border-radius: 4px;
  overflow: hidden;
  display: inline-block;
  *display: inline;
  *zoom: 1;
  background-color: #1976d2;
  width: 106px;
  height: 40px;
  padding-left: 10px;
  margin-left: 20px;
  margin-top: 0px;
  top: 10px;
}

.file input {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
  filter: alpha(opacity=0);
  cursor: pointer;
}
.file:hover {
  background: #1e88f1;
  border-color: #ccc;
  text-decoration: none;
}
</style>