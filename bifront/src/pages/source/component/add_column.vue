<template>
  <div>
    <q-table
      title="参数"
      :data="columns"
      :columns="add_col"
      no-data-label="无数据"
      hide-bottom
      bordered
      dense
      separator="cell"
      table-style="max-height: 150px;height:150px;"
      binary-state-sort
    >
      <template v-slot:top>
        <q-btn color="secondary" size="xs" label="添加列" @click="addColumn" />
        <q-space />
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
            {{ props.row.name }}
            <q-popup-edit v-model="props.row.name">
              <q-input v-model="props.row.name" dense autofocus counter filled />
            </q-popup-edit>
          </q-td>
          <q-td key="expression" :props="props">
            {{ props.row.expression }}
            <q-popup-edit v-model="props.row.expression">
              <q-input v-model="props.row.expression" dense autofocus counter filled />
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
export default {
  name: "",
  props: ["params"],
  data() {
    return {
      add_col: [
        { name: "name", field: "name", label: "名称" },
        { name: "expression", field: "expression", label: "表达式" }
      ],
      columns: this.params.columns || []
    };
  },
  watch: {
    columns() {
      this.params.columns = this.columns;
    }
  },
  methods: {
    addColumn() {
      this.columns = this.columns || [];
      this.columns.unshift({
        name: "",
        expression: ""
      });
      this.$forceUpdate();
    }
  }
};
</script>

<style scoped>
</style>