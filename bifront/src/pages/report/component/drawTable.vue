<template>
  <div style="min-width:700px;" class="q-pa-md">
    <div class="q-gutter-md">
      <q-table class="params" :data="params" :columns="paramsCol" row-key="name" hide-bottom hide-header title="查询参数" dense style="max-height:300px;">
        <template v-slot:body-cell-val="props">
          <q-td :props="props">
            {{ props.row.val }}
            <q-popup-edit v-model="props.row.val" persistent>
              <q-input
                v-if="props.row.type=='number'"
                type="number"
                v-model="props.row.val"
                dense
                autofocus
                filled
              />
              <q-input v-else-if="props.row.type=='datetime'" filled v-model="props.row.val">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date v-model="props.row.val" mask="YYYY-MM-DD HH:mm" />
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-time v-model="props.row.val" mask="YYYY-MM-DD HH:mm" format24h />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input v-else v-model="props.row.val" dense autofocus filled />
            </q-popup-edit>
          </q-td>
        </template>
      </q-table>
      <q-space />

    <template>
      <q-btn color="secondary" size="xs" icon="search" label="查询" @click="execData" />
      <q-btn color="positive" size="xs" icon="get_app" label="下载" @click="downloadExcel" />
    <multiple-table v-if="tableData.length>0" :data.sync="tableData" :columns.sync="colHeader">
    </multiple-table>
    </template>
    </div>
  </div>
</template>

<script>
import { source } from "api/source";
import { report } from "api/report";

 import fileDownload from 'js-file-download' // 文件下载

export default {
  name: "",
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tableData: [],
      columns: [],
      colHeader:[],
      params: [],
      paramsCol: [
        {
          name: "name",
          align: "center",
          label: "参数名",
          field: "name",
          sortable: true,
          style:'width:100px'
        },
        {
          name: "val",
          align: "center",
          label: "默认值",
          field: "val",
          sortable: true
        }
      ]
    };
  },
  methods: {
    getParams() {
      source.getSourceParamList(this.node.source_id).then(res => {
        this.params = res.data.data;
      });
    },
    execData() {
      report.reportExec(this.node.id, this.params).then(res => {
        if(this.node.report_type == 'excel'){
          if(res.data.data.length>0){
            let data =res.data.data
            this.colHeader = Object.keys(data[0]).map(o=>{
              return {
                label:o,
                field:o,
                sortable: false, name: o.field, align: "center" 
              }
            })
          }
        }else{
          let col = this.$lodash.cloneDeep(res.data.ext.config.columns || []);
        this.colHeader = col
        }
        this.tableData = res.data.data;
      });
    },
    downloadExcel() {
      report.downloadExcel(this.node.id, this.params).then(res=>{
          let disposition = res.headers['content-disposition']
          let name = disposition.split("filename*=utf-8''")[1]
          let filename = decodeURI(name)
          fileDownload(res.data, filename)

      })
    }
  },
  beforeMount() {
    this.getParams();
  }
};
</script>

<style lang="sass">
.params
  max-width: 600px
.params .q-table__title
  font-size: 14px

.params .q-table__top
  background: #e3e3e3
</style>