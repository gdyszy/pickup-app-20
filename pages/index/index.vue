<template>
	<view class="pages">

		<!-- 当无banner数据时显示占位图 -->
		<image v-if="!(swiperData.length)" class="banner-image" src="/static/empty.png" mode="aspectFill"
			:draggable="false" />
		<uni-swiper-dot v-else class="swiperBox" @clickItem="clickItem" :info="swiperData" :current="current"
			field="content">
			<swiper class="swiper-box" @change="changeSwiper" :current="swiperDotIndex" :indicator-dots="false"
				:autoplay="true" :interval="5000" :duration="500">
				<swiper-item v-for="(item, index) in swiperData" :key="item._id">
					<view class="swiper-item" @click="clickBannerItem(item)">
						<image class="banner-image" :src="item.bannerfile.url?item.bannerfile.url:item.url"
							mode="aspectFill" :draggable="false" />
					</view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
		<view class="card-form">
			<uni-forms validateTrigger="bind" :value="submitData">
				<uni-forms-item label="卡号" required>
					<uni-easyinput placeholder="请输入卡号" v-model="submitData.numb" trim="both"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="卡密" required>
					<uni-easyinput placeholder="请输入卡密" v-model="submitData.pwd" trim="both" type="number">
					</uni-easyinput>
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
						@click="submitmp()">立即预约</button>

					<button v-else class="btn_Not">立即预约</button>
				</view>
				<view class="check">
					<!--  <view class="checkItem1" @click="navigateTo('./login')">
				    <text class="">兑换登录</text>
				  </view> -->
					<view class="checkItem2" @click="navigateTo('../verification/index')">
						<text class="">真伪验证</text>
					</view>
					<view class="checkItem3" @click="navigateTo('../progress/index')">
						<text class="">发货查询</text>
					</view>
				</view>
				
				<view  class="list-text"><text>版本号   {{version}}</text></view>
			</uni-forms>
			<view class="contennt_title">
				提货须知：
			</view>
			 <view class="contennt" v-html="intro"></view>
		</view>
	</view>
</template>

<script>
	import {
		version
	} from '@/package.json'
	import validCode from "@/components/ValidCode/index"
	export default {
		components: {
			"valid-code": validCode
		},
		data() {
			return {
				version:version,
				current: 0,
				swiperDotIndex: 0,
				swiperData: [{
					"id": 1,
					"cid": 1,
					"name": "banner1",
					"bannerfile": {
						"url": "/static/empty.png"
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
				hiddenLogo: true,
				intro:'',
			}
		},

		mounted() {
			// #ifdef APP-PLUS||H5
			/* this.activityID = Number(this.$route.query.id)
			this.init() */
			if(this.$route.query.emp_code==''||this.$route.query.emp_code== undefined){
				uni.removeStorageSync("emp_code")
			}else{
				uni.setStorageSync("emp_code",this.$route.query.emp_code)
			}
			// #endif
		},
		onLoad(option) {
			if(option.numb!=''){
				this.submitData.numb = option.numb
			}
			uni.removeStorageSync('orderDetail')
			uni.removeStorageSync('storage_choose')
			uni.removeStorageSync('pwdActivityData')
			setTimeout(() => {
				this.getProjectInfo()
			}, 1000);
			this.intro =uni.getStorageSync('projectInfo').intro
			
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
			clickBannerItem(item) {
				if (item.open_url == '' || item.open_url == undefined) {
					return false
				}
				let p = encodeURIComponent(item.open_url)
				uni.navigateTo({
					url: `/pages/tihk/webview/index?path=${p}`
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
								case 2: case 8:
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
					if(res.result.data==undefined||res.result.data==''){
						return false
					}
					if (res.result.data[0]) {
						let projectInfo = res.result.data[0]
						this.swiperData = res.result.bannerData
						uni.setStorageSync('bannerData', this.swiperData)
						uni.setStorageSync('projectInfo', projectInfo)
						this.intro =uni.getStorageSync('projectInfo').intro
						if(projectInfo.pName!=''){
							uni.setNavigationBarTitle({
							    title: projectInfo.pName
							});
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pages {
		background-color: #FFFFFF;
		height: 100%;
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
		border-radius: 4px;
		border: 1px solid #D9DDE5;
		margin-right: 10px;
		background: #D9DDE5;
	}

	.check {
		margin-top: 60rpx;
		display: flex;
		justify-content: space-around;
		width: 100%;
		height: 100rpx;
		font-size: 18px;

		.checkItem1 {
			width: 30%;
			border-radius:4px;
			padding: 20px 0;
			cursor: pointer;
			display: flex;
			text-align: center;
			flex-direction: column;
			justify-content: center;
			color: #fff;
			background-color: #f09f3a;
		}

		.checkItem2 {
			width: 30%;
			border-radius: 4px;
			padding: 20px 0;
			cursor: pointer;
			display: flex;
			text-align: center;
			flex-direction: column;
			justify-content: center;
			color: #fff;
			background-color: #b99265;
		}

		.checkItem3 {
			width: 30%;
			border-radius: 4px;
			padding: 20px 0;
			cursor: pointer;
			display: flex;
			text-align: center;
			flex-direction: column;
			justify-content: center;
			color: #fff;
			background-color: #72593c;
		}
	}

	.list-text {
		margin-top: 10px;
		height: 90rpx;
		line-height: 90rpx;
		color: #555;
		flex: 1;
		text-align: center;
		align-items: center;
	}
	.contennt{
		padding: 20px;
		margin-bottom:50px;
		line-height:30px;
	}
	.contennt_title{
		padding: 20px;
	padding-bottom: 20px;
	line-height: 50rpx;
	border-bottom: 1px solid #afafaf;
	font-size: 20px;
	}
</style>
