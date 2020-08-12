<template>
  <q-page class="q-pa-md">
    <q-table :data="tableData" :columns="columns" hide-bottom>
      <template v-slot:top>
        <q-btn color="primary" label="添加" @click="initAdd" />
        <q-space />
      </template>
      <template v-slot:body-cell-opt="props">
        <q-td :props="props">
          <div class="my-table-details">
            <q-btn color="primary" size="xs" label="编辑" @click="handleUpdate(props)" />
            <q-btn size="xs" label="删除" @click="handleDelete(props)" />
          </div>
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="isDialog" persistent>
      <q-card class="q-pa-md">
        <q-form
          ref="myForm"
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
          style="width:350px"
        >
          <q-input
            filled
            v-model="name"
            label="角色名称"
            lazy-rules
            :rules="[ val => val && val.length > 0 || '不能为空']"
          />
          <q-tree
            v-if="isDialog"
            :nodes="roleTree"
            node-key="name"
            tick-strategy="strict"
            :ticked.sync="ticked"
            style="min-height:300px;"
          >
            <template v-slot:default-header="prop">
              <div class="row items-center">
                <div class="text-weight-bold">{{ prop.node.title }}</div>
              </div>
            </template>
          </q-tree>
          <div>
            <q-btn label="确定" type="submit" color="primary" />
            <q-btn label="取消" type="reset" color="primary" flat class="q-ml-sm" />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { accessTree } from "cfg/right.js";
import { role } from "api/model";
export default {
  name: "",
  data() {
    return {
      columns: [
        {
          name: "id",
          align: "center",
          label: "序号",
          field: "id",
          sortable: true
        },
        {
          name: "name",
          align: "center",
          label: "角色",
          field: "name",
          sortable: true
        },
        {
          name: "opt",
          align: "center",
          label: "操作",
          field: "opt"
        }
      ],
      tableData: [],
      isDialog: false,
      name: "",
      ticked: [],
      isEdit: false,
      currentId: null
    };
  },
  computed: {
    roleTree() {
      return this.$lodash.cloneDeep(accessTree);
    }
  },
  methods: {
    initAdd() {
      this.name = "";
      this.ticked = [];
      this.isEdit = false;
      this.isDialog = true;
    },
    handleUpdate(node) {
      this.name = node.row.name;
      this.ticked = node.row.access.split(",");
      this.currentId = node.row.id;
      this.isEdit = true;
      this.isDialog = true;
    },
    handleDelete(node) {
      this.$q
        .dialog({
          title: "提示",
          message: "您确定要删除吗？",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          // console.log('>>>> OK')
          role.delete(node.row.id).then(res => {
            this.getData();
          });
        })
        .onOk(() => {
          // console.log('>>>> second OK catcher')
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },
    onSubmit() {
      this.$refs.myForm.validate().then(success => {
        if (success) {
          // 是的，模型是正确的
          if (!this.isEdit) {
            let data = {
              name: this.name,
              access: this.ticked.join(",")
            };
            role.post(data).then(res => {
              this.isDialog = false;
              this.getData();
            });
          } else {
            let data = {
              name: this.name,
              access: this.ticked.join(",")
            };
            role.put(this.currentId, data).then(res => {
              this.isDialog = false;
              this.getData();
            });
          }
        } else {
          // 哦，不，用户至少
          // 填写了一个无效值
        }
      });
    },
    onReset() {
      this.$refs.myForm.resetValidation();
      this.isDialog = false;
    },
    getData() {
      role.get().then(res => (this.tableData = res.data.data));
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style scoped>
</style>