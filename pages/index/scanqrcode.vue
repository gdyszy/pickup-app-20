<template>
	<view >
		<view class="content">
		<view class="logistics-content">
			<view class="logistics-info">
				<view class="logistics-description">卡号：</view>
				<view class="logistics-cont"> {{formData.numb }}</view>
			</view>
			<view class="logistics-info">
				<view class="logistics-description">卡券状态：</view>
				<view class="logistics-cont"> {{local_state(formData.state)}}</view>
			</view>
			<view class="logistics-info">
				<view class="logistics-description">卡券开通时间：</view>
				<view class="logistics-cont"> {{formData.addtime | filterTime}}</view>
			</view>
			<view class="logistics-info">
				<view class="logistics-description">卡券有效期：</view>
				<view class="logistics-cont"> {{formData.activityList.activityEndTime | filterTime}}</view>
			</view>
			<view class="logistics-info">
				<view class="logistics-description">活动名称：</view>
				<view class="logistics-cont">{{formData.activityList?formData.activityList.activityTitle:''}}</view>
			</view>
			<view class="logistics-info">
				<view class="logistics-description">密码：</view>
				<view class="showpwd"  v-if="showcard">
				<scrapingCard :resultList="resultList" ref="reset" @complete="seatShow"/>
				<view class="tctip" >{{formData.isScratch==2?'此卡':formData.state==2?'刮开涂层':'此卡'}}<view class="tctip1">{{formData.isScratch==2?'已刮开':formData.state==2?'获取密码':local_state(formData.state)}}</view></view>
	 </view>
			</view>
			
			<view class="logistics-info" v-if="telMobile">
				<view class="logistics-description">联系客服：</view>
				<view class="logistics-cont" @click="onClickwx(telMobile)"> {{telMobile}}</view>
			</view>
		</view>
		<view class="btn">
			<view class="btn1">
				<button class="btn-Select-n" v-if="formData.state==2" @click="returnIndex(formData.numb)">我要提货</button>
			</view>
			<view class="btn2">
				<button class="btn-Select" v-if="formData.state==2" @click="copyLink(formData.numb)">转增亲友</button>
			</view>
		</view>
		<view class="btn3">
			<button class="btn-Select-n" v-if="formData.state==3" @click="getlogistics(formData.numb)">查看订单</button>
		</view>
		<view v-if="shownocard" class="shownocard">卡号错误，请联系客服</view>
		<view class="qcode" v-if="showqcode">
			 <u-qrcode ref="qrcode" size="180" canvas-id="qrcode" :value="codeValue"></u-qrcode>
		</view>
			
		<!-- #ifdef MP-WEIXIN -->
		<sa-hover-menu></sa-hover-menu>
		<!-- #endif -->
</view>
	<view class="contennt_title">
		提货须知：
	</view>
	 <view class="contennt" v-html="intro"></view>
	</view>
</template>

