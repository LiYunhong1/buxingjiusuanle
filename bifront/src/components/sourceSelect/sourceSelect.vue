<template>
  <div>
    <div class="input">
      <q-field
        filled
        v-model="source_name"
        label="基础数据源 *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || '不能为空']"
         @focus="showTree=true"
      >
        <span text-color="black">{{source_name}}</span>
        <q-menu>
          <q-tree v-if="showTree" :nodes="sourceTree" node-key="id" accordion ref="tree">
            <template v-slot:default-header="prop" v-slot:selected>
              <div class="row items-center"  @click="handleSelect(prop.node)">
                <div class="text-weight-bold">{{ prop.node.label }}</div>
              </div>
            </template>
          </q-tree>
        </q-menu>
      </q-field>
    </div>
    <q-table v-if="showTable" :data="tableData" :columns="tableColumns" style="height:300px;"></q-table>
  </div>
</template>

<script>
import { report } from "api/report.js";
import { source } from "api/source.js";
export default {
  name: "sourceSelect",
  props: {
    id: Number,
    name: String,
    showTable: Boolean,
    default: () => {}
  },
  data() {
    return {
        showTree:false,
      source_id: 0,
      source_name: "",
      tableData: [],
      colContent: {},
      sourceTree: [], // 数据源树
      treeData: [],
      tableColumns: []
    };
  },
  methods: {
    async handleSelect(target) {
      this.source_id = target.id;
      this.source_name = target.name;
      let res = await this.execTable();
      this.showTree=false;
      this.$emit("selected_source", {
        id: this.source_id,
        name: this.source_name,
        tableData: this.tableData,
        tableColumns: this.tableColumns
      });
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
    getSourceTree() {
      source.getByTree(0).then(res => (this.sourceTree = res.data.data));
    },
    getTree() {
      report.getByTree(2).then(res => (this.treeData = res.data.data));
    },
    getData() {
      this.execTable();
    }
  },
  mounted() {
    this.source_id = this.id;
    this.source_name = this.name;
    this.getTree();
    this.getSourceTree();
    if (this.showTable != true) {
      this.showTable = false;
    }
    if (this.id != 0) {
      this.getData();
    }
  }
};
</script>
