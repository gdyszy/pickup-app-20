import validate from './validate.js'
// 默认校验规则
const rules = {
	// 自定义规则
	...validate,
	// 数据类型
	type: function(val, param) {
		let msgObj = {'string': '字符串', 'boolean': '布尔值', 'objec': '对象'}
		if(param[0] == 'number') {
			if(val == '' || isNaN(Number(val))) {
				return '不是一个数字'
			}
		} else if(typeof val != param[0]){
			return msgObj[param[0]] ? '不是' + msgObj[param[0]] : '数据类型不符合'
		}
		return true
	},
	// 值 小于等于
	max: function(val, param) {
		let msg = this.type(val,['number'])
		if(msg !== true) {
			return msg
		}
		if(val > param[0]) {
			return '值不能超过' + param[0]
		}
		return true
	},
	// 值 大于等于
	min: function(val, param) {
		let msg = this.type(val,['number'])
		if(msg !== true) {
			return msg
		}
		if(val.length < param[0]) {
			return '值不能小于' + param[0]
		}
		return true
	},
	/*
	* 长度范围
	* 1. length:2   长度等于某值
	* 2. length:0,2 长度在某区间
	* 3. length:2,~ 长度不小于
	* 4. length:~,5 长度不大于
	*/
	length: function(val, param) {
		if(param.length > 1) {
			if(param[1].trim() == '~' && val.length < param[0]) {
				return '长度不能小于' + param[0]
			} else if (param[0].trim() == '~'  && val.length > param[1]){
				return '长度不能超过' + param[1]
			} else if(val.length < param[0] || val.length > param[1]) {
				return '长度应在' + param[0] + '~' + param[1] + '之间'
			}
		}else if(val.length != param[0]){
			return '长度应等于' + param[0]
		}
		return true
	},
	// 值的范围
	between: function(val, param) {
		if(param.length > 1) {
			if(Number(val) < Number(param[0]) || Number(val) > Number(param[1])) {
				return '应在' + param[0] + '~' + param[1] + '之间'
			}
		}else if(val != param[0]){
			return '应等于' + param[0]
		}
		return true
	},
	// 校验值在给定的值中
	in: function(val, param) {
		if(!param.includes(val)){
			return '应该在' + param.join() + '之中'
		}
		return true
	},
	// 校验值是否与某字段值相等
	eq: function(val, param, from) {
		if(from[param[0]] && val != from[param[0]]){
			return '与' + param[0] + '不相等'
		}
		return true
	},
	reg: function(val, param) {
		var reg = new RegExp(param);
		if (!reg.test(val)) {
			return '不符合正则'
		}
		return true
	},
	date: function(val) {
		if (new Date(val).getDate()!=val.substring(val.length-2)) {
			return '不是一个有效的日期'
		}
		return true
	},
}
// 字符串转数组
function getArr(val,str) {
	return val.split ? val.split(str) : val
}
// 表单默认规则校验 通过返回 true 不通过返回对象 {msg:'不通过原因','rule': '规则名'}
export const fromCheck = function(val, rule,form) {
	// 'type: string|length:5|in:1,3|between:0,5' 字符串形式
	// ['type: string','length:5','in:1,3'，'between:0,5'] // 数组、字符串混合
	// ['string',['length',5],['in',[1,3],['between', [0,5]]]] 最终形式
	rule = getArr(rule,'|')
	const len = rule.length;
	for (let i = 0; i < len; ++i ) {
		let key = '',param = ''
		if(rule[i].indexOf('reg') == 0){
			// 正则
			key = 'reg'
			param = rule[i].slice(rule[i].indexOf(':') + 1)
		}else{
			rule[i] = getArr(rule[i],':')
			key = rule[i][0].trim()
			param = rule[i][1] ? getArr(rule[i][1],',') : [];
		}
		if(!rules[key]) continue
		let msg = rules[key](val, param, form)
		if(msg !== true) {
			return {msg:msg,rule: key}
		}
	}
	return true
}