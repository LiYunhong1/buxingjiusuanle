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
        style="width:700px;"
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
         <q-menu auto-close>
          <q-tree
      :nodes="sourceTree"
      node-key="id"
      accordion
      ref="tree"
    >
    <template v-slot:default-header="prop" v-slot:selected>
        <div class="row items-center" v-close-popup @click="handleSelect(prop.node)">
          <div class="text-weight-bold">{{ prop.node.label }}</div>
        </div>
      </template>
    </q-tree>
      </q-menu>
      </q-field>


    <q-splitter
    v-if="formObj.source_id"
      v-model="splitterModel"
      style="height: 450px"
    >
      <template v-slot:before>
        <div class="q-pa-md">
            <q-btn color="primary" size="xs" label="添加根表头" @click="initColHeader" />
            <q-space />
            <q-separator/>
          <q-tree
            :nodes="customColHeader"
            node-key="label"
            selected-color="primary"
          >
          <template v-slot:default-header="prop">
              <div class="row items-center choose">
                <div>{{ prop.node.label }}</div>
          <q-icon name="edit" color="green" size="16px" class="q-mr-sm" style="margin-left:10px;" >
            <q-menu auto-close>
              <q-list style="min-width: 100px" dense>
            <q-item clickable @click="colHeaderEdit(prop)">
              <q-item-section>编辑</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable @click="colHeaderDel(prop)">
              <q-item-section>删除</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable @click="initColHeaderChild(prop)">
              <q-item-section>添加子节点</q-item-section>
            </q-item>
          </q-list>
            </q-menu>
          </q-icon>
              </div>
              
            </template>
          </q-tree>
        </div>
      </template>

      <template v-slot:after>
        <q-form
          class="q-gutter-md"
        >
          <q-input v-model="colContent.label" type="text" label="名称" filled />
          <q-select v-model="colContent.field" :options="tableColumns" label="值列" filled />
          <q-input v-model="colContent.width" type="text" label="宽度" filled />
          <q-select v-model="colContent.required" :options="[{label:'是',value:true},{label:'否',value:false}]" option-value="value"
        option-label="label"
        emit-value
         label="冻结" filled />
         <q-input
        filled
        v-model="colContent.color"
        class="my-input"
        label="字体颜色"
      >
        <template v-slot:append>
          <q-icon name="colorize" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-color v-model="colContent.color" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input
        filled
        v-model="colContent.bg_color"
        class="my-input"
        label="背景颜色"
      >
        <template v-slot:append>
          <q-icon name="colorize" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-color v-model="colContent.bg_color" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
        </q-form>
      </template>
    </q-splitter>

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
      formObj:{},
      columns:[
        { name: 'name', align: 'center', label: '参数名', field: 'name', sortable: true },
        { name: 'var', align: 'center', label: '变量', field: 'var', sortable: true },
        { name: 'val', align: 'center', label: '默认值', field: 'val', sortable: true },
      ],
      splitterModel:50,
      tableColumns:[], // 选择表头关联字段
      customColHeader:[], // 自定义表结构
      colContent:{},
      params:[],
      resultDialog:false,
      resultNode:{}
    }
  },
  components: {
    DrawTable:()=>import('./component/drawTable'),
  },
  methods: {
    getTree() {
      report.getByTree(2).then(res=>this.treeData=res.data.data)
    },
    getSourceTree(){
        source.getByTree(0).then(res=>this.sourceTree=res.data.data)
    },
    async handleSelect(target){
      this.$set(this.formObj,'source_id',target.id)
      this.$set(this.formObj,'source_name',target.name)
      source.getSourceParamList(this.formObj.source_id).then(res=>{
          this.params = res.data.data
          this.execTable()
      })
    },
    execTable(){
        source.execSourceList(this.formObj.source_id,this.params).then(res=>{
            this.tableColumns = []
            if(res.data.data.length>0){
                this.tableColumns = Object.keys(res.data.data[0])
            }
      })
    },
     // 选择树节点
    updateSelect(node){
        console.log('节点',node)
        this.colContent = node
    },
    initRoot(){
      this.formObj = {
        pid:2,
        report_type:'web'
      }
      this.customColHeader=[]
      this.isEdit = false
      this.show= true
    },
    initAdd(row){
      console.log("row",row)
      this.formObj = {
        pid:row.node.id,
        report_type:'web'
      }
      this.customColHeader=[]
      this.isEdit = false
      this.show= true
    },
    async handleEdit(row){
      this.formObj = {
        id:row.node.id,
        name:row.node.name,
        source_id:row.node.source_id,
        source_name:row.node.source_name
      }
      this.customColHeader = row.node.config.columns||[]
      await this.execTable()
      this.colContent = {}
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
                columns:this.customColHeader
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
    },
    initColHeader(){
        this.$q.dialog({
        title: '提示',
        message: '请输入名称',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        // console.log('>>>> OK, received', data)
        this.customColHeader.push({
            label:data
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    initColHeaderChild(prop){
        this.$q.dialog({
        title: '提示',
        message: '请输入名称',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        console.log('>>>> OK, received', data,prop)
        let children = prop.node.children ||[]
        children.push({
            label:data
        })
        this.$set(prop.node,'children',children)

      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    colHeaderDel(prop){
       this.removeNode(this.customColHeader,prop.node)
    },
    colHeaderEdit(prop){
        this.colContent=prop.node
    },
    // 删除节点
    removeNode(data,node){
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if(element.label==node.label){
          data.splice(index,1)
          return
        } else{
          if(element.children&&element.children.length>0){
            this.removeNode(element.children,node)
          }
        }
      }
      return data
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
</style>