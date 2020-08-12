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
      @update:selected="handleSelect"
    >
      <template v-slot:default-header="prop">
        <div class="row items-center">
          <div>{{ prop.node.title }}</div>
          <q-icon name="edit" color="green" size="16px" class="q-mr-sm" style="margin-left:10px;" >
            <q-menu auto-close>
              <q-list style="min-width: 100px" dense>
            <q-item clickable @click="handleOpen(prop)">
              <q-item-section>配置</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable @click="handleDel(prop)">
              <q-item-section>删除</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable @click="initAdd(prop)">
              <q-item-section>添加子节点</q-item-section>
            </q-item>
          </q-list>
            </q-menu>
          </q-icon>
        </div>
      </template>

      <!-- <template v-slot:default-body="prop">
        <div>{{prop.node.description}}</div>
      </template> -->
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
      <q-input
        filled
        v-model="formObj.alias"
        label="别名 *"
        hint="英文名"
        lazy-rules
        :rules="[ val => val && val.length > 0 || '不能为空']"
      />
        <div>
          <q-btn label="保存" type="submit" color="primary"/>
          <q-btn label="取消" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </dialog-close>
  </div>
</template>
<script>
import {source} from 'api/source.js'
export default {
  data () {
    return {
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
        { name: 'type', align: 'center', label: '类型', field: 'type', sortable: true },
        { name: 'val', align: 'center', label: '默认值', field: 'val', sortable: true },
      ]
    }
  },
  methods: {
    getTree() {
      source.getByTree(0).then(res=>this.treeData=res.data.data)
    },
    handleSelect(target){
      console.log("树",target,this.$refs.tree.getNodeByKey(target))
    },
    initRoot(){
      this.formObj = {
        config:{
          params:[],
        },
        pid:0
      }
      this.isEdit = false
      this.show= true
    },
    initAdd(row){
      this.formObj = {
        config:{
          params:[],
        },
        pid:row.node.id
      }
      this.isEdit = false
      this.show= true
    },
    handleEdit(row){
      this.formObj = {
        id:row.node.id,
        name:row.node.name,
        alias:row.node.alias
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
        source.delete(row.node.id).then(res=>{
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
    onSubmit(){
      this.$refs.form.validate().then(async valid=>{
        if(valid){
          if(!this.isEdit){
          await source.post(this.formObj)
        }else{
         await source.put(this.formObj.id,this.formObj)
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
  mounted(){
    this.getTree()
  }
}
</script>