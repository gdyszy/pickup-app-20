<template>
	<view class="pages">
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage">
		</HMmessages>
		<view class="card-form">
			<uni-forms validateTrigger="bind" :value="submitData">
				<uni-forms-item label="卡号" required>
					<uni-easyinput placeholder="请输入卡号" v-model="submitData.numb" trim="both"></uni-easyinput>
				</uni-forms-item>
				<view class="uni-button-group">

					<button v-if="submitData.numb!=''&&submitData.pwd!=''" class="btn_OK"
						@click="submitmp()">立即验证</button>
					<button v-else class="btn_Not">立即验证</button>
				</view>
			</uni-forms>
		</view>
	</view>
</template>

<script>
	import HMmessages from "@/components/HM-messages/HM-messages.vue"
	export default {
		components: {
			HMmessages
		},
		data() {
			return {
				showBottom: true,
				imgUrl: "",
				submitData: {
					numb: "",
				},
				activityID: "",
				pwdActivityData: {},
				inputDisable: false,
				nowTime: null,
				pName: '',
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: "提货券验证"
			});
		},
		onReady() {
			this.HMmessages.show('输入卡号密码可查询卡状态', {
				icon: 'help',
				closeButton: true
			})
		},
		methods: {
			clickMessage(e) {

			},
			submitmp() {
				let _this = this
				this.commHttpRequest('query_user', 'queyCardRecovery', this.submitData, true, (res) => {
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
							case 2: case 8:
								uni.navigateTo({
									url: './detail?cardNumb=' + _this.submitData.numb
								});
								break;
							case 3:
								uni.showToast({
									title: '卡号已使用。',
									duration: 2500,
									icon: 'none'
								});
								break;
							case 4:
								_this.showToast(1);
								// console.log("已失效")
								break;
							case 5:
								uni.showToast({
									title: '卡号未激活，请联系客服。',
									duration: 2500,
									icon: 'none'
								});
								break;
							case 6:
								uni.showToast({
									title: '卡号待核销，请联系客服。',
									duration: 2500,
									icon: 'none'
								});
								break;
							case 7:
								uni.showToast({
									title: '卡号已核销，请联系客服。',
									duration: 2500,
									icon: 'none'
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
							title: '未找到相关提货券，如有疑问请联系管理员！',
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

	.card-form {
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

</style>
