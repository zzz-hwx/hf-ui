let map;
// #ifdef H5
import * as mapH5 from './platform/h5.js';
map = mapH5;
// #endif
// #ifdef MP-WEIXIN
import * as mapWx from './platform/wx.js';
map = mapWx;
// #endif
// #ifdef APP
import * as mapApp from './platform/app.js';
map = mapApp;
// #endif

export default map;
