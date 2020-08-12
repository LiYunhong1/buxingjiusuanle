<template>
  <q-layout view="hHh lpR fFf">

    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>
          <q-avatar>
            <img src="statics/images/logo.jpg">
          </q-avatar>
          {{title}}
        </q-toolbar-title>
        <q-btn-dropdown stretch flat>
          <template v-slot:label>
            <q-avatar>
          <img src="https://cdn.quasar.dev/img/boy-avatar.png">
        </q-avatar>
          </template>
      <q-list>
        <q-item clickable v-close-popup @click="onItemClick">
          <q-item-section>
            <q-item-label>用户设置</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="onLogOut">
          <q-item-section>
            <q-item-label>退出登录</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" :width="250" side="left" elevated >
      <!-- drawer content -->
      <LeftMenu :routerList="menus" />
      
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import {title} from 'cfg/system.js'
import {leftRouter} from 'src/router/routes.js'
export default {
  data () {
    return {
      title:title,
      left: true,
      menus:leftRouter
    }
  },
  components:{
    LeftMenu:()=>import('./LeftMenu.vue')
  },
  methods: {
    onItemClick() {
      
    },
    onLogOut(){
      this.$q.localStorage.set("token","")
      this.$router.push("/login")
    }
  },
  mounted(){
    console.log('++',process)
  }
}
</script>