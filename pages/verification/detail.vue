<template>
		<view class="content">
			<view class="logistics-content">
				<view class="logistics-info">
					<view class="logistics-description">卡号：</view>
					<view  class="logistics-cont"> {{formData.numb }}</view>
				</view>
				<view class="logistics-info">
					<view class="logistics-description">卡状态：</view>
					<view  class="logistics-cont"> {{formData.state | local_state}}</view>
				</view>
				<view class="logistics-info">
					<view class="logistics-description">活动名称：</view>
					<view class="logistics-cont">{{formData.activityList?formData.activityList.activityTitle:''}}</view>
				</view>
				<view class="tit">可兑换商品</view>
				<view v-for="(item,index) in gdsList" :key="index" class="gdslist">
				<view class="logistics-info gds-info">
					<view class="logistics-description">商品：</view>
					<view class="logistics-cont">{{item.title}}</text></view>
				</view>
				<view class="logistics-info gds-info">
					<view class="logistics-description">商品价格：</view>
					<view class="logistics-cont">{{item.price}}</view>
				</view>
				<view class="logistics-info gds-info">
					<view class="logistics-description">商品回收价格：</view>
					<view class="logistics-cont">{{item.recovery_price}}</view>
				</view>
				</view>
			<button class="btn-Select-n" v-if="formData.state==2 && recoveryIs==1"  @click="goRecovery(formData.numb)">回收提货卡</button>
			<button class="btn-Select" @click="returnIndex(formData.numb)">去兑换</button>
			
			<!-- #ifdef MP-WEIXIN -->
			 <sa-hover-menu></sa-hover-menu>
			<!-- #endif -->
	
		</view>
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
				"emsCode":""
			}
			return {
				recoveryIs:2,
				gdsList: [],
				setStorageData: {},
			  formData,
				chanceShow: false,
			}
		},
		onLoad(option) {
			uni.setNavigationBarTitle({
			     title:"提货券验证详情"
			    });
			if(option.cardNumb!=''){
				this.getVerification(option.cardNumb)
			}
			this.recoveryIs = uni.getStorageSync('projectInfo')?uni.getStorageSync('projectInfo').recoveryIs:2
		},
		filters: {
			filterTime(type) {
				if (type) {
					return new Date(type).Format('yyyy-MM-dd')
				}
			},
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
				}else if (index == 8) {
					return '提货中'
				}
			}
		},
		methods: {
			getVerification(cardNumb){
				let param = {
					cardNumb:cardNumb
				}
				this.commHttpRequest('query_user','queyCardDetailRecovery', param, true, (res) => {
					if (res.result.data) {
						this.formData = res.result.data[0]
						let gdsTitles = ''
						if(this.formData.activityList.activityGds){
							this.getGdlist(this.formData.activityList)
						}
					
					}
				})
			},
			getGdlist(pwdActivityData){
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
						let  gdsData = res.result.data
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
						_this.gdsList  = gdsData
					}
				})
				
				
			},
			goRecovery(numb){
				let url = './recovery?numb='+numb
			uni.navigateTo({
				url,
				events: {
					refreshData: () => {
						this.getList()
					}
				}
			})	
			},
			returnIndex(numb){
				let url='../index/index?numb='+numb
				uni.reLaunch({url:url })
			}
			
		}
	}
</script>

<style lang="scss">
	.content{
		padding: 20rpx 20rpx;
		z-index: 10;
		&_card{
			margin-top: 10%;
			width: 75%;
			background-color: #FFFFFF;
			border: 1px solid #FFFFFF;
			border-radius: 8px;
			padding: 14px 10px;
			z-index: 10;
			display: flex;
			flex-direction: column;
			&_head{
				display: flex;
				justify-content: center;
				align-items: center;
				border-bottom: 1px solid #ccc;
				padding: 8px 10px;
			}
			&_body{
				text-align: center;
				font-size: 13px;
				color: #252630;
				height: 240px;
				overflow: scroll;
			}
		}
	}
	.box{
		display: flex;
		padding: 4px;
		position: relative;
		transform-style: preserve-3d;
		&_info{
			flex: 5;
			text-align: left;
			margin-left: 13px;
		}
		&_time{
			display: flex;
			flex-direction: column;
			flex: 2;
			.time{
				color: #3C3E4D;
				font-weight: bold;
				font-size: 15px;
				background-color: #fff;
				text-align: left;
			}
			.date{
				color: #787B99;
				font-size: 10px;
				text-align: left;
				background-color: #fff;
			}
		}
	}
	.box::after{
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
		.box::after{
			content: "awsl";
			content: "";
			width: 0px;
			height: 0px;
		}
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
	.gdslist{
		margin-top: 10px;
		margin-bottom: 20px;
		border: 1px solid #fffae8;
		border-radius: 10rpx;
		background: #f0f8f1;
		color: #000000;
	}
	.gds-info{
		margin: 10rpx;
	}
	.btn-Select-n{
		background-color: #b99265;
		color: #fff;
	}

</style>
