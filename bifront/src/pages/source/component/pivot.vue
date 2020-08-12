<template>
  <div>
    <q-input
      filled
      :value="params.index?params.index.join(','):''"
      label="透视列 *"
      @input="(v)=>$set(this.params,'index',v?v.split(','):undefined)"
      hint="请以‘ , ’作为分割符"
      class="tip"
    />
    <q-space />
    <q-input
      filled
      :value="params.values"
      label="值列 *"
      @input="(v)=>$set(this.params,'values',v?v:undefined)"
      hint="请以‘ , ’作为分割符"
      class="tip"
    />
    <q-space />
    <q-input
      filled
      :value="params.columns?params.columns.join(','):''"
      label="转行列 *"
      @input="(v)=>$set(this.params,'columns',v?v.split(','):undefined)"
      hint="请以‘ , ’作为分割符"
      class="tip"
    />
    <q-space />
    <q-select
      v-model="params.aggfunc"
      :options="$store.state.report.data_type"
      @input="(v)=>$set(this.params,'aggfunc',v?v:undefined)"
      emit-value
      map-options
      clearable
      label="统计方法"
      filled
    />
  </div>
</template>

<script>
export default {
  name: "",
  props: ['params'],
  data() {
    return {
    };
  }
};
</script>

<style  scoped>
</style>