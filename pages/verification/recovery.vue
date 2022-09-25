<template>
	<view class="pages">
		<view class="card-form">
			<uni-forms validateTrigger="bind" :value="submitData">
				<uni-forms-item  label="卡号" required :labelWidth="100">
					<uni-easyinput placeholder="请输入卡号" v-model="submitData.numb" trim="both"></uni-easyinput>
				</uni-forms-item>
				
				<uni-forms-item  label="联系电话" required :labelWidth="100">
					<uni-easyinput placeholder="请输入联系电话" v-model="submitData.ali_number" trim="both"></uni-easyinput>
				</uni-forms-item>
				<view class="uni-button-group">
				<HMmessages ref="HMmessages"  @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
				<button v-if="submitData.numb!=''&&submitData.ali_number!=''" class="btn_OK" @click="submitmp()">提交</button>
				<button v-else class="btn_Not" >提交</button>
				</view>
			</uni-forms>
		</view>
		<view class="contennt_title">
			<view class="logistics-info" v-if="telMobile">
				<view class="logistics-description">联系客服：</view>
				<view class="logistics-cont" @click="onClickwx(telMobile)"> {{telMobile}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import HMmessages from "@/components/HM-messages/HM-messages.vue"
	export default {
		 components: {HMmessages},
		data() {
			return {
				telMobile:'',
				showBottom: true,
				imgUrl: "",
				submitData: {
					numb: "",
					ali_number:""
				}
			}
		},
		onLoad(option) {
			// #ifdef MP||APP
			uni.setNavigationBarTitle({
			     title:"回收礼品卡"
			    });
			// #endif
			
				if(option.numb!=''){
					this.submitData.numb = option.numb?option.numb:""
				}
				this.telMobile = uni.getStorageSync('projectInfo').telMobile
		},
		methods: {
			onClickwx(num) {
				// #ifdef MP
				wx.makePhoneCall({
					phoneNumber: num,
				})
				// #endif
				// #ifdef APP-PLUS||H5
				uni.makePhoneCall({
					phoneNumber:num
				})
				// #endif
			},
			clickMessage(e){
				
			},
			submitmp() {
				let _this = this
					this.commHttpRequest('query_user','queyCardRecovery', this.submitData, true, (res) => {
						if(res.data.updated==1){
							_this.HMmessages.show('已提交，请耐心等待客服核销。',{icon:'help',closeButton:true})
						}else{
							_this.HMmessages.show(res.data.msg,{icon:'help',closeButton:true})
						}
					})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pages {
		background-color: #FFFFFF;
	}

	.main {
		justify-content: space-between;
	}

	.title {
		width: 480rpx;
		font-size: 32rpx;
	}

	.info {
		flex-direction: row;
		justify-content: space-between;
	}

	.card-form{
	margin-top: 120rpx;
}
	.uni-nav-bar-text {
		font-size: 12px;
	}
	
	.flex-center {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.border {
		border: 1px solid #D9DDE5;
		margin-right: 10px;
		background: #D9DDE5;
	}
	.uni-forms-item__label{
		width: 200px;
	}
	.contennt_title{
	padding: 20px;
	margin-top: 100rpx;
	line-height: 50rpx;
	border-top: 1px solid #afafaf;
	font-size: 20px;
	}
	.logistics-info {
		display: flex;
		margin-top: 10px;
		align-items: center;
		}
</style>
