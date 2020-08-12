export default async ({ Vue }) => {
    Vue.component('DialogClose',()=>import('c/DialogClose.vue'))
    Vue.component('MultipleTable',()=>import('c/table/multipleTableHeader.vue'))
    // Vue.component('centreLeft1Chart',()=>import('c/buttom/centreLeft1Chart.vue'))
  }