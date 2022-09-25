<template>
	<view class="pages">
		<HMmessages ref="HMmessages"  @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
		<view class="card-form">
			<uni-forms validateTrigger="bind" :value="submitData">
				<uni-forms-item  label="卡号" required>
					<uni-easyinput placeholder="请输入卡号" v-model="submitData.numb" trim="both"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item  label="卡密" required>
					<uni-easyinput placeholder="请输入卡密" v-model="submitData.pwd" trim="both" type="number"></uni-easyinput>
				</uni-forms-item>
				<view class="uni-button-group">
				
				<button v-if="submitData.numb!=''&&submitData.pwd!=''" class="btn_OK" @click="submitmp()">立即查询</button>
				<button v-else class="btn_Not" >立即查询</button>
				</view>
			</uni-forms>
		</view>
		<view class="contennt_title">
			订单查询须知：
		</view>
		 <view class="contennt" v-html="cxintro"></view>
	</view>
</template>

<script>
	import HMmessages from "@/components/HM-messages/HM-messages.vue"
	export default {
		 components: {HMmessages},
		data() {
			return {
				showBottom: true,
				imgUrl: "",
				submitData: {
					numb: "",
					pwd: ""
				},
				activityID: "",
				pwdActivityData: {},
				inputDisable: false,
				nowTime: null,
				pName: '',
				cxintro:''
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
			     title:"订单查询"
			    });
				this.cxintro =uni.getStorageSync('projectInfo').cxintro
		},
		onReady() {
			this.HMmessages.show('输入卡号密码可查询订单和快递信息',{icon:'help',closeButton:true})
		},
		methods: {
			clickMessage(e){
				
			},
			submitmp() {
				let _this = this
					this.commHttpRequest('query_user','pwdActivityQueryUserMp', this.submitData, true, (res) => {
						if (res.result.data.length == 0) {
							_this.showToast(1) // 密码or账号错误
							return 
						} else {
							let resData = res.result.data[0]
							switch (res.result.data[0].state) {
								case 1:
									_this.showToast(1);
									// console.log("未制卡")
									break;
								case 2:
								uni.showToast({
									title: '未查询到相关信息。',
									duration: 2500,
									icon:'none'
								});
								break;
								case 3: case 8:
									uni.setStorage({
										key: 'storage_used_key',
										data: _this.setStorageData
									});
									uni.navigateTo({
										url: '../logistics/logistics?cardNumb=' + _this.submitData.numb
									});
									// console.log("已使用")

									break;
								case 4:
									_this.showToast(1);
									// console.log("已失效")
									break;
								case 5:
									uni.showToast({
										title: '卡号未激活，请联系客服。',
										duration: 2500,
										icon:'none'
									});
									break;
							}
						}
					})

				

			},

			showToast(stateNumb) {
				switch (stateNumb) {
					case 1:
						uni.showToast({
							title: '卡号或密码错误！',
							duration: 2500,
							image: "/static/false.png"
						});
						break;
				}
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

	.contennt{
		padding: 20px;
		margin-bottom:50px;
		line-height:30px;
	}
	.contennt_title{
		padding: 20px;
	margin-top: 20px;
	padding-bottom: 20px;
	line-height: 50rpx;
	border-bottom: 1px solid #afafaf;
	font-size: 20px;
	}
</style>
