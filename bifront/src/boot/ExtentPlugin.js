import Vue from 'vue'
import jsPlumb from 'jsplumb'
import _ from 'lodash'
import dataV from '@jiaminghi/data-view'
Vue.prototype.$jsPlumb = jsPlumb.jsPlumb
Vue.prototype.$lodash= _
Vue.use(dataV)