import App from './App';

// #ifndef VUE3
import Vue from 'vue';
import './uni.promisify.adaptor';

import '@/plugins/middleware.js';
import '@/plugins/uview-ui.js';
import '@/plugins/hf-ui.js';

// #ifdef H5
// import VConsole from 'vconsole';
// const vConsole = new VConsole();
// #endif

Vue.config.productionTip = false;
App.mpType = 'app';
const app = new Vue({
	...App
})
app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
	const app = createSSRApp(App);
	return {
		app
	}
}
// #endif
