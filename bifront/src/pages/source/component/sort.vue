<template>
  <div>
    <q-table
      title="参数"
      :data="columns"
      :columns="sort_col"
      no-data-label="无数据"
      hide-bottom
      bordered
      dense
      separator="cell"
      table-style="max-height: 150px;height:150px;"
      binary-state-sort
    >
      <template v-slot:top>
        <q-btn color="secondary" size="xs" label="添加排序列" @click="sortColumn" />
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
          <q-td key="ascending" :props="props">
            <div class="text-pre-wrap">{{ props.row.ascending | formatOrder}}</div>
            <q-popup-edit v-model="props.row.ascending">
              <q-select
                v-model="props.row.ascending"
                emit-value
                map-options
                :options="[{label:'正序',value:true},{label:'反序',value:false}]"
                filled
              />
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
      sort_col: [
        { name: "name", field: "name", label: "名称" },
        { name: "ascending", field: "ascending", label: "排序方式" }
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
    sortColumn() {
      this.columns = this.columns || [];
      this.columns.unshift({
        name: "",
        ascending: null
      });
      this.$forceUpdate();
    }
  }
};
</script>

<style scoped>
</style>