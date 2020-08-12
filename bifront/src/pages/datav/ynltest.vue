<template>
  <div id="index" style="margin:0 0 0 0;">
    <dv-full-screen-container class="bg">
      <dv-loading v-if="loading">Loading...</dv-loading>
      <!-- <div class="host-body"> -->
      <div class="row">
        <div class="col">
          <dv-decoration-10 style="height:5px;" />
        </div>
        <div class="col-1">
          <dv-decoration-8 :color="['#568aea', '#000000']" style="height:50px;" />
        </div>
        <div class="col-5">
          <div class="row">
            <div class="col">
              <div
                id="title"
                class="title-text"
                style="font-size: 60px;color: #6aafe6;text-align: center;"
              >{{config.title}}</div>
            </div>
            <div class="col-2" v-if="model=='design'">
              <q-btn
                v-if="model=='design'"
                v-model="title"
                @click="Configtitle"
                style="right:10px"
                color="primary"
              >配置标题</q-btn>
            </div>
          </div>
        </div>
        <div class="col-1">
          <dv-decoration-8 :reverse="true" :color="['#568aea', '#000000']" style="height:50px;" />
        </div>
        <div class="col">
          <dv-decoration-10 style="height:5px; transform: rotateY(180deg);" />
        </div>
        <q-btn @click="Save" class="btn" color="primary" v-if="model=='design'">保存</q-btn>
      </div>
      <div class="row" style="height:85%">
        <div class="col">
          <div id="div1" style="width:100%;height:50%;">
            <dv-border-box-12 style="padding-left:10px;padding-right:20px;">
              <q-btn
                v-if="model=='design'"
                @click="showDialog('div1')"
                class="btn1"
                color="primary"
              >配置</q-btn>
              <div style="padding-top:50px;width:100%;height:100%;">
                <component
                  :is="config['div1'].component"
                  :id="config['div1'].id"
                  :model="model"
                  :div="'div1'"
                  @chartConfigChanged="chartConfigChange($event)"
                ></component>
              </div>
            </dv-border-box-12>
          </div>
          <div id="div2" style="width:100%;height:50%;">
            <dv-border-box-12 style="padding-left:10px;padding-right:20px;">
              <q-btn
                v-if="model=='design'"
                @click="showDialog('div2')"
                class="btn2"
                color="primary"
              >配置</q-btn>
              <div style="padding-top:50px;width:100%;height:100%;">
                <component
                  :is="config['div2'].component"
                  :id="config['div2'].id"
                  :model="model"
                  :div="'div2'"
                  @chartConfigChanged="chartConfigChange($event)"
                ></component>
              </div>
            </dv-border-box-12>
          </div>
        </div>
        <div class="col-5">
          <div id="div6" style="width:100%;height:20%;">
                  <div style="font-size:60px;text-align: center;color: #6aafe6;padding-top:20px;">{{time_now}}</div>
              <!-- <q-btn
                v-if="model=='design'"
                @click="showDialog('div6')"
                class="btn1"
                color="primary"
              >配置</q-btn>
              <div style="padding-top:50px;width:100%;height:100%;">
                <component
                  :is="config['div6'].component"
                  :subtitle="config['div6'].title"
                  :id="config['div6'].id"
                  :model="model"
                  :div="'div6'"
                  @chartConfigChanged="chartConfigChange($event)"
                ></component>
              </div>-->
          </div>
          <div id="div3" style="width:100%;height:80%;">
            <dv-border-box-11
              :title="config.div3.title"
              style="height:100%;padding-left:10px;padding-right:20px;"
            >
              <q-btn
                v-if="model=='design'"
                @click="showDialog('div3')"
                class="btn3"
                color="primary"
              >配置</q-btn>
              <div style="padding-top:100px;width:100%;height:100%;">
                <component
                  :is="config['div3'].component"
                  :id="config['div3'].id"
                  :model="model"
                  :div="'div3'"
                  @chartConfigChanged="chartConfigChange($event)"
                ></component>
              </div>
            </dv-border-box-11>
          </div>
        </div>
        <div class="col">
          <dv-border-box-13 style="height:50%;padding-left:10px;padding-right:10px;">
            <div id="div4" style="width:100%;height:100%;">
              <q-btn
                v-if="model=='design'"
                @click="showDialog('div4')"
                class="btn4"
                color="primary"
              >配置</q-btn>
              <div style="padding-top:50px;width:100%;height:100%;">
                <component
                  :is="config['div4'].component"
                  :id="config['div4'].id"
                  :model="model"
                  :div="'div4'"
                  @chartConfigChanged="chartConfigChange($event)"
                ></component>
              </div>
            </div>
          </dv-border-box-13>
          <dv-border-box-13 style="height:50%;padding-left:10px;padding-right:20px;">
            <div id="div5" style="height:100%">
              <q-btn
                v-if="model=='design'"
                @click="showDialog('div5')"
                class="btn4"
                color="primary"
              >配置</q-btn>
              <div style="padding-top:100px;width:100%;height:100%;">
                <component
                  :is="config['div5'].component"
                  :subtitle="config['div5'].title"
                  :id="config['div5'].id"
                  :model="model"
                  :div="'div5'"
                  @chartConfigChanged="chartConfigChange($event)"
                ></component>
              </div>
            </div>
          </dv-border-box-13>
        </div>
      </div>
    </dv-full-screen-container>
    <q-dialog v-model="Dialog" persistent>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">配置</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md" ref="Form">
            <div class="input">
              <q-input
                outlined
                v-model="config[div_now].title"
                type="text"
                label="标题"
                lazy-rules
                :rules="[ val => val && val.length > 0 || '不能为空']"
              />
            </div>
            <div class="select">
              <q-select
                color="grey-3"
                outlined
                label-color="orange"
                v-model="config[div_now].component"
                :options="options"
                option-value="comp"
                option-label="label"
                emit-value
                map-options
                label="图形类型"
              ></q-select>
            </div>
            <div class="button">
              <q-btn label="确定" type="submit" color="primary" />
              <q-btn label="取消" type="reset" color="primary" flat class="q-ml-sm" />
            </div>''
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isDialog" persistent>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">配置标题</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="Submit" @reset="Reset" class="q-gutter-md" ref="myForm">
            <q-input
              outlined
              class="input"
              v-model="title"
              label="主标题"
              lazy-rules
              :rules="[ val => val && val.length > 0 || '不能为空']"
            />
            <div class="button">
              <q-btn label="确定" size="small" type="submit" color="primary" />
              <q-btn label="取消" size="small" type="reset" color="primary" flat class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import pieEchart from "./components/pieEchart";
