<template>
    <div>
        <q-input
        filled
        v-model="params.index"
        label="基础表 *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || '不能为空']"
      />
      <q-input filled v-model="params.condition" label="查询条件 *" />
    </div>
</template>

<script>
    export default {
        name: '',
        props:['params'],
        data() {
            return {
                
            }
        },
        mounted(){
            this.params.url='__es_url__'
            this.params.var_dict='__locals__'
        }
    }
</script>

<style scoped>
    
</style>