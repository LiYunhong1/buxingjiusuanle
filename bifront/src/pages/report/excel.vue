<template>
  <div class="q-pa-md">
    <q-btn color="primary" icon="check" label="添加根节点" @click="initRoot" />
    <q-tree
      ref="tree"
      :nodes="treeData"
      label-key="title"
      node-key="id"
      accordion
      :selected.sync="selected"
      :expanded.sync="expanded"
    >
      <template v-slot:default-header="prop">
        <div class="row items-center">
          <div>{{ prop.node.title }}</div>
          <q-icon name="edit" color="green" size="16px" class="q-mr-sm" style="margin-left:10px;" >
            <q-menu auto-close>
              <q-list style="min-width: 100px" dense>
            <q-item clickable @click="handleEdit(prop)">
              <q-item-section>编辑</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable @click="handleDel(prop)">
              <q-item-section>删除</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable @click="initAdd(prop)">
              <q-item-section>添加子节点</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable @click="handleResult(prop)">
              <q-item-section>结果（预览）</q-item-section>
            </q-item>
          </q-list>
            </q-menu>
          </q-icon>
        </div>
      </template>
    </q-tree>

    <dialog-close v-model="show" :title="isEdit?'编辑':'保存'">
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        ref="form"
        style="width:500px;"
        class="q-pa-md q-gutter-md"
      >
        <q-input
        filled
        v-model="formObj.name"
        label="名称 *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || '不能为空']"
      />

        <q-field
        filled
        v-model="formObj.source_name"
        label="基础数据源 *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || '不能为空']"
      >
      <span text-color="black">{{formObj.source_name}}</span>
         <q-menu>
          <q-tree
      :nodes="sourceTree"
      node-key="id"
      accordion
      ref="tree"
    >
    <template v-slot:default-header="prop" v-slot:selected>
        <div class="row items-center" @click="handleSelect(prop.node)">
          <div class="text-weight-bold">{{ prop.node.label }}</div>
        </div>
      </template>
    </q-tree>
      </q-menu>
      </q-field>
    <q-uploader
      label="excel文件上传"
      style="width:96%;"
      auto-upload
      accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      url="/api/report_upload"
      @uploaded="uploadFile"
      @failed="uploadFail"
    >
    </q-uploader>
    
        <div>
          <q-btn label="保存" type="submit" color="primary"/>
          <q-btn label="取消" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </dialog-close>
    <dialog-close title="结果" v-model="resultDialog">
      <draw-table :node="resultNode"></draw-table>
    </dialog-close>
  </div>
</template>
<script>
import {report} from 'api/report.js'
import {source} from 'api/source.js'
export default {
  data () {
    return {
      sourceTree:[], // 数据源树
      treeData:[],
      selected: '',
      ticked: [],
      expanded: [],
      show:false,
      isEdit:false,
      formObj:{
        params:[]
      },
      columns:[
        { name: 'name', align: 'center', label: '参数名', field: 'name', sortable: true },
        { name: 'var', align: 'center', label: '变量', field: 'var', sortable: true },
        { name: 'val', align: 'center', label: '默认值', field: 'val', sortable: true },
      ],
      tableColumns:[],
      resultDialog:false,
      resultNode:{}
    }
  },
  components: {
    DrawTable:()=>import('./component/drawTable'),
  },
  methods: {
    getTree() {
      report.getByTree(1).then(res=>this.treeData=res.data.data)
    },
    getSourceTree(){
        source.getByTree(0).then(res=>this.sourceTree=res.data.data)
    },
    uploadFile(res){
      let data = JSON.parse(res.xhr.response)
      this.formObj.excel = data.ext
    },
    uploadFail(info){
        this.$q.notify({
          message:'上传失败'
        })
    },
    handleSelect(target){
      this.$set(this.formObj,'source_id',target.id)
      this.$set(this.formObj,'source_name',target.name)
      source.getSourceParamList(this.formObj.source_id).then(res=>{
          let params = res.data.data||[]
          this.execTable(params)
      })
    },
    execTable(params){
        source.execSourceList(this.formObj.source_id,params).then(res=>{
            this.tableColumns = []
            if(res.data.data.length>0){
                this.tableColumns = Object.keys(res.data.data[0]).map(o=>{
                  return {
                    label:o,
                    field:o
                  }
                })
            }
      })
    },
    initRoot(){
      this.formObj = {
        pid:1,
        report_type:'excel'
      }
      this.isEdit = false
      this.show= true
    },
    initAdd(row){
      this.formObj = {
        pid:row.node.id,
        report_type:'excel'
      }
      this.isEdit = false
      this.show= true
    },
    handleEdit(row){
      this.formObj = {
        id:row.node.id,
        name:row.node.name,
        source_id:row.node.source_id,
        source_name:row.node.source_name
      }
      this.isEdit = true
      this.show= true
    },
    handleDel(row){
      this.$q.dialog({
        title: '提示',
        message: '你确定删除吗?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        report.delete(row.node.id).then(res=>{
          this.getTree()
        })
      }).onOk(() => {
        // console.log('>>>> second OK catcher')
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    handleOpen(prop){
      let row = prop.node;
      let routeUrl = this.$router.resolve({
        path: "/work",
        query: { id: row.id }
      });
      window.open(routeUrl.href, "_blank");
    },
    handleResult(row){
      this.resultNode = row.node
      this.resultDialog = true
    },
    onSubmit(){
      this.$refs.form.validate().then(async valid=>{
        if(valid){
          let data = {
            ...this.formObj,
            config:{
              columns:this.tableColumns
            }
          }
          if(!this.isEdit){
          await report.post(data)
        }else{
         await report.put(this.formObj.id,data)
        }
        this.getTree()
        this.show= false
        }
      })
    },
    onReset(){
      this.show = false
    }
  },
  created(){
      this.getSourceTree()
  },
  mounted(){
    this.getTree()
  }
}
</script>

<style scoped>
.choose{
  cursor: pointer;
}
</style>