<script>
	export default {
		data() {
			let formData = {
				"accept": "",
				"acceptTel": "",
				"province": "",
				"address": "",
				"leave": "",
				"orderID": "",
				"activityID": "",
				"activityImg": "",
				"activityTitle": "",
				"cardNumb": "",
				"gdsTitle": "",
				"selectGdsIdList": [],
				"emsFirm": "",
				"emsNumb": "",
				"state": 0,
				"emsCode": "",
				"activityList": {
					"activityGds": {},
					"activityEndTime": ''
				}
				
			}
			return {
				codeValue:'11',
				showqcode:true,
				shownocard:false,
				showcard:true,
				resultList: {},
				gdsList: [],
				setStorageData: {},
				formData,
				chanceShow: false,
				emp_code:'',
				scode:'',
				intro:'',
				telMobile:'',
				percentage:60,
				touchSize:60,
			}
		},
		mounted() {
			// #ifdef APP-PLUS||H5
			/* this.activityID = Number(this.$route.query.id)
			this.init() */
			if(this.$route.query.emp_code==''||this.$route.query.emp_code== undefined){
				uni.removeStorageSync("emp_code")
			}else{
				this.emp_code =this.$route.query.emp_code
				uni.setStorageSync("emp_code",this.$route.query.emp_code)
			}
			// #endif
		},
		onLoad(option) {
			// #ifdef MP||APP
			uni.setNavigationBarTitle({
				title: "提货券详情"
			});
			// #endif
			if (option.scode != '') {
				this.getVerification(option.scode)
				this.scode =option.scode
				setTimeout(() => {
					this.getcodeValue();
				}, 1000)
			}
			setTimeout(() => {
				this.getProjectInfo()
			}, 1000);
			this.intro =uni.getStorageSync('projectInfo').intro
			
		},
		filters: {
			filterTime(type) {
				if (type) {
					return new Date(type).Format('yyyy-MM-dd')
				}
			}

		},
		methods: {
			local_state(index) {
				if (index == 1) {
					return '未制卡'
				} else if (index == 2) {
					return '未使用'
				} else if (index == 3) {
					return '已使用'
				} else if (index == 4) {
					return '已失效'
				} else if (index == 5) {
					return '未激活'
				} else if (index == 8) {
					return '提货中'
				}
			},
			reset : function(){
				this.$refs.card.init();
			},
			seatShow:function(){
				let param ={
					numb:this.formData.numb
				}
				this.commHttpRequest('query_user', 'updateScratch', param, true, (res) => {
					console.log("res:"+JSON.stringify(res))
				uni.showToast({
					title: '成功',
					icon : 'success'
				});
			})
			},
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
			getcodeValue(){
				this.codeValue = this.$webUrl + '/#/pages/index/scanqrcode?scode='+this.scode+'&emp_code='+this.emp_code
			},
			copyLink(){
				uni.setClipboardData({
					data: this.codeValue,
					success: () => {
						uni.showToast({
							title: '链接已复制成功'
						})
					}
				})
			},
			getVerification(scode) {
				var _this = this
				let param = {
					cardNumb: scode
				}
				this.commHttpRequest('query_user', 'queyScanQrcode', param, true, (res) => {
					if(res.result.data==null||res.result.data==undefined||res.result.data==''){
						this.showqcode =false
						this.showcard =false
						this.shownocard=true
						return false
					}
						this.formData = res.result.data[0]
						let gdsTitles = ''
						_this.resultList = _this.formData
						if (this.formData.activityList.activityGds) {
							//this.getGdlist(this.formData.activityList)
						}

				})
				
			},
			getGdlist(pwdActivityData) {
				let _this = this
				let goodsID = []
				const resWidth = uni.getSystemInfoSync();
				for (let i in pwdActivityData.activityGds) {
					goodsID.push(pwdActivityData.activityGds[i]._id)
				}
				let params = {
					gdsQueryValue: goodsID
				}
				this.commHttpRequest('query_user', 'gdsQueryUser', params, true, (res) => {
					if (res.result.data) {
						let gdArr = {}
						let gdsData = res.result.data
						/* 			for (let i = 0; i < gdsData.length; i++) {
									//截取标题长度
									if(gdsData[i].title.length>=13){
										let Strlen = 13
										if(resWidth.screenWidth>350){
											Strlen = 18
										}
										gdsData[i].title= gdsData[i].title.substring(0, Strlen)+'⋯'
									} 
									} */
						_this.gdsList = gdsData
					}
				})


			},
			goRecovery(numb) {
				let url = './recovery?numb=' + numb
				uni.navigateTo({
					url,
					events: {
						refreshData: () => {
							this.getList()
						}
					}
				})
			},
			returnIndex(numb) {
				let url = '../index/index?numb=' + numb+'&emp_code='+this.emp_code
				uni.reLaunch({
					url: url
				})
			},
			getlogistics(numb){
				console.log("numb:"+numb)
			uni.navigateTo({
				url: '../logistics/logistics?cardNumb=' + numb
			});	
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
						this.intro =uni.getStorageSync('projectInfo').intro
						this.telMobile = uni.getStorageSync('projectInfo').telMobile
						
					}
				})
			}
			
			

		}
	}
</script>

