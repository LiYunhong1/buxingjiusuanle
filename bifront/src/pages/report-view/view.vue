<template>
  <q-layout view="hHh lpR fFf" style="margin-left:10px;">
    <q-drawer show-if-above v-model="left" side="left" behavior="desktop" bordered>
      <!-- drawer content -->
      <div class="q-pa-md">
          <q-tree :nodes="treeData" :selected.sync="selected" label-key="title" node-key="id" accordion>
        <template v-slot:default-header="prop">
          <div class="row items-center" @click="handleOpen(prop)">
            <div>{{ prop.node.title }}</div>
          </div>
        </template>
      </q-tree>
      </div>
    </q-drawer>

    <q-page-container>
      <div>
          <draw-chart-preview v-if="loading&&type=='4'" :node="nodeItem" fullScreen></draw-chart-preview>
          <draw-table v-if="loading&&type!='4'" :node="nodeItem"></draw-table>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { report } from "api/report";
export default {
  props: ["type"],
  data() {
    return {
      left: true,
      treeData: [],
      selected:'',
      nodeItem: {},
      loading: false
    };
  },
  components: {
    DrawTable: () => import("../report/component/drawTable"),
    DrawChartPreview: () => import("../report/component/drawChartPreview")
  },
  methods: {
    handleOpen(row) {
      this.loading = false;
      this.nodeItem = row.node;
      setTimeout(() => {
        this.loading = true;
      }, 500);
    },
    getTree() {
      report.getByTree(this.type).then(res => (this.treeData = res.data.data));
    }
  },
  mounted() {
    this.getTree();
  }
};
</script>