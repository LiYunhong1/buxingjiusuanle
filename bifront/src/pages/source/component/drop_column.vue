<template>
  <q-input
    filled
    :value="params.columns?params.columns.join(','):''"
    label="删除列 *"
    @input="(v)=>$set(this.params,'columns',v?v.split(','):undefined)"
    hint="请以‘ , ’作为分割符"
    class="tip"
  />
</template>

<script>
export default {
  name: "",
  props: ["params"],
  data() {
    return {};
  }
};
</script>

<style scoped>
</style>