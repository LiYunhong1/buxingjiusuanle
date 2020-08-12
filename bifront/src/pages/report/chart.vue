<!--
 * @Author: your name
 * @Date: 2020-03-31 11:56:12
 * @LastEditTime: 2020-04-01 15:54:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Bi_quasar\src\pages\report\chart.vue
 -->
<template>
  <div class="q-pa-md">
    <q-btn color="primary" icon="check" label="添加根节点" @click="initRoot" />
    <q-tree
      ref="tree"
      :nodes="treeData"
      label-key="title"
      node-key="id"
      accordion
      :selected.sync="selected"
      :expanded.sync="expanded"
    >
      <template v-slot:default-header="prop">
        <div class="row items-center">
          <div>{{ prop.node.title }}</div>
          <q-icon name="edit" color="green" size="16px" class="q-mr-sm" style="margin-left:10px;">
            <q-menu auto-close>
              <q-list style="min-width: 100px" dense>
                <q-item clickable @click="handleEdit(prop)">
                  <q-item-section>编辑</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click="handleDel(prop)">
                  <q-item-section>删除</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click="initAdd(prop)">
                  <q-item-section>添加子节点</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-icon>
        </div>
      </template>
    </q-tree>

    <dialog-close v-model="show" :title="isEdit?'编辑':'保存'">
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        ref="form"
        style="width:700px;"
        class="q-pa-md q-gutter-md"
      >
        <q-input
          filled
          v-model="formObj.name"
          label="名称 *"
          lazy-rules
          :rules="[ val => val && val.length > 0 || '不能为空']"
        />

        <q-field
          filled
          v-model="formObj.source_name"
          label="基础数据源 *"
          lazy-rules
          :rules="[ val => val && val.length > 0 || '不能为空']"
        >
          <span text-color="black">{{formObj.source_name}}</span>
          <q-menu auto-close>
            <q-tree :nodes="sourceTree" node-key="id" accordion ref="tree">
              <template v-slot:default-header="prop" v-slot:selected>
                <div class="row items-center" v-close-popup @click="handleSelect(prop.node)">
                  <div class="text-weight-bold">{{ prop.node.label }}</div>
                </div>
              </template>
            </q-tree>
          </q-menu>
        </q-field>
        <q-input filled v-model="option.text" label="图标标题" />
        <q-select
          v-model="option.type"
          :options="chartCategory"
          emit-value
          map-options
          label="图形方式"
          filled
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
              <q-item-section avatar>
                <q-icon :name="scope.opt.icon" :color="scope.opt.color" />
              </q-item-section>
              <q-item-section>
                <q-item-label v-html="scope.opt.label" />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-select
          v-model="option.theme"
          :options="[{label:'暗黑色',value:'dark'},{label:'葡萄色',value:'vintage'}]"
          emit-value
          map-options
          label="主题"
          filled
          clearable
        ></q-select>
        <q-select v-model="option.x" :options="tableColumns" @input="setX" label="X轴" filled />
        <q-select
          v-model="option.legend"
          :options="tableColumns"
          @input="setY"
          multiple
          label="图列"
          filled
        />

        <charts
          v-if="option.x&&option.legend"
          :theme.sync="option.theme"
          :chartOpt.sync="option.type"
          :xAxis.sync="option.xAxis"
          :legend.sync="option.legend"
          :series.sync="option.series"
        ></charts>

        <div>
          <q-btn label="保存" type="submit" color="primary" />
          <q-btn label="取消" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </dialog-close>
  </div>
</template>
<script>
import { report } from "api/report.js";
import { source } from "api/source.js";

