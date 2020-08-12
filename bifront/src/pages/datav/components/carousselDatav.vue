<template>
  <div id="carousselDatav">
    <div class="bg-color-black" style="height:100%">
      <div class="d-flex pt-2 pl-2" style="height:24px">
        <div class="d-flex" style="height:24px">
          <span class="title">{{subtitle}}</span>
        </div>
      </div>
      <div class="d-flex jc-center body-box" style="height:100%">
        <dv-scroll-board :config="config" />
      </div>
      <q-btn
        v-if="model=='design'"
        @click="showSettingDialog()"
        color="purple"
        icon="edit_location"
      >图形设置</q-btn>
    
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
              @selected_source="changeSource"
            ></sourceSelect>
            <q-select
              v-model="config.header"
              :options="tableColumns"
              multiple
              label="所选列名"
              filled
            />
            <!-- <q-select v-model="config.y" :options="tableColumns" @input="setX" label="名称" filled /> -->
            <!-- <q-select v-model="config.y" :options="tableColumns" @input="setY" label="数据" filled /> -->

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
  </div>
</template>

<script>
import { report } from "api/report.js";
import { source } from "api/source.js";
import { chartconfig } from "api/datav.js";
import sourceSelect from "c/sourceSelect/sourceSelect.vue";
export default {
  name: "carousselDatav",
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
        header: [],
  data: [],
  index: true,
  columnWidth: [50],
  align: ['center']
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
      this.tableColumns = event.tableColumns.map(o=>o.name);
      this.tableData = event.tableData;
      this.config.dataSource={
        id:event.id,
        name:event.name
      }
      // this.setX(this.config.data);
      // this.setY(this.config.header);
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
    },


    onSubmit() {
      this.$refs.Form.validate().then(success => {
        if (success) {
          debugger
          this.setConfig();
          let dt=this.tableData.map(o=>{
        let row = []
        this.config.header.forEach(k=>{
          row.push(o[k])
        })
        return row
      })
      this.config= {
        ...this.config,
        data:dt
      }
          // let data = {
          //   subtitle: this.subtitle,
          //   config: this.$lodash.cloneDeep(this.config)
          // };

          let data = {
            config: {
              ...this.$lodash.cloneDeep(this.config),
              subtitle: this.subtitle,

            }
          }
          chartconfig.post(data).then(res => {
            console.log(res.data)
            this.$emit("chartConfigChanged", {
              div: this.div,
              id: res.data.data.id
            });
          });
          this.showDialog = false;
        }
      });
    },
   //设置时间刷新后台数据
    setConfig() {
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
        // this.setX(this.config.data);
        // this.setY(this.config.header);

      }

    }
  },
  mounted() {
    this.getData();
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
  left: 40px;
  top: 40px;
  z-index: 9999;
}
#carousselDatav {
  padding: 1rem;
  height: 410px;
  min-width: 300px;
  border-radius: 5px;
  }.bg-color-black {
    height: 385px;
    border-radius: 10px;
  }
  .text {
    color: #c3cbde;
  }
  .body-box {
    border-radius: 10px;
    overflow: hidden;
  }
</style>