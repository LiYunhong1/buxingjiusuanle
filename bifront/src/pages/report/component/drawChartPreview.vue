<template>
  <div class="q-gutter-md">
    <div v-if="params.length>0">
      <q-table
        class="params"
        :data="params"
        :columns="paramsCol"
        row-key="name"
        hide-bottom
        hide-header
        title="查询参数"
        dense
        style="max-height:300px;"
      >
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

      <q-btn color="secondary" size="xs" icon="search" label="查询" @click="execData" />
    </div>

    <draw-chart
      v-if="loading"
      :theme.sync="nodeItem.theme"
      :chartOpt.sync="nodeItem.type"
      :xAxis.sync="nodeItem.xAxis"
      :legend.sync="nodeItem.legend"
      :series.sync="nodeItem.series"
      :fullScreen="fullScreen"
    ></draw-chart>
  </div>
</template>

<script>
import { source } from "api/source";
import { report } from "api/report";
export default {
  name: "",
  props: {
    node:{
      type:Object,
      default:()=>{}
    },
    fullScreen:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      tableData: [],
      nodeItem: {},
      params: [],
      paramsCol: [
        {
          name: "name",
          align: "center",
          label: "参数名",
          field: "name",
          sortable: true,
          style: "width:100px"
        },
        {
          name: "val",
          align: "center",
          label: "默认值",
          field: "val",
          sortable: true
        }
      ],
      loading: false
    };
  },
  components: {
    DrawChart: () => import("./drawChart")
  },
  methods: {
    getParams() {
      source.getSourceParamList(this.node.source_id).then(res => {
        this.params = res.data.data;
        if (this.params.length == 0) {
          this.execData();
        }
      });
    },
    execData() {
      report.reportExec(this.node.id, this.params).then(res => {
        let col = this.$lodash.cloneDeep(res.data.ext.config || {});
        this.nodeItem = col;
        this.tableData = res.data.data;
        this.setX(this.nodeItem.x);
        this.setY(this.nodeItem.legend);
        this.loading = true;
      });
    },
    // 设置x轴
    setX(value) {
      this.nodeItem.xAxis = this.tableData.map(o => o[value]);
    },
    // 设置显示内容
    setY(value) {
      this.nodeItem.series = value.map(o => {
        let item = this.tableData.map(k => k[o]);
        return {
          name: o,
          data: item
        };
      });
    }
  },
  mounted() {
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