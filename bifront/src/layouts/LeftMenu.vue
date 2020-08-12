<template>
  <div style="max-width: 350px">
    <q-list class="rounded-borders">
      <div v-for="(item,i) in routerList" :key="i">
        <div v-if="item.meta.access&&$store.state.user.access.includes(item.name)">
          <q-expansion-item
            v-if="item.children&& item.children.length>0"
            expand-separator
            :label="item.meta.title"
            :content-inset-level="0.2"
          >
            <div>
              <LeftMenu :routerList="item.children" />
            </div>
          </q-expansion-item>
          <q-item v-else clickable v-close-popup @click="nav(item)" class="menu-item">
            <q-item-section>
              <q-item-label :class="$route.path==item.path?'text-amber-13':''">{{item.meta.title}}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-list>
  </div>
</template>
<script>
export default {
  name: "LeftMenu",
  props: ["routerList"],
  data() {
    return {};
  },
  methods: {
    nav(item) {
      this.$router.push(item.path);
      if (item.name == "datav") {
        let routeData = this.$router.resolve({
          name: "Datavv"
        });
        window.open(routeData.href, "_blank");
      }
    }
  }
};
</script>
<style scoped>
.menu-item {
  min-height: 100% !important;
}
</style>