export default {
  data() {
    return {
      sourceTree: [], // 数据源树
      treeData: [],
      selected: "",
      ticked: [],
      expanded: [],
      show: false,
      isEdit: false,
      formObj: {},
      columns: [
        {
          name: "name",
          align: "center",
          label: "参数名",
          field: "name",
          sortable: true
        },
        {
          name: "var",
          align: "center",
          label: "变量",
          field: "var",
          sortable: true
        },
        {
          name: "val",
          align: "center",
          label: "默认值",
          field: "val",
          sortable: true
        }
      ],
      fileColRow: 1,
      option: {}, // 图表选项
      params: [],
      tableColumns: [],
      tableData: [],
      chartCategory: [
        {
          label: "折线",
          icon: "broken_image",
          color: "light-green",
          value: "line"
        },
        {
          label: "柱状",
          icon: "insert_chart",
          color: "blue",
          value: "bar"
        },
        {
          label: "饼图",
          icon: "fiber_manual_record",
          color: "cyan",
          value: "pie"
        },
        {
          label: "仪表",
          icon: "network_wifi",
          color: "purple",
          value: "gauge"
        }
      ]
    };
  },
  components: {
    charts: () => import("./component/drawChart")
  },
  computed: {
    uploadData() {
      return [
        {
          name: "header",
          value: this.fileColRow
        }
      ];
    }
  },
  methods: {
    getTree() {
      report.getByTree(4).then(res => (this.treeData = res.data.data));
    },
    getSourceTree() {
      source.getByTree(0).then(res => (this.sourceTree = res.data.data));
    },
    uploadFile(res) {
      console.log("完成", res);
    },
    uploadFail(info) {
      console.log("失败", info);
    },
    async handleSelect(target) {
      debugger
      this.$set(this.formObj, "source_id", target.id);
      this.$set(this.formObj, "source_name", target.name);
      source.getSourceParamList(this.formObj.source_id).then(res => {
        this.params = res.data.data;
        this.execTable();
      });
    },
    execTable() {
      source.execSourceList(this.formObj.source_id, this.params).then(res => {
        this.tableColumns = [];
        this.tableData = res.data.data;
        if (res.data.data.length > 0) {
          this.tableColumns = Object.keys(res.data.data[0]);
        }
      });
    },
    // 选择树节点
    updateSelect(node) {
      console.log("节点", node);
      this.colContent = node;
    },
    initRoot() {
      this.formObj = {
        pid: 4,
        report_type: "chart"
      };
      this.option = {};
      this.isEdit = false;
      this.show = true;
    },
    initAdd(row) {
      console.log("row", row);
      this.formObj = {
        pid: row.node.id,
        report_type: "chart"
      };
      this.option = {};
      this.isEdit = false;
      this.show = true;
    },
    async handleEdit(row) {
      this.formObj = {
        id: row.node.id,
        name: row.node.name,
        source_id: row.node.source_id,
        source_name: row.node.source_name
      };
      await this.execTable();
      this.option = row.node.config;
      this.isEdit = true;
      this.show = true;
    },
    handleDel(row) {
      this.$q
        .dialog({
          title: "提示",
          message: "你确定删除吗?",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          report.delete(row.node.id).then(res => {
            this.getTree();
          });
        })
        .onOk(() => {
          // console.log('>>>> second OK catcher')
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },
    handleOpen(prop) {
      let row = prop.node;
      let routeUrl = this.$router.resolve({
        path: "/work",
        query: { id: row.id }
      });
      window.open(routeUrl.href, "_blank");
    },
    onSubmit() {
      this.$refs.form.validate().then(async valid => {
        if (valid) {
          let data = {
            ...this.formObj,
            config: {
              ...this.option
            }
          };
          if (!this.isEdit) {
            await report.post(data);
          } else {
            await report.put(this.formObj.id, data);
          }
          this.getTree();
          this.show = false;
        }
      });
    },
    onReset() {
      this.show = false;
    },
    // 设置x轴
    setX(value) {
      this.option.xAxis = this.tableData.map(o => o[value]);
    },
    // 设置显示内容
    setY(value) {
      this.option.series = value.map(o => {
        let item = this.tableData.map(k => k[o]);
        return {
          name: o,
          data: item
        };
      });
    }
  },
  created() {
    this.getSourceTree();
  },
  mounted() {
    this.getTree();
  }
};
</script>

<style scoped>
</style>