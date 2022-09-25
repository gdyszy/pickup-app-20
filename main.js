import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.$webUrl = 'https://thk.yszyun.com'
Vue.prototype.$emp_code = '' //用户编号
Vue.prototype.$extInfoUrl = '' //在线客服链接
Vue.prototype.$corpId = '' //在线客服的企业ID
Vue.prototype.$showChat = true //是否展示在线客服
Vue.prototype.$cloudFunctionUrl = 'https://82809ea8-bc7d-40a4-808a-a22d30c9fdcd.bspapp.com/' 

Vue.prototype.commHttpRequest = function(actionurl,eventName, params, loading = true, callback) {
	if (loading == true) {
		uni.showLoading({
			mask: true
		})
	}
	let url = this.$cloudFunctionUrl +actionurl
	params['eventName']=eventName
		uni.request({
			url: url,
			method: 'POST',
			data: params,
			success: res => {
				uni.hideLoading()
				if(res.data){
					res.result = res.data
					callback(res);
				}
			},
			fail: (err) => {
				uni.hideLoading()
				uni.showToast({
					title: err,
					icon: 'none'
				});
			}
		});

}
//统一提示
Vue.prototype.show_nativeUI_toast = function(msg, icontype = 'success'){
	const iconTypeUrl = {
	    error: '/static/toast-image/warn.png',
	    success: '/static/toast-image/success.png',
	    warn: '/static/toast-image/warn.png'
	}
	uni.showToast({
	    title: msg,
		image: iconTypeUrl[icontype],
		duration:1500
	})
}
Date.prototype.Format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k])
				.length)));
	return fmt;
};

const app = new Vue({
	...App
})
app.$mount()
