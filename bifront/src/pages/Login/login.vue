<template>
  <q-layout view="hHh lpR fFf" class="login">
    <q-page-container>
      <div class="login-form q-pa-md">
        <q-form @submit="onSubmit" class="q-gutter-md" ref="login">
          <q-input
            color="purple-12"
            v-model="formObj.user_id"
            label="账号"
            lazy-rules
            :rules="[ val => val && val.length > 0 || '不能为空']"
          >
            <template v-slot:prepend>
              <q-icon name="account_box" />
            </template>
          </q-input>
          <q-input
            color="purple-12"
            type="password"
            v-model="formObj.password"
            label="密码"
            lazy-rules
            :rules="[ val => val && val.length > 0 || '不能为空']"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
          </q-input>
          <div align="center">
            <q-btn label="登录" type="submit" color="primary" class="login-btn" />
          </div>
        </q-form>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { user } from "api/model";

import md5 from "md5";
import {mapActions} from 'vuex'
export default {
  data() {
    return {
      formObj: {}
    };
  },
  methods: {
    ...mapActions('user',['getToken']),
    onSubmit() {
      this.$refs.login.validate().then(success => {
        if (success) {
          // 是的，模型是正确的
          let data = {
            user_id: this.formObj.user_id,
            password: md5(this.formObj.password)
          };
          user
            .login(data)
            .then(res => {
              if (res.data.code==0) {
                let token = res.data.data.token
                this.$q.localStorage.set("token", token);
                this.getToken(token)
                if(this.$store.state.user.token){
                  this.$router.push("/home");
                }
              }
            })
            .catch(err => {
              console.log("错误", err);
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
    }
  }
};
</script>
<style scoped>
.login {
  width: 100%;
  height: 100%;
  background-image: url("/statics/images/login.jpg");
  background-size: 100% 100%;
}
.login-form {
  position: fixed;
  width: 350px;
  top: 30%;
  right: 20%;
  background-color: white;
  z-index: 9999;
}
.login-btn {
  width: 250px;
  text-align: center;
}
</style>