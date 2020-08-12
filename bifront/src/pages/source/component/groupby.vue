<template>
  <div>
    <q-input
      filled
      :value="group?group.join(','):''"
      label="分组列 *"
      @input="(v)=>$set(this,'group',v?v.split(','):undefined)"
      hint="请以‘ , ’作为分割符"
      class="tip"
    />
    <q-space />
    <q-table
      title="参数"
      :data="columns"
      :columns="agg_col"
      no-data-label="无数据"
      hide-bottom
      bordered
      dense
      separator="cell"
      table-style="max-height: 150px;height:150px;"
      binary-state-sort
    >
      <template v-slot:top>
        <q-btn color="secondary" size="xs" label="添加统计列" @click="groupColumn" />
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
          <q-td key="type" :props="props">
            <div class="text-pre-wrap">{{ props.row.type | formatCountType}}</div>
            <q-popup-edit v-model="props.row.type">
              <q-select
                v-model="props.row.type"
                emit-value
                map-options
                :options="$store.state.report.data_type"
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
      agg_col: [
        { name: "name", field: "name", label: "名称" },
        { name: "type", field: "type", label: "类型" }
      ],
      columns: this.params.agg_column || [],
      group: this.params.group || []
    };
  },
  watch: {
    columns() {
      this.params.agg_column = this.columns;
    },
    group() {
      this.params.group = this.group;
    }
  },
  methods: {
    groupColumn() {
      this.columns = this.columns || [];
      this.columns.unshift({
        name: "",
        type: null
      });
      this.$forceUpdate();
    }
  }
};
</script>

<style scoped>
</style>