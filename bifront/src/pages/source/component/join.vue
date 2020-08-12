<template>
    <div>
        <q-input
        filled
        :value="params.on?params.on.join(','):''"
        label="关联字段 *"
        @input="(v)=>$set(this.params,'on',v.split(','))"
        hint="请以‘ , ’作为分割符"
        class="tip"
      />
    </div>
</template>

<script>
    export default {
        name: '',
        props:['params'],
        data() {
            return {
                
            }
        }
    }
</script>

<style scoped>
    
</style>