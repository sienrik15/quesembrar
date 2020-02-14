import Vue from 'vue'
//import Buefy from 'buefy'
//import 'buefy/dist/buefy.css'
import App from './App.vue'
import router from './router'
import vSelect from 'vue-select'
const path = require('path');
import 'vue-select/dist/vue-select.css';
import './assets/styles/main.styl'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faCheck)
Vue.component('f-icon', FontAwesomeIcon);
Vue.component('v-select', vSelect);

import firebase from 'firebase';
require('firebase/firestore');


/* Paste your firebase configuration below */
const config = {
  apiKey: '19923b79f172052ed60cc3a0bc21d781b5a09f93',
  authDomain: 'agroanalytics-b2462.firebaseapp.com',
  databaseURL: 'https://agroanalytics-b2462.firebaseio.com',
  projectId: 'agroanalytics-b2462',
  storageBucket: 'agroanalytics-b2462.appspot.com',
  messagingSenderId: '110724103006472454240',
};

/* Initialize firebase with your configuration */
firebase.initializeApp(config);

/* Bind firebase to your Vue instance */
Vue.prototype.$firebase = firebase;

Vue.config.productionTip = false;
//Vue.use(Buefy);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
