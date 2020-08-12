<template>
    <div>
        <q-input
        filled
        v-model="params.url"
        label="地址"
        type="url"
        lazy-rules
        :rules="[ val => val && val.length > 0 || '不能为空']"
      />
      <q-input
        filled
        v-model="params.user"
        label="用户名"
        lazy-rules
        :rules="[ val => val && val.length > 0 || '不能为空']"
      />
      <q-input
        filled
        v-model="params.password"
        label="密码"
        type="password"
        lazy-rules
      />
      <q-input
        filled
        v-model="params.description"
        label="说明"
      />
      <p style="height:10px"></p>
      <q-input
        filled
        v-model="params.sql"
        label="SQL"
        type="textarea"
        lazy-rules
        :rules="[ val => val && val.length > 0 || '不能为空']"
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