<template>
	<view class="bjx-form-item" :style="{width: theWidth}">
		<view :class="'label-' + theLabelType" :style="{alignItems: theVerticalAlign}">
			<view class="item-label" :style="theLabelStyle">
				<view class="label-con">
					<slot name="label" >
						<text class="label-text">{{label}}</text>
						<text class="right" v-if="theLabelType=='block'&&labelRight">{{labelRight}}</text>
					</slot>
				</view>
				<!-- #ifdef MP -->
				<view class="mp-item-required " v-show="required">*</view>
				<!-- #endif -->
				
				<view class="item-required" v-show="thePromptType&&(thePromptType==2||theRequired)" :style="{color: theForm.msgColor,opacity:thePromptType&&theRequired?1:0}">
					{{theForm.prompt}}
				</view>
			</view>
			<view class="item-con">
				<slot />
			</view>
		</view>
		<scroll-view scroll-x='true' class="item-msg" v-if="theForm.msgType=='in'">
			<view :style="{color: theForm.msgColor}">{{msg}}</view>
		</scroll-view>
	</view>
</template>

<script>
	import {fromCheck} from './bjx-validate.js'
	export default {
		name: 'BjxFormItem',
		props: {
			// 字段名称
			label: String,
			// 表单字段
			prop: String,
			width: {
				type: String,
				default: 'auto'
			},
			labelWidth: {
				type: String,
				default: ''
			},
			// block 独占一行 inlie与内容共一行
			labelType: String,
			// label 文本水平对齐方式
			align: String,
			labelRight: {
				type: String,
				default: '' // 当labelType 为 block 时 label 右侧显示文字
			},
			required: {
				type: Boolean,
				default: false // 字段名左侧* 是否显示  默认由 校验规则 中的 required 控制
			},
			verticalAlign: {
				type: String,
				default: 'center' // label 文本垂直对齐方式
			},
			// 提示符占位，0:不显示，  1:非必要项不显示不占位  2:占位，用透明度控制显示隐藏使label文字对齐
			promptType:  Number,
			authCheck: {
				type: Boolean,
				default: null // 动态校验，即值一改变就对数据进行校验
			},
		},
		data() {
			return {
				formField: ['labelType', 'labelWidth', 'align', 'msgType','form','rules','msgColor','prompt','promptType','authCheck'],
				msg: ''
			}
		},
		watch: {
			value() { // 监听value 检查是否做动态校验
				if(this.authCheck||this.authCheck===null&& this.theForm.authCheck){
					this.validate()
				}
			}
		},
		computed: {
			theRequired() {
				if(this.required || this.theForm.rules && this.theForm.rules[this.prop] && this.theForm.rules[this.prop].required) {
					return true
				}
				return false
			},
			theForm() {
				let parent = this.$parent;
				let parentName = parent.$options.name;
				while (parentName !== null && parentName !== 'BjxForm') {
				  parent = parent ? parent.$parent : null;
				  parentName = parent ? parent.$options.name : null;
				}
				let theForm = {}
				if(parent) {
					this.formField.forEach(key => {
						theForm[key] = parent[key]
					})
				}	
				return theForm;
			},
			theWidth() {
				return !isNaN(Number(this.width)) ? this.width + 'rpx' : this.width
			},
			theLabelWidth(){
				let width = 'auto'
				if(!this.$slots.label) {
					width = this.labelWidth || this.theForm.labelWidth
					if(!isNaN(Number(width))) {
						width += 'rpx'
					}
				}
				return width
			},
			theLabelType() {
				let labelType = this.labelType || this.theForm.labelType
				return labelType
			},
			theLabelStyle() {
				let width = this.theLabelType!='block' ? this.theLabelWidth : 'auto'
				let aligns = {left: 'flex-start', right: 'flex-end', center: 'center',between: 'space-between'}
				let align = this.align || this.theForm.align
				return `width: ${width}; justify-content: ${aligns[align]}; vertical-align: ${this.verticalAlign};`
			},
			theVerticalAlign() {
				let type = {top: 'flex-start', bottom: 'flex-end', center: 'center'}
				return type[this.verticalAlign]
			},
			value() {
				let form = this.theForm.form
				let value =  form ? form[this.prop] : ''
				return value
			},
			thePromptType() {
					return this.promptType > -1 ? this.promptType :this.theForm.promptType
			}
		},
		methods: {
			// 规则校验
			validate() {
				if(!this.theForm.rules) return
				let rule = this.theForm.rules[this.prop]
				this.msg = ''
				if(rule) {
					if(rule.required && (this.value == null || this.value == '')) {
						// 是否必填
						this.msg = rule.msg || this.label + '不能为空'
					}else if(rule.validator) {
						// 自定义规则校验函数
						let bol = rule.validator(this.value,rule)
						if(typeof bol == 'string') {
							this.msg = bol
						}else if(!bol) {
							this.msg = rule.message || this.label + '不符合规则'
						}
					}else if(rule.rule && this.value != null && this.value != '') {
						// 默认校验规则
						let result = fromCheck(this.value, rule.rule, this.theForm.form)
						if(result !== true) {
							this.msg = this.label + result.msg
							if(rule.message) {
								if(typeof rule.message === 'string') {
									this.msg = typeof rule.message
								} else if(rule.message[result.rule]) {
									this.msg = rule.message[result.rule]
								}
							}
						}
					}
				}
				if(this.msg != '') {
					if(this.theForm.msgType == 'out') {
						// 弹框
						uni.showModal({ content: this.msg })
					}else if(this.theForm.msgType == 'msg'){
						// 消息框
						uni.showToast({
							icon: 'none',
							title: this.msg
						})
					}
				}
				return !this.msg
			}
		},
	}
</script>

<style  lang="scss" scoped>
	.bjx-form-item {
		padding: 8px 0 0;
		.label-block{
			.item-label {
				display:flex;
				margin-bottom: 2px;
				.label-con{
					flex:1;
				}
				.right {
					float: right;
				}
			}
		}
		.label-inline{
			display:flex;
			 align-items: flex-start;
			.item-label {
				display:flex;
				margin-right: 10upx;
			}
			.item-con {
				flex:1;
				color: #4D4D4D;
				text-align: right;
			}
		}
		.item-msg {
			padding:2px;margin-bottom: 5px;font-size: 15px;height: 22px;
			view{width: max-content;}
		}
	}
	.label-text{
		font-size: 16px;
		color: #4D4D4D;
	}
	.item-required{
		font-size:16px;
	}
		.mp-item-required{
			font-size:16px;
			color: #ff0000;
		}
</style>
