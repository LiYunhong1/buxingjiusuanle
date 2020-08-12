<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-white text-black">
      <q-toolbar>
        <q-toolbar-title class="row justify-center">{{detail.name}}</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above side="left" bordered>
      <q-list bordered>
        <q-item-label header class="row no-wrap justify-between">
          <span>我的执行</span>
          <q-btn size="6px" text-color="primary" label="清空" @click="doneList=[]" />
        </q-item-label>
        <q-item
          v-for="contact in doneList"
          :key="contact.key"
          @click="preview(contact)"
          class="q-my-sm"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-avatar
              :color="contact.message | formatDone('C')"
              text-color="white"
            >{{ contact.message | formatDone('T') }}</q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ contact.name }}</q-item-label>
            <q-item-label caption lines="1">{{ contact.date | formatTime }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-avatar size="xs">
              <img :src="'statics/images/'+contact.icon" />
            </q-avatar>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-drawer show-if-above side="right" :width="400" bordered>
      <!-- drawer content -->
      <div class="q-pa-md">
        <q-card class="my-card">
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input filled dense v-model="detail.name">
                <template v-slot:before>
                  <span class="form-label">名称</span>
                </template>
              </q-input>
              <q-input filled dense v-model="detail.alias">
                <template v-slot:before>
                  <span class="form-label">别名</span>
                </template>
              </q-input>
              <q-input filled dense v-model="detail.time">
                <template v-slot:before>
                  <span class="form-label">启动时间</span>
                </template>
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date v-model="detail.time" mask="YYYY-MM-DD HH:mm" />
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-time v-model="detail.time" mask="YYYY-MM-DD HH:mm" format24h />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-select
                v-model="detail.users"
                :options="userList"
                option-value="id"
                option-label="name"
                emit-value
                map-options
                filled
                dense
              >
                <template v-slot:before>
                  <span class="form-label">负责人</span>
                </template>
              </q-select>
            </q-form>
          </q-card-section>
        </q-card>
        <p style="height:10px"></p>
        <q-table
          title="参数"
          :data="params||[]"
          :columns="columns"
          row-key="name"
          no-data-label="无数据"
          hide-bottom
          separator="cell"
          table-style="max-height: 250px;height:250px;"
          binary-state-sort
        >
          <template v-slot:top>
            <q-btn color="secondary" size="xs" label="添加" @click="addParma" />
            <q-space />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name">
                  <q-input v-model="props.row.name" dense autofocus counter filled />
                </q-popup-edit>
              </q-td>
              <q-td key="var" :props="props">
                {{ props.row.var }}
                <q-popup-edit v-model="props.row.var">
                  <q-input v-model="props.row.var" dense autofocus filled />
                </q-popup-edit>
              </q-td>
              <q-td key="type" :props="props">
                <div class="text-pre-wrap">{{ props.row.type | formatCol}}</div>
                <q-popup-edit v-model="props.row.type">
                  <q-select
                    v-model="props.row.type"
                    emit-value
                    map-options
                    :options="$store.state.report.column_type"
                    filled
                  />
                </q-popup-edit>
              </q-td>
              <q-td key="var" :props="props">
                {{ props.row.val }}
                <q-popup-edit v-model="props.row.val" persistent>
                  <q-input
                    v-if="props.row.type=='number'"
                    type="number"
                    v-model="props.row.val"
                    dense
                    autofocus
                    filled
                  />
                  <q-input v-else-if="props.row.type=='datetime'" filled v-model="props.row.val">
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy transition-show="scale" transition-hide="scale">
                          <q-date v-model="props.row.val" mask="YYYY-MM-DD HH:mm" />
                        </q-popup-proxy>
                      </q-icon>
                    </template>

                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy transition-show="scale" transition-hide="scale">
                          <q-time v-model="props.row.val" mask="YYYY-MM-DD HH:mm" format24h />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <q-input v-else v-model="props.row.val" dense autofocus filled />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <p style="height:10px"></p>
        <q-input v-model="project.script" type="textarea" label="脚本" outlined />
      </div>
    </q-drawer>

    <q-page-container>
      <q-list>
        <q-item>
          <div class="fit row no-wrap items-center" style="overflow: auto;">
            <div
              class="tool"
              v-for="(item, index) in items"
              :key="index"
              :data-index="index"
              draggable="true"
              @dragstart="drag($event,item)"
              @dragend="dragend"
            >
              <q-avatar>
                <img :src="'statics/images/'+item.icon" />
              </q-avatar>
              <p style="font-size:12px;margin:0;">{{item.name}}</p>
            </div>
          </div>
        </q-item>
        <q-separator />
        <q-item>
          <div
            class="work"
            ref="flowContent"
            @dblclick="isConnect=false"
            @drop="drop($event)"
            @dragover.prevent
          >
            <div
              v-for="(item,index) in data.nodeList"
              :key="index"
              :id="item.id"
              :style="item.style"
              class="box-node"
            >
              <div
                class="box-content"
                @dblclick.prevent="handleNode(item,index)"
                @contextmenu.prevent="deleteNode(item.id)"
              >
                <span class="flow-node-left">
                  <img :src="'statics/images/'+item.icon" height="100%" />
                </span>
                <span class="box-title">{{item.name}}</span>
                <span class="flow-node-drag"></span>
              </div>
            </div>
          </div>
        </q-item>
      </q-list>
      <q-btn @click="save" round color="primary" label="保存" class="saveBtn" />
    </q-page-container>

    <q-dialog v-model="show" seamless full-height position="right">
      <q-card style="max-width:100%;">
        <q-card-section class="row items-center">
          <div class="text-h6">工具设置及操作</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-form @reset="onReset" ref="form" style="width:700px;" class="q-pa-md q-gutter-md">
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
          <q-input filled v-model="formObj.description" label="描述" type="textarea" autogrow />
          <component v-if="show" :is="comp" :params.sync="formObj.params"></component>
          <div>
            <q-btn label="保存" @click="onSubmit" color="primary" />
            <q-btn label="执行" @click="done" color="positive" flat class="q-ml-sm" />
            <q-btn label="取消" type="reset" color="primary" flat class="q-ml-sm" />
          </div>
          <q-space />
          <Result :result.sync="result" :nodata.sync="previewNodata" />
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="previewDialog" seamless full-height position="left">
      <q-card class="full-height" style="max-width:100%;">
        <q-card-section class="row items-center">
          <div class="text-h6">历史数据</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <div>
        <q-form ref="form" style="width:700px;" class="q-pa-md q-gutter-md">
          <Result :result.sync="previewData" :nodata.sync="previewNodata" height="600" />
        </q-form>
        </div>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="关闭" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { user } from "api/model";
import { source } from "api/source";

import { workJsplumb } from "./work-jsplumb";
export default {
  mixins: [workJsplumb],
  data() {
    return {
      config: null,
      detail: {},
      show: false,
      left: false,
      right: false,
      dom: null,
      items: [
        {
          icon: "0.png",
          name: "SQL提取",
          type: "query_sql",
          component: "QuerySql",
          params: {}
        },
        {
          icon: "1.png",
          name: "数据提取",
          type: "query_es",
          component: "QueryEs",
          params: {}
        },
        {
          icon: "2.png",
          name: "数据关联",
          type: "join",
          component: "Join",
          params: {}
        },
        {
          icon: "3.png",
          name: "添加列",
          type: "add_column",
          component: "AddColumn",
          params: {}
        },
        {
          icon: "4.png",
          name: "列重命名",
          type: "rename_column",
          component: "RenameColumn",
          params: {}
        },
        {
          icon: "5.png",
          name: "删除列",
          type: "drop_column",
          component: "DropColumn",
          params: {}
        },
        {
          icon: "6.png",
          name: "保留列",
          type: "remain_column",
          component: "RemainColumn",
          params: {}
        },
        {
          icon: "7.png",
          name: "分组统计",
          type: "groupby",
          component: "Groupby",
          params: {}
        },
        {
          icon: "8.png",
          name: "数据透视",
          type: "pivot",
          component: "Pivot",
          params: {}
        },
        {
          icon: "9.png",
          name: "排序",
          type: "sort",
          component: "Sort",
          params: {}
        }
      ],
      node: {},
      nodeObj: {},
      columns: [
        {
          name: "name",
          align: "center",
          label: "参数名",
          field: "name",
          sortable: true
        },
        {
          name: "var",
          align: "center",
          label: "变量",
          field: "var",
          sortable: true
        },
        {
          name: "type",
          align: "center",
          label: "类型",
          field: "type",
          sortable: true
        },
        {
          name: "val",
          align: "center",
          label: "默认值",
          field: "val",
          sortable: true
        }
      ],
      toolColumn: [
        {
          name: "name",
          label: "参数名",
          field: "name"
        },
        {
          name: "val",
          label: "值",
          field: "val"
        }
      ],
      params: [],
      project: {
        script: ""
      },
      userList: [],
      formObj: {},
      editIndex: null,
      comp: "",
      result: [],
      doneList: [],
      previewDialog: false,
      previewData: [],
      previewNodata: "你还未执行操作"
    };
  },
  components: {
    QuerySql: () => import("./component/query_sql"),
    QueryEs: () => import("./component/query_es"),
    Join: () => import("./component/join"),
    AddColumn: () => import("./component/add_column"),
    DropColumn: () => import("./component/drop_column"),
    RenameColumn: () => import("./component/rename_column"),
    RemainColumn: () => import("./component/remain_column"),
    Groupby: () => import("./component/groupby"),
    Pivot: () => import("./component/pivot"),
    Sort: () => import("./component/sort"),
    Result: () => import("./component/result")
  },
  filters: {
    formatDone(val, type) {
      let content = val.substring(0, 1).toLocaleUpperCase();
      let res = {
        color: "primary",
        text: "√"
      };
      switch (content) {
        case "S":
          res = {
            color: "positive",
            text: "√",
            status: "S"
          };
          break;
        case "P":
          res = {
            color: "secondary",
            text: "...",
            status: "P"
          };
          break;
        default:
          res = {
            color: "warning",
            text: "×",
            status: "F"
          };
          break;
      }
      if (type == "C") {
        return res.color;
      } else {
        return res.text;
      }
    }
  },
  methods: {
    addParma() {
      this.params.push({
        name: null,
        var: null,
        type: null,
        val: null
      });
    },
    getUser() {
      user.get().then(res => (this.userList = res.data.data));
    },

    // 打开工具
    handleNode(item, index) {
      debugger
      this.previewNodata = "你还未执行操作";
      this.formObj = item;
      this.editIndex = index;
      this.comp = item.component;
      this.result = [];
      this.show = true;
    },
    onSubmit() {
      this.$refs.form.validate().then(async valid => {
        if (valid) {
          // source.test(this.formObj.id,this.formObj).then(res=>{})
          this.show = false;
        }
      });
    },
    onReset() {
      this.show = false;
    },
    done() {
      this.result = [];
      this.$refs.form.validate().then(async valid => {
        if (valid) {
          // source.test(this.formObj.id,this.formObj).then(res=>{})
          let data = {
            ...this.project,
            params: this.params,
            functions: this.data.nodeList,
            edges: this.data.edges
          };
          source.test(this.formObj.id, data).then(res => {
            this.result = res.data.data;
            this.previewNodata = res.data.message;
            this.doneList.push({
              name: this.formObj.name,
              id: this.formObj.id,
              key: res.data.ext.key,
              message: res.data.message,
              date: new Date().toJSON(),
              icon: this.formObj.icon
            });
          });
        }
      });
    },
    save() {
      let config = {
        ...this.project,
        params: this.params,
        functions: this.data.nodeList,
        edges: this.data.edges
      };
      let data = {
        ...this.detail,
        config
      };
      source.put(this.$route.query.id, data).then(res => {
        if (res.data.code == 0) {
          this.$q.notify({
            message: "保存成功",
            color: "positive"
          });
        }
      });
    },
    preview(row) {
      this.previewNodata = "你还未执行操作";
      this.result = [];
      source.previewTask(row.key).then(res => {
        this.previewData = res.data.data || [];
        this.previewNodata = res.data.message;
        this.previewDialog = true;
      });
    },
    async getDetail() {
      source.getById(this.$route.query.id).then(res => {
        let { name, alias, time, users } = res.data.data;
        this.detail = { name, alias, time, users };
        this.config = this.$lodash.cloneDeep(res.data.data.config);
        if (this.config) {
          this.data.nodeList = this.config.functions || [];
          this.data.edges = this.config.edges || [];
          this.project = {
            script: this.config.script || ""
          };
          this.params = this.config.params || [];
          this.loadNode();
          setTimeout(() => {
            this.loadFlow();
          }, 2000);
        }
      });
    }
  },
  created() {
    this.getUser();
  }
};
</script>
<style scoped>
.tool {
  margin: 15px;
  padding: 5px 15px;
  text-align: center;
  border: 1px solid #e3e3e3;
  border-radius: 6px;
}
.work {
  position: relative;
  height: 700px;
  width: 100%;
  overflow: auto;
}
.form-label {
  font-size: 14px;
  width: 80px;
  text-align: right;
}
.box-node {
  position: absolute;
  width: 12.5em;
  height: 30px;
  border: 1px solid #e3e3e3;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.05);
}
.box-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
}
.box-title {
  flex: 1;
  text-align: center;
  text-overflow: ellipsis;
  cursor: pointer;
}
.flow-node-drag {
  width: 10px;
  height: 100%;
  background-color: greenyellow;
}
.flow-node-left {
  width: 10px;
  height: 100%;
}
.saveBtn {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 9999;
}
</style>