import * as filters from '../util/filters.js'
export default async ({ Vue }) => {
    Object.keys(filters).forEach(key => {
        Vue.filter(key, filters[key])
      })
  }