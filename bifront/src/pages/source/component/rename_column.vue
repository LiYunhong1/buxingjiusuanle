<template>
  <div>
    <q-table
      title="参数"
      :data="columns"
      :columns="rename_col"
      no-data-label="无数据"
      hide-bottom
      bordered
      dense
      separator="cell"
      table-style="max-height: 150px;height:150px;"
      binary-state-sort
    >
      <template v-slot:top>
        <q-btn color="secondary" size="xs" label="添加重命名列" @click="renameColumn" />
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
          <q-td key="new_name" :props="props">
            {{ props.row.new_name }}
            <q-popup-edit v-model="props.row.new_name">
              <q-input v-model="props.row.new_name" dense autofocus counter filled />
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
      rename_col: [
        { name: "name", field: "name", label: "名称" },
        { name: "new_name", field: "new_name", label: "重命名" }
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
    renameColumn() {
      this.columns = this.columns || [];
      this.columns.unshift({
        name: "",
        new_name: ""
      });
      this.$forceUpdate();
    }
  }
};
</script>

<style scoped>
</style>