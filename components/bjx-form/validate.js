// 规则扩展
// 定义的函数 传入三个参数 第一个 val 未校验值 第二个 param 是校验参数  第三个 form 是表单数据
// @return Boolean | String  函数返回ture 则为校验通过 返回false 或者 String 都视为校验不通过
// 返回的字符串优先做为提示文字  提示文字的优先级 自定义函数msg > 规则中定义的message > 默认提示
 export default {
	// 手机号码校验
	phone: function(val) {
		if(val && !(/^1[3|4|5|6|7|8][0-9]\d{8,8}$/.test(val))){
			return '请填写正确的手机号码'
		}
		return true
	}
}
