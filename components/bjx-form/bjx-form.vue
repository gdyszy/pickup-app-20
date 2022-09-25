<template>
	<view>
		<form :report-submit="reportSubmit"  @submit="formSubmit" @reset="formReset">
			<slot />
		</form>	
	</view>
</template>

<script>
	export default {
		name: 'BjxForm',
		props: {
			form: {
				type: Object,
				default: function (){
					return {}
				}
			},
			rules: {
				type: Object,
				default: function (){
					return {}
				}
			},
			// 提示模式 1. out 弹框提提示 2.in item 页面内 item 文字提示 3 msg 消息框提示
			msgType: {
				type: String,
				default: 'out'
			},
			// block 独占一行 inlie与内容共一行
			labelType: {
				type: String,
				default: 'block'
			},
			labelWidth: {
				type: String,
				default: 'auto'
			},
			align: {
				type: String,
				default: 'left'
			},
			reportSubmit: {
				type: Boolean,
				default: false
			},
			submit: Function,
			reset: Function,
			msgColor: {
				type: String,
				default: '#F56C6C' // 提示符、提示文本字体颜色
			},
			prompt: {
				type: String,
				default: '*' // 提示符
			},
			promptType: {
				type: Number,
				default: 1 // 提示符占位，0:不显示，  1:非必要项不显示不占位  2:占位，用透明度控制显示隐藏使label文字对齐
			},
			authCheck: {
				type: Boolean,
				default: false // 动态校验，即值一改变就对数据进行校验
			},
		},
		methods: {
			formSubmit(e) {
				this.$emit('submit',e)
			},
			formReset(e) {
				this.$emit('reset',e)
			},
			// 规则校验 
			validate(callback) {
				let vb = true
				let item = this.getItem(this.$children)
				for(let i = 0; i < item.length; ++i) {
					// 对表单下的子组件 form-item 做数据校验
					let bol = item[i].validate ? item[i].validate() : true
					if(vb && !bol) {
						vb = false
					}
					if(this.msgType != 'in' && !bol) {
						break
					}
				}
				callback && callback(vb)
			},
			// 递归遍历子元素 筛选 form-item
			getItem(children,item) {
				item = item || []
				children.forEach(it => {
					if(it.$options.name && it.$options.name === 'BjxFormItem' ||
					it.$options._componentTag && it.$options._componentTag === 'bjx-form-item'){
						item.push(it)
					} else if(it.$children.length){
						item = this.getItem(it.$children,item)
					}
				})
				return item
			}
		},
	}
</script>

<style  lang="scss">
</style>
