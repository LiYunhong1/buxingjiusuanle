<!--
 * @Author: your name
 * @Date: 2020-03-31 17:07:44
 * @LastEditTime: 2020-04-01 14:57:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Bi_quasar\src\pages\report-view\excel.vue
 -->
<template>
    <q-page class="report-view">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="left"
          narrow-indicator
        >
          <q-tab name="1" label="Excel" />
          <q-tab name="2" label="网络报表" />
          <q-tab name="3" label="移动端报表" />
          <q-tab name="4" label="图表" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="1">
            <ViewPage type="1" />
          </q-tab-panel>

          <q-tab-panel name="2">
            <ViewPage type="2" />
          </q-tab-panel>

          <q-tab-panel name="3">
            <ViewPage type="3" />
          </q-tab-panel>

          <q-tab-panel name="4">
            <ViewPage type="4" />
          </q-tab-panel>
        </q-tab-panels>
    </q-page>
</template>

<script>
    export default {
        name: '',
        data() {
            return {
                tab:'1'
            }
        },
        components: {
          ViewPage:()=>import('./view'),
        },
    }
</script>

<style scoped>
    .report-view .q-tab-panel{
      padding: 0;
    }
</style>