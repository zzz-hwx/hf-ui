function e(t, n) {
	t = t.replace(/=/g, "");
	var o = [];
	switch (n.constructor) {
		case String:
		case Number:
		case Boolean:
			o.push(encodeURIComponent(t) + "=" + encodeURIComponent(n));
			break;
		case Array:
			n.forEach((function(n) {
				o = o.concat(e(t + "[]=", n))
			}));
			break;
		case Object:
			Object.keys(n).forEach((function(r) {
				var a = n[r];
				o = o.concat(e(t + "[" + r + "]", a))
			}))
	}
	return o
}

function t(e) {
	var n = [];
	return e.forEach((function(e) {
		"string" == typeof e ? n.push(e) : n = n.concat(t(e))
	})), n
}
/**
 * Vue Jsonp.
 * # Carry Your World #
 *
 * @author: LancerComet
 * @license: MIT
 * @tutorial https://www.npmjs.com/package/vue-jsonp
 */
var n = {
	install: function(e) {
		e.prototype.$jsonp = jsonp
	}
};

/**
 * 
 * @param {String} url		请求地址
 * @param {Object} param	请求参数
 * @param {Number} timeout	超时时间
 * @returns {Promise}
 */
function jsonp(url, param, timeout) {
	if (void 0 === param && (param = {}), "string" != typeof url) {
		throw new Error('[Vue-jsonp] Type of param "url" is not string.');
	}
	if ("object" != typeof param || !param) {
		throw new Error("[Vue-jsonp] Invalid params, should be an object.");
	}
	timeout = "number" == typeof timeout ? timeout : 5e3;
	return new Promise((function(resolve, reject) {
		var u = "string" == typeof param.callbackQuery ? param.callbackQuery : "callback";
		var	i = "string" == typeof param.callbackName ? param.callbackName : "jsonp_" + (Math.floor(1e5 * Math.random()) * Date.now()).toString(16);
		param[u] = i;
		delete param.callbackQuery;
		delete param.callbackName;
		var s = [];
		Object.keys(param).forEach((function(t) {
			s = s.concat(e(t, param[t]))
		}));
		var l = t(s).join("&");
		var f = function() {
				p();
				clearTimeout(m);
				reject({
					status: 400,
					statusText: "Bad Request"
				});
			};
		var p = function() {
				b.removeEventListener("error", f);
			};
		var d = function() {
				document.body.removeChild(b), delete window[i];
			};
		var m = null;
		timeout > -1 && (m = setTimeout((function() {
			p(), d(), reject({
				statusText: "Request Timeout",
				status: 408
			})
		}), timeout));
		window[i] = function(e) {
			clearTimeout(m);
			p();
			d();
			resolve(e);
		};
		var b = document.createElement("script");
		b.addEventListener("error", f);
		b.src = url + (/\?/.test(url) ? "&" : "?") + l;
		document.body.appendChild(b);
	}))
}

export {
	n as VueJsonp, 
	jsonp
};
