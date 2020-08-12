<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="bg-dark datav">
        <div class="datav-top">
          <p class="data-title">数据展示区域</p>
          <q-icon
            @click="screen()"
            color="secondary"
            :name="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
            class="btn-fullscreen"
            size="xs"
          ></q-icon>
        </div>
        <div class="datav-center"></div>
        <div class="datav-bottom"></div>
      </q-page>
      <q-btn color="primary" round class="setting">配置</q-btn>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    screen() {
      this.$q.fullscreen.request(this.$el);
    }
  }
};
</script>

<style>
.datav {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  color: lightblue;
}
.datav-top {
  flex: 0.4;
  overflow: hidden;
  position: relative;
}
.datav-center {
  flex: 8;
}
.datav-bottom {
  flex: 3;
}
.btn-fullscreen {
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 9999;
}
.data-title {
  font-size: 30px;
  font-weight: bolder;
  font-family: KaiTi;
  text-align: center;
  letter-spacing:1rem;
  background-image: -webkit-linear-gradient(
    left,
    #2d8cf0,
    red 25%,
    green 50%,
    #fff 75%,
    #2d8cf0
  );
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-background-size: 200% 100%;
  -webkit-animation: title-animation 3s infinite linear;

  border-bottom:6px solid rgb(132, 181, 236);
     border-image: -webkit-linear-gradient(rgb(75, 241, 172),rgb(30, 79, 168)) 30 30;
     border-image: -moz-linear-gradient(rgb(75, 241, 172),rgb(30, 79, 168)) 30 30;
     border-image: linear-gradient(rgb(75, 241, 172),rgb(30, 79, 168)) 30 30;
}

@-webkit-keyframes title-animation {
  0% {
    background-position: 0 0;
  }
  25% {
    background-position: -25% 0;
  }
  75% {
    background-position: -75% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
.setting{
  position: fixed;
  right: 10px;
  bottom: 10px;
  z-index: 9999;
}
</style>