import barEcharts from "./components/barEchart";
import lineEchart from "./components/lineEchart.vue";
import gaugeEchart from "./components/gaugeEchart.vue";
import mapEchart from "./components/mapEchart.vue";
import carousselDatav from "./components/carousselDatav.vue";
import { datavtemplate } from "api/datav";

export default {
  props: ["setting", "uuid"],
  data() {
    return {
      time_now: {},
      id: 0,
      template: {},
      options: [
        {
          label: "饼图",
          comp: "pieEchart"
        },
        {
          label: "折线图",
          comp: "lineEchart"
        },
        {
          label: "仪表盘",
          comp: "gaugeEchart"
        },
        {
          label: "柱状图",
          comp: "barEcharts"
        },
        {
          label: "地图",
          comp: "mapEchart"
        },
        {
          label: "轮播表",
          comp: "carousselDatav"
        }
      ],
      component: "",
      subtitle: "",
      title: "",
      text: "",
      Dialog: false,
      isDialog: false,
      show: false,
      loading: true,
      model: "design",
      config: {
        title: "",
        div1: {
          title: "",
          id: 0,
          component: ""
        },
        div2: {
          title: "",
          id: 0,
          component: ""
        },
        div3: {
          title: "",
          id: 0,
          component: ""
        },
        div4: {
          title: "",
          id: 0,
          component: ""
        },
        div5: {
          title: "",
          id: 0,
          component: ""
        },
        div6: {
          title: "",
          id: 0,
          component: ""
        }
      },
      div_now: "div1",
      chart: {}
    };
  },
  components: {
    lineEchart,
    gaugeEchart,
    pieEchart,
    barEcharts,
    mapEchart,
    carousselDatav,
  },
  mounted() {
    debugger
    this.cancelLoading();
    this.model = this.$route.query.model;
    this.id = this.$route.query.id;
    datavtemplate.getById(this.id).then(res => {
      this.template = res.data.data;
      if (this.template.config) {
        this.config = this.template.config;
      }
    });
    setInterval(() => {
      let d = new Date();
      this.time_now = d.toLocaleTimeString();
    }, 1000);
  },
  methods: {
    chartConfigChange(event) {
      this.config[event.div].id = event.id;
    },
    showDialog(div) {
      this.Dialog = true;
      this.div_now = div;
    },
    cancelLoading() {
      debugger
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    },
    onSubmit() {
      this.$refs.Form.validate().then(success => {
        if (success) {
          // 是的，模型是正确的
          // this.config[this.div_now].title = this.subtitle;
          this.config[this.div_now].div = this.div_now;
          // this.config[this.div_now].component = this.component;
          this.config[this.div_now].id = 0;
          this.Dialog = false;
        } else {
          // 哦，不，用户至少
          // 填写了一个无效值
        }
      });
    },
    onReset() {
      this.$refs.Form.resetValidation();
      this.Dialog = false;
    },
    Save() {
      this.$q
        .dialog({
          title: "提示",
          message: "你确定要保存吗?",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.template.config = this.config;
          datavtemplate
            .put(this.id, this.template)
            .then(res => {
              if (res.data.code == 0) {
                this.Dialog = false;
                this.$q.notify({
                  message: "成功保存",
                  color: "green"
                });
                this.getData();
              }
            })
            .catch(err => {
              debugger;
              this.$q.notify({
                message: err.data.message,
                color: "purple"
              });
            });
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        });
    },
    Configtitle() {
      this.isDialog = true;
    },
    Submit() {
      this.$refs.myForm.validate().then(success => {
        if (success) {
          // 是的，模型是正确的
          this.config.title = this.title;
          this.isDialog = false;
        } else {
          // 哦，不，用户至少
          // 填写了一个无效值
        }
      });
    },
    Reset() {
      this.$refs.myForm.resetValidation();
      this.Dialog = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/style.scss";
@import "../../assets/scss/index.scss";
.btn {
  position: absolute;
  right: 30px;
  top: 20px;
}
.btn1 {
  position: absolute;
  right: 5px;
  top: 10px;
}
.btn2 {
  position: absolute;
  right: 5px;
  top: 10px;
}
.btn3 {
  position: absolute;
  right: 10px;
  top: 50px;
}
.btn4 {
  position: absolute;
  right: 5px;
  top: 15px;
}
.btn5 {
  position: absolute;
  right: 10px;
  top: 10px;
}
.input {
  width: 350px;
  height: 90px;
}
.select {
  width: 350px;
  height: 90px;
}
.button {
  height: 30px;
  padding-left: 250px;
}
</style>
