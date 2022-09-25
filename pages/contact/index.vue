<template>
	<view>
		<view class="center-list">
		<!-- <view class="center-list-item border-bottom" @click="feedback()">
			<image class="slot-image2" src="/static/ico_opinion@3x.png" mode="widthFix"></image>
			<text class="list-text">意见反馈</text>
		</view> -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="center-list-item border-bottom" @click="onClickwxkf()">
			<image class="slot-image2" src="/static/wechatfriend.png" mode="widthFix"></image>
			<text class="list-text">在线客服</text>
		</view>
		<!-- #endif -->
		<view class="center-list-item border-bottom" @click="onClickwx(data.telMobile)">
			<image class="slot-image2" src="/static/btn_phone_@3x.png" mode="widthFix"></image>
			<text class="list-text">联系电话   {{data.telMobile}}</text> 
		</view>
		<view class="center-list-item border-bottom">
			<image class="slot-image2" src="/static/ico_update_log@3x.png" mode="widthFix"></image>
			<text class="list-text">版本号   {{data.version}}</text>
		</view>
		</view>
	</view>
</template>


<script>
	import {
		version
	} from '@/package.json'
	export default {
		data() {
			return {
				data:{
						telMobile:'',
						version:version
					}
			}
		},
		onLoad() {
			this.getProjectInfo()
		},
		methods: {
			getProjectInfo() {
				let emcode = uni.getStorageSync('emp_code')?uni.getStorageSync('emp_code'):this.$emp_code
				let params = {
				emp_code:emcode
				}
				this.commHttpRequest('query_user','getWebsite', params, false, (res) => {
					if(res.result.data[0]){
						let projectInfo = res.result.data[0]
						this.data.telMobile= projectInfo.telMobile
					uni.setStorageSync('projectInfo', projectInfo)	
					}
				})
			},
			onClickwxkf(){
				let extInfoUrl = uni.getStorageSync('projectInfo')?uni.getStorageSync('projectInfo').extInfoUrl:''
				let corpId = uni.getStorageSync('projectInfo')?uni.getStorageSync('projectInfo').corpId:''
				if(extInfoUrl==''||extInfoUrl== undefined||corpId==''||corpId== undefined){
					uni.showToast({
						title:'未配置在线客服，请电话联系',
						icon:'none',
						duration:2000
					})
					return false;
				}
				wx.openCustomerServiceChat({
				  extInfo: {url: extInfoUrl},
				  corpId: corpId,
				  success(res) {
				  }
				})
			},
			onClick(num) {
				// plus.device.dial(num,false) 
				
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
			feedback() {
				uni.navigateTo({
					url: '/pages/opendb-feedback/opendb-feedback',
					events: {}
				})
			}
		}
	}
</script>

<style>
	.ulist {
		margin-top: 8px;
		padding-left: 26rpx;
		padding-right: 26rpx;
		padding-bottom: 13.5px;
	}

	.re-uni-list-item__content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: column;
		justify-content: space-between;
		overflow: hidden;

	}

	.re-uni-list-item__content-note {
		margin-top: 6rpx;
		margin-bottom: 6rpx;
		color: #999999;
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 13px;
		line-height: normal;
		letter-spacing: 0px;
		text-align: left;
	}

	.re-uni-list-item__content-title {
		color: #333333;
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 15px;
		line-height: normal;
		letter-spacing: 0px;
		text-align: left;
	}

	.uni-list-item__container {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		/* flex-direction: row;
		padding: $list-item-pd;
		padding-left: $uni-spacing-row-lg;
		flex: 1;
		overflow: hidden;
		// align-items: center; */
	}

	.slot-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}
	.list-text {
		height: 90rpx;
		line-height: 90rpx;
		color: #555;
		flex: 1;
		text-align: left;
	}
	.slot-image {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		margin-right: 0;
		width: 20px;
		height: 20px;
		margin-top: 26rpx;
	}
	
	.slot-text {
		flex: 1;
		font-size: 14px;
		color: #4cd964;
		margin-right: 10px;
	}
	.center-list {
		background-color: #FFFFFF;
		width: 750rpx;
		flex-direction: column;
	}
	
	.center-list-item {
		/* width: 750rpx; */
		box-sizing: border-box;
		flex-direction: row;
		padding: 20rpx 0;
		display: flex;
	}
	
	.border-bottom {
		border-bottom-width: 1rpx;
		border-color: #c8c7cc;
		border-bottom-style: solid;
	}
	
	
	
	.list-icon {
		width: 48rpx;
		height: 48rpx;
		line-height: 90rpx;
		color: #0faeff;
		text-align: center;
		font-family: texticons;
		margin-right: 20rpx;
	}
	.slot-image2 {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		margin-right: 16px;
		margin-left: 6px;
		margin-top: 12px;
		width: 48rpx;
		height: 48rpx;
	}
	.go-login.navigat-arrow {
		color: #FFFFFF;
	}
</style>
