<template>
	<view class="pages">

		<view class="card-form">
			<uni-forms validateTrigger="bind" :value="submitData">
				<uni-forms-item label="卡号" required>
					<uni-easyinput placeholder="请输入卡号" v-model="submitData.numb" trim="both"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="卡密" required>
					<uni-easyinput placeholder="请输入卡密" v-model="submitData.pwd" trim="both" type="number"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="验证码" required>
					<view class="flex-center">
						<view style="flex: 1;margin-right: 10px;">
							<input :disabled="inputDisable" class="uni-input" type="text" v-model="confirmCode"
								placeholder="请输入验证码" @focus="hidLogo" @blur="openLogo" />
						</view>
						<view class="border">
							<valid-code ref="code" :value.sync="validCode" @input="code" width="100px" height="40px">
							</valid-code>
						</view>
					</view>
				</uni-forms-item>
				<view class="uni-button-group">
				
					<button v-if="submitData.numb!=''&&submitData.pwd!=''&&confirmCode!=''" class="btn_OK"
						@click="submitmp()">确认提交</button>
					
					<button v-else class="btn_Not">确认提交</button>
				</view>
				
			</uni-forms>
		</view>
	</view>
</template>

<script>
	import validCode from "@/components/ValidCode/index"
	export default {
		components: {
			"valid-code": validCode
		},
		data() {
			return {
				current: 0,
				swiperDotIndex: 0,
				swiperData: [{
					"id": 1,
					"cid": 1,
					"name": "banner1",
					"bannerfile":{
						"url": "/static/banner1.png"
					}
					
				}],
				showimgUrl: false,
				showLogo: true,
				showBottom: true,
				imgUrl: "",
				submitData: {
					numb: "",
					pwd: ""
				},
				activityID: "",
				pwdActivityData: {},
				validCode: "",
				confirmCode: "",
				inputDisable: false,
				nowTime: null,
				pName: '',
				Logo: '',
				hiddenLogo: true
			}
		},

		mounted() {
			// #ifdef APP-PLUS||H5
			/* this.activityID = Number(this.$route.query.id)
			this.init() */
			// #endif
		},
		onLoad() {
			this.getProjectInfo()
			uni.setNavigationBarTitle({
			     title:"提货券登录"
			    });
		},
		methods: {
			navigateTo(url, clear) {
				// clear 表示刷新列表时是否清除页码，true 表示刷新并回到列表第 1 页，默认为 true
				uni.navigateTo({
					url,
					events: {
						refreshData: () => {
							this.getList()
						}
					}
				})
			},
			clickBannerItem(item){
				if(item.open_url==''||item.open_url==undefined){
						return false
					}
				let p = encodeURIComponent(item.open_url)
				uni.navigateTo({
					url: `/pages/webview/index?path=${p}`
				})	
			},
			changeSwiper(e) {
				this.current = e.detail.current
			},
			clickItem(e) {
				this.swiperDotIndex = e
			},
			init() {
				let _this = this
				this.nowTime = Math.round(new Date() / 1000)

				//this.activityID=Number(3)

				if (!isNaN(this.activityID)) {
					this.showimgUrl = true
					uniCloud.callFunction({
						name: 'query_user',
						data: {
							name: 'activityQueryUser',
							data: _this.activityID
						}
					}).then((res) => {
						if (res.result.data.length == 0) {
							_this.showToast(3) // 礼包不存在
						} else if (res.result.data[0].activityState == 2) {
							_this.showToast(6) //处于关闭状态
						} else {
							_this.imgUrl = res.result.data[0].activityImg
							_this.getActivityData = res.result.data[0]
							_this.checkTime()
						}
					})
				} else {
					_this.showToast(3) // 礼包不存在，携带参数错误
				}
			},
			openLogo() {
				this.showLogo = true;
			},
			hidLogo() {
				this.showLogo = false;
			},
			submit() {
				let _this = this
				this.nowTime = Math.round(new Date() / 1000)
				if (this.checkTime()) {
					if (!isNaN(this.activityID)) {
						// 验证码验证
						let flag = true;
						for (let i = 0; i < 4; i++) {
							if (this.confirmCode.charAt(i) === this.validCode.toLowerCase().charAt(i) ||
								this.confirmCode.charAt(i) === this.validCode.toUpperCase().charAt(i)) {
								continue;
							} else {
								flag = false;
								break;
							}
						}
						if (flag == true) {
							let id = (this.activityID).toString()
							this.submitData['activityID'] = id
							this.commHttpRequest('query_user', 'pwdActivityQueryUser', this.submitData, true, (res) => {
								if (res.result.data.length == 0) {
									_this.showToast(1) // 密码or账号错误
									_this.$refs.code.refreshCode()
									_this.confirmCode = ""
									_this.submitData.pwd = ""
								} else {
									switch (res.result.data[0].state) {
										case "1":
											_this.showToast(1);
											// console.log("未制卡")
											break;
										case "2":
											_this.pwdActivityData.numb = _this.submitData.numb
											_this.pwdActivityData.pwd = _this.submitData.pwd
											_this.pwdActivityData = Object.assign(_this.getActivityData)
											uni.setStorageSync('pwdActivityData', _this.pwdActivityData)
											uni.navigateTo({
												url: '../gift/gift'
											});

											break;
										case "3":
											uni.setStorage({
												key: 'storage_used_key',
												data: _this.setStorageData
											});
											uni.navigateTo({
												url: '../logistics/logistics?cardNumb=' + _this.submitData
													.numb
											});
											// console.log("已使用")

											break;
										case "4":
											_this.showToast(1);
											// console.log("已失效")
											break;
									}
								}
						})
	
						} else {
							this.showToast(2) // 验证码错误
							this.$refs.code.refreshCode()
							this.confirmCode = ""
							this.submitData.pwd = ""
						}
					} else {
						this.showToast(3) // 礼包信息不存在，携带参数错误 
					}
				}

			},
			submitmp() {
				let _this = this
				this.nowTime = Math.round(new Date() / 1000)
				// 验证码验证
				let flag = true;
				for (let i = 0; i < 4; i++) {
					if (this.confirmCode.charAt(i) === this.validCode.toLowerCase().charAt(i) ||
						this.confirmCode.charAt(i) === this.validCode.toUpperCase().charAt(i)) {
						continue;
					} else {
						flag = false;
						break;
					}
				}
				if (flag == true) {
					this.commHttpRequest('query_user', 'pwdActivityQueryUserMp', this.submitData, true, (res) => {
						if (res.result.data.length == 0) {
							_this.showToast(1) // 密码or账号错误
							_this.$refs.code.refreshCode()
							_this.confirmCode = ""
							_this.submitData.pwd = ""
						} else {
							let resData = res.result.data[0]
							switch (res.result.data[0].state) {
								case 1:
									_this.showToast(1);
									// console.log("未制卡")
									break;
								case 2:
									_this.pwdActivityData = resData.activityData
									_this.pwdActivityData.numb = _this.submitData.numb
									_this.pwdActivityData.pwd = _this.submitData.pwd
									_this.pwdActivityData.state = resData.state
									uni.setStorageSync('pwdActivityData', _this.pwdActivityData)
									uni.navigateTo({
										url: '../gift/gift'
									});

									break;
								case 3:
									uni.showToast({
										title: '该卡密已使用',
										duration: 2500,
										image: "/static/false.png"
									});
									/* uni.setStorage({
										key: 'storage_used_key',
										data: _this.setStorageData
									});
									uni.navigateTo({
										url: '../logistics/logistics?cardNumb=' + _this.submitData.numb
									}); */
									// console.log("已使用")

									break;
								case 4:
									_this.showToast(1);
									// console.log("已失效")
									break;
								case 5:
									uni.showToast({
										title: '卡号未激活，请联系客服',
										duration: 2500,
										image: "/static/false.png"
									});
									break;
							}
						}
					})

				} else {
					uni.hideLoading();
					this.showToast(2) // 验证码错误
					this.$refs.code.refreshCode()
					this.confirmCode = ""
					this.submitData.pwd = ""
				}

			},
			checkTime() {
				if (this.getActivityData.activityOpenTime > this.nowTime) {
					this.showToast(4) //活动未开始
					return false
				} else if (this.getActivityData.activityEndTime < this.nowTime) {
					this.showToast(5) //活动已结束
					this.$set(this.submitData, 'numb', '')
					this.$set(this.submitData, 'pwd', '')
					this.confirmCode = ""
					return false
				} else {
					return true
				}
			},
			// 获取验证码的值
			code(data) {
				this.validCode = data
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
					case 2:
						uni.showToast({
							title: '验证码错误!',
							duration: 2500,
							image: "/static/false.png"
						});
						break;
					case 3:
						uni.showToast({
							title: '礼包信息不存在！',
							duration: 2500,
							image: "/static/false.png"
						});
						this.inputDisable = true
						break;
					case 4:
						uni.showToast({
							title: '活动暂未开始！',
							duration: 2500,
							image: "/static/false.png"
						});
						this.inputDisable = true
						break;
					case 5:
						uni.showToast({
							title: '活动已结束！',
							duration: 2500,
							image: "/static/false.png"
						});
						this.inputDisable = true
						break;
					case 6:
						uni.showToast({
							title: '活动已关闭！',
							duration: 2500,
							image: "/static/false.png"
						});
						this.inputDisable = true
						break;
				}
			},
			getProjectInfo() {
				let emcode = uni.getStorageSync('emp_code')?uni.getStorageSync('emp_code'):this.$emp_code
				let params = {
				emp_code:emcode
				}
				this.commHttpRequest('query_user', 'getWebsite', params, false, (res) => {
					if (res.result.data[0]) {
						let projectInfo = res.result.data[0]
						this.swiperData = res.result.bannerData
						uni.setStorageSync('bannerData', this.swiperData)
						uni.setStorageSync('projectInfo', projectInfo)
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

	.banner-image {
		width: 100%;
		height: 400rpx;
	}

	.swiper-box {
		height: 400rpx;
	}

	.card-form {
		margin-top: 50rpx;
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
	.check {
		margin-top: 100rpx;
	  display: flex;
	  justify-content: space-around;
	  width: 100%;
	  height: 200rpx;
	  font-size: 20px;
	  .checkItem1{
	  	width:30%;
	  	border-radius: 5px;
	  	padding: 20px 0;
	  	cursor: pointer;
	  	display: flex;
		text-align: center;
	  	flex-direction: column;
	  	justify-content: center;
	  	color: #fff;
	      background-color: #f09f3a;
	  }
	  .checkItem2{
	  	width: 30%;
	  	border-radius: 5px;
	  	padding: 20px 0;
	  	cursor: pointer;
	  	display: flex;
		text-align: center;
	  	flex-direction: column;
	  	justify-content: center;
	  	color: #fff;
	      background-color: #e27364;
	  }.checkItem3{
	  	width: 30%;
	  	border-radius: 5px;
	  	padding: 20px 0;
	  	cursor: pointer;
	  	display: flex;
		text-align: center;
	  	flex-direction: column;
	  	justify-content: center;
	  	color: #fff;
	       background-color: #8fbf7e;
	  }
	}
</style>
