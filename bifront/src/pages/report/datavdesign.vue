<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md" style="height:800px">
      <div class="col-3 ">
        <q-table
          :data="tabledata"
          :columns="tablecolumns"
          style="height:100%"
        >
          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <q-btn color="primary" size="sm" label="设计" @click="design(props)" />
              <q-btn
                color="white"
                text-color="black"
                size="sm"
                label="删除"
                @click="tryDelete(props)"
              />
              <q-btn color="primary" size="sm" label="运行" @click="run(props)" />
            </q-td>
          </template>
        </q-table>
      </div>
      <div class="col">
        <div class="row">
          <div class="column" style="width:50%">
            <q-img src="statics/images/datav_snapshoot1.png" />
            <p></p>
            <div align="center">
              <q-btn
                @click="newconfig(0)"
                color="primary"
                label="新建"
                style="width:100px;align:center;"
              />
            </div>
          </div>
          <div class="column" style="width:50%">
            <q-img src="statics/images/大屏模板2.png" />
            <p></p>
            <div align="center">
              <q-btn
                @click="newconfig(1)"
                color="primary"
                label="新建"
                style="width:100px;align:center;"
              />
            </div>
          </div>
          <div class="col"></div>
        </div>
      </div>
    </div>
    <q-dialog v-model="Dialog" persistent>
      <q-card style="width:300px;height:400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">新建大屏</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md" ref="newconfig">
            <q-input
              v-model="formObj.name"
              type="text"
              label="大屏名称"
              :rules="[ val => val&&val.length > 0|| '不能为空']"
            />
            <q-input v-model="formObj.template_name" type="text" label="模板名称" readonly="readonly" />
            <p></p>
            <q-btn label="新建" type="submit" color="primary" size="md" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { datavtemplate } from "api/datav";
// import { ynltest } from "page/datav/design/ynltest.vue";
export default {
  data() {
    return {
      datavname: "",
      Dialog: false,
      tabledata: [],
      tablecolumns: [
        { name: "name", align: "center", label: "大屏名称", field: "name" },
        // {
        //   name: "template_name",
        //   align: "center",
        //   label: "模板名称",
        //   field: "template_name"
        // },
        {
          name: "action",
          align: "center",
          label: "操作",
          field: "action"
        }
      ],
      template:[
        {
          vue_name: "ynltest",
          template_name:"测试模板"
        },
        {
          vue_name: "lyhtest",
          template_name:"测试模板1"
        }
      ],
      formObj: {}
    };
  },
  methods: {
    design(props) {
      let page = props.row.vue_name;
      let routeData = this.$router.resolve({
        name: "datavdesign"+page,
        query:{
          model: "design",
          id:props.row.id
        }
      });
      window.open(routeData.href, "_blank");
    },
    run(props) {
      let page = props.row.vue_name;
      let routeData = this.$router.resolve({
        name: "datavdesign"+page,
        query:{
          model: "run",
          id:props.row.id
        }
      });
      window.open(routeData.href, "_blank");
    },
    tryDelete(props) {
      this.$q
        .dialog({
          title: "提示",
          message: "你确定要删除吗?",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          // console.log('>>>> OK')
          let id = props.row.id;
          datavtemplate.delete(id).then(res => {
            this.getData();
          });
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },

    getData() {
      debugger
      datavtemplate.get().then(res => {
        this.tabledata = res.data.data;
      });
    },
    onSubmit() {
      this.$refs.newconfig.validate().then(success => {
        if (success) {
          // 是的，模型是正确的
          debugger
          datavtemplate
            .post(this.formObj)
            .then(res => {
              if (res.data.code == 0) {
                this.Dialog = false;
                this.$q.notify({
                  message: "成功新建",
                  color: "green"
                });
                this.getData();
              }
            })
            .catch(err => {
              this.$q.notify({
                message: err.data.message,
                color: "purple"
              });
            });
        } else {
          // 哦，不，用户至少
          // 填写了一个无效值
        }
      });
    },
    newconfig(id) {
      debugger
      this.formObj.datavname = "";
      this.formObj.vue_name = this.template[id].vue_name;
      this.formObj.template_name = this.template[id].template_name;
      this.Dialog = true;
    }
  },
  created() {},
  mounted() {
    this.getData();
  }
};
</script>

<style scoped>
</style>