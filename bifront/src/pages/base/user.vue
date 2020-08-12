<template>
  <div class="q-pa-md">
    <q-table
      :data="data"
      :columns="columns"
      :filter="filter"
      :loading="loading"
      rows-per-page-label="每页"
      :pagination-label="(start,end,total)=>start+'-'+end+' '+total"
    >

      <template v-slot:top>
        <q-btn color="primary" :disable="loading" label="添加" @click="initAdd" />
        <q-space />
        <q-input borderless dense debounce="300" color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>


    <q-dialog v-model="isDialog" persistent>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">添加用户</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form
      @submit="onSubmit"
      @reset="onReset"
      style="width:400px"
      ref="myForm"
    >
      <q-input
      v-for="(item,i) in columns"
      :key="i"
        filled
        v-model="formObj[item.name]"
        :label="item.label + '*'"
        lazy-rules
        :rules="[ val => val && val.length > 0 || '不能为空']"
      />


      <div>
        <q-btn label="保存" size="small" type="submit" color="primary"/>
        <q-btn label="取消" size="small" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
    </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>
<script>
var i = 0;
export default {
  data () {
    return {
      isDialog:false,
      formObj:{},
      loading: false,
      filter: '',
      rowCount: 10,
      columns: [
        { name: 'account', align: 'center', label: '账号', field: 'account', sortable: true },
        { name: 'name', align: 'center', label: '姓名', field: 'name', sortable: true },
        { name: 'phone', label: '手机号码', field: 'phone', sortable: true },
        { name: 'region', label: '所属区域', field: 'region' },
        { name: 'depart', label: '所在部门', field: 'depart' },
        { name: 'stauts', label: '状态', field: 'stauts' },
      ],
      data: [
        {
          account:'test',
          name: '测试',
          phone: 12345678910,
          region: '云南省',
          depart: '公路科学技术研究院',
          stauts: '冻结',
        },
        {
          account:'test',
          name: '测试',
          phone: 12345678910,
          region: '云南省',
          depart: '公路科学技术研究院',
          stauts: '冻结',
        },
        {
          account:'test',
          name: '测试',
          phone: 12345678910,
          region: '云南省',
          depart: '公路科学技术研究院',
          stauts: '冻结',
        },
        {
          account:'test',
          name: '测试',
          phone: 12345678910,
          region: '云南省',
          depart: '公路科学技术研究院',
          stauts: '冻结',
        },
        {
          account:'test',
          name: '测试',
          phone: 12345678910,
          region: '云南省',
          depart: '公路科学技术研究院',
          stauts: '冻结',
        },
        {
          account:'test',
          name: '测试',
          phone: 12345678910,
          region: '云南省',
          depart: '公路科学技术研究院',
          stauts: '冻结',
        }
      ]
    }
  },

  methods: {
      initAdd(){
          this.isDialog = true
      },
      onSubmit(){
          this.$refs.myForm.validate().then(success => {
  if (success) {
    // 是的，模型是正确的
    this.data.unshift(this.formObj)
    this.isDialog = false
  }
  else {
    // 哦，不，用户至少
    // 填写了一个无效值
  }
})
      },
    onReset(){
        this.$refs.myForm.resetValidation()
        this.isDialog = false
    }
  }
}
</script>