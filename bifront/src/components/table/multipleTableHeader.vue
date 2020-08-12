<template>
  <div>
    <q-table
    class="customHeader"
      :data="data"
      :columns="colBody"
      dense
      hide-bottom
      separator="cell"
      bordered
    >
      <template v-slot:header>
        <q-tr v-for="(col,index) in headers" :key="index">
          <q-th v-for="c in col" :key="c.label" :rowspan="c.rowSpan" :colspan="c.colSpan" :style="{width:col.width?col.width+'px !important':'auto',maxWidth:col.width?col.width+'px !important':'auto',fontWeight:'bold'}">{{c.label}}</q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="cell in colBody" :key="cell.label" :props="props">
            {{ props.row[cell.field] }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { convertToRows, getAllColumns } from "./customHeader";
export default {
  name: "",
  props: {
    data: Array,
    columns: Array
  },
  data() {
    return {
      colBody: []
    };
  },
  computed: {
    headers() {
      if (this.columns.length > 0) {
        return convertToRows(this.columns);
      } else {
        return [];
      }
    }
  },
  methods: {
    getHeader() {
      this.colBody = [];
      function setCol(res, data) {
        data.forEach(o => {
          if (o.children && o.children.length > 0) {
            setCol(res, o.children);
          } else {
            res.push({ ...o, sortable: false, name: o.field, align: "center" });
          }
        });
      }
      setCol(this.colBody, this.columns);
    }
  },
  mounted() {
    this.getHeader();
  }
};
</script>

<style lang="sass">
.customHeader
  tr:nth-of-type(n+2)
    th:first-child
      border-left: 1px solid rgba(0, 0, 0, 0.12)
      border-collapse: collapse
</style>