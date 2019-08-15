import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faCheck)
Vue.component('f-icon', FontAwesomeIcon)



Vue.config.productionTip = false
Vue.use(Buefy);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
