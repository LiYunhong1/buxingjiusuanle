<template>
  <div>
    <q-table
      title="结果展示"
      class="my-sticky-header-table"
      flat
      bordered
      dense
      :style="{height:height+'px'}"
      :data="result"
      :columns="columns"
      :no-data-label="nodata"
      :hide-bottom="result.length>0"
    />
  </div>
</template>

<script>
export default {
  name: "",
  props:{
      result:{
          type:Array,
          default:[]
      },
      nodata:{
          type:String,
          default:'还未执行操作'
      },
      height:{
          type:String|Number,
          default:300
      }
  },
  data() {
    return {};
  },
  computed: {
    columns() {
      let data = [];
      if (this.result.length > 0) {
        let obj = this.result[0];
        Object.keys(obj).forEach(o => {
          data.push({
            name: o,
            label: o,
            field: o
          });
        });
      }
      return data;
    }
  }
};
</script>

<style lang="sass">
.my-sticky-header-table
  /* max height is important */

  .q-table__middle
    thead tr th
      font-weight: bold

  .q-table__top
    /* bg color is important for th; just specify one */
    background-color: #c1f4cd

    .q-table__control
      .q-table__title
        font-size: 14px

  .q-table__bottom
    background-color: cyan

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 24px
</style>