<style lang="scss">
	.content {
		padding: 20rpx 20rpx;
		z-index: 10;

		&_card {
			margin-top: 10%;
			width: 75%;
			background-color: #FFFFFF;
			border: 1px solid #FFFFFF;
			border-radius: 8px;
			padding: 14px 10px;
			z-index: 10;
			display: flex;
			flex-direction: column;

			&_head {
				display: flex;
				justify-content: center;
				align-items: center;
				border-bottom: 1px solid #ccc;
				padding: 8px 10px;
			}

			&_body {
				text-align: center;
				font-size: 13px;
				color: #252630;
				height: 240px;
				overflow: scroll;
			}
		}
	}

	.box {
		display: flex;
		padding: 4px;
		position: relative;
		transform-style: preserve-3d;

		&_info {
			flex: 5;
			text-align: left;
			margin-left: 13px;
		}

		&_time {
			display: flex;
			flex-direction: column;
			flex: 2;

			.time {
				color: #3C3E4D;
				font-weight: bold;
				font-size: 15px;
				background-color: #fff;
				text-align: left;
			}

			.date {
				color: #787B99;
				font-size: 10px;
				text-align: left;
				background-color: #fff;
			}
		}
	}

	.box::after {
		content: "";
		width: 1px;
		height: 50px;
		background-color: #C4c4c4;
		position: absolute;
		bottom: -15px;
		left: 24px;
		transform: translateZ(-1px);
		// z-index: -1;
	}

	.item:last-child {
		.box::after {
			content: "awsl";
			content: "";
			width: 0px;
			height: 0px;
		}
	}

	.btn-Select {
		margin-top: 20px;
		border-radius: 10rpx;
		background: #72593c;
		color: #FFFFFF;
	}

	.btn-Select-n {
		margin-top: 20px;
		border-radius: 10rpx;
		background: #c79a68;
		color: #FFFFFF;
	}

	.btn {
		width: 100%;
		display: flex;
	}

	.btn1 {
		margin-left: 15%;
		margin-right: 10%;
	}
.btn3{
	margin-left: 8%;
	text-align: center;
	justify-content: center;
	align-items: center;
	width: 80%;
}
	.logistics-content {
		padding: 0 15px;

		.tit {
			font-weight: 600;
			font-size: 20px;
			margin-top: 20px;
		}

		.logistics-info {
			display: flex;
			margin-top: 10px;
			align-items: center;

			.logistics-description {
				width: 120px;
				color: #8f9999;
			}

			.edit-txt {
				color: rgb(52, 113, 209);
				cursor: pointer;
				margin-left: 10px;
			}
		}
	}

	.gdslist {
		margin-top: 10px;
		margin-bottom: 20px;
		border: 1px solid #fffae8;
		border-radius: 10rpx;
		background: #f0f8f1;
		color: #000000;
	}

	.gds-info {
		margin: 10rpx;
	}

	button {
		line-height:100rpx;
		position: relative;
		display: block;
		margin-left: auto;
		margin-right: auto;
		padding-left: 14px;
		padding-right: 14px;
		box-sizing: border-box;
		font-size: 18px;
		text-align: center;
		text-decoration: none;
		border-radius: 4px;
		-webkit-tap-highlight-color: transparent;
		overflow: hidden;
		color: #000;
		background-color: #f8f8f8;
		cursor: pointer;
	}
	.qcode{
		margin: 20px;
		margin-left: 25%;
		width: 100%;
		text-align: center;
		justify-content: center;
		align-items: center;
	}
	.tctip{
		margin-left: 10px;
		font-size: 16px;
		color: #C4c4c4;
	}
	.tctip1{
		font-size: 16px;
		color: #C4c4c4;
	}
	.showpwd{
		display: flex;
	}
	.nocard{
		padding: 0rpx 20rpx 10rpx 20rpx;
		line-height: 100rpx;
		border: 1px solid #afafaf;
		border-radius: 8px;
		color: #fe082d;
	}
	.shownocard{
		margin-top: 20rpx;
		text-align: center;
		width: 100%;
		text-align: center;
		justify-content: center;
		align-items: center;
		font-size: 24px;
		color: #fc0936;
	}
	.contennt{
		padding: 20px;
		margin-bottom:80px;
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
