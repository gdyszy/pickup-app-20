<template>
	<view style="position: relative;">
		<view class="content">
			<view class="content_card">
				<view class="content_card_head">
					<img :src="require('@/static/liwu.png')"  style="width: 40px;height: 40px;">
					<span style="color: #2654B2;font-size: 16px;font-weight: bold;">兑换成功</span>
				</view>
				<view class="content_card_body">
					您的礼品已成功兑换。我们将尽快为您发货，之后您可以重新输入兑换卡号及密码，查询相应的物流信息。
				</view>
				<view class="logistics-content">
						<view class="tit">订单状态</view>
						<view class="logistics-info">
							<view class="logistics-description">订单状态：</view>
							<view  class="logistics-cont">{{options.status_valuetotext[formData.state]}}</view>
						</view>
						<view class="logistics-info">
							<view class="logistics-description">活动名称：</view>
							<view class="logistics-cont">{{formData.activityTitle}}</view>
						</view>
						<view class="logistics-info">
							<view class="logistics-description">所选商品：</view>
							<view class="logistics-cont" >
								<view v-for="(item,index) in selectGdsIdLists" :key="index">
									{{item.gdsTitles}}
								</view>
							</view>
						</view>
						<view class="tit">收件信息</view>
						<view class="logistics-info">
							<view class="logistics-description">收件人：</view>
							<view class="logistics-cont">{{formData.accept}}</view>
						</view>
						<view class="logistics-info">
							<view class="logistics-description">手机号码：</view>
							<view class="logistics-cont">{{formData.acceptTel}}</view>
						</view>
						<view class="logistics-info">
							<view class="logistics-description">省市区：</view>
							<view class="logistics-cont">{{formData.province}}</view>
						</view>
						<view class="logistics-info">
							<view class="logistics-description">街道地址：</view>
							<view class="logistics-cont">{{formData.address}}</view>
						</view>
						<view class="logistics-info">
							<view class="logistics-description">留言：</view>
							<view class="logistics-cont">{{formData.leave}}</view>
						</view>
					<button class="btn-Select" @click="returnIndex">返回</button>
					<!-- #ifdef MP-WEIXIN -->
					 <sa-hover-menu></sa-hover-menu>
					<!-- #endif -->
					
				</view>
			</view>
			
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
				 selectGdsIdLists:[],
				activityID:"",
				  formData,
					chanceShow: false,
					options: {
						"status_valuetotext": {
							"0": "待发货",
							"1": "待收货",
							"2": "已收货",
							"3": "已关闭"
						}
					}
			}
		},
		mounted() {
			this.init()
		},
		onLoad() {
			const pwdActivityData = uni.getStorageSync('pwdActivityData')
			if(pwdActivityData.numb==''||pwdActivityData.numb==undefined){
			}else{
					this.getOrder(pwdActivityData.numb)
			}
		},
		methods: {
			viewLogistic(){
				if(this.formData.emsNumb==''){
					this.show_nativeUI_toast("暂无物流信息", "error");
					return false
				}
			let url =	'./viewLogistic?emsNumb='+this.formData.emsNumb+'&emsFirm='+this.formData.emsFirm+'&emsCode='+this.formData.emsCode+'&emp_code='+this.formData.emp_code
			uni.navigateTo({
				url
			})
			},
			getOrder(cardNumb){
				let _this = this
				let param = {
					cardNumb:cardNumb
				}
				this.commHttpRequest('query_user','queyOrder', param, true, (res) => {
					if (res.result.data!='') {
						this.formData = res.result.data[0]
						let gdsTitles = ''
						const selectGdsIdArr = this.formData.selectGdsIdList
						_this.selectGdsIdLists =[]
						for (let i = 0; i < selectGdsIdArr.length; i++) {
							 if(selectGdsIdArr[i].chooseNumb!=undefined){
									gdsTitles = '【'+ selectGdsIdArr[i].chooseNumb+'件】'+selectGdsIdArr[i].gdsTitle; 
							 }else{
								 	gdsTitles = selectGdsIdArr[i].gdsTitle;
							 }
											_this.selectGdsIdLists.push({gdsTitles:gdsTitles})	
											}
					}
				})
			},
			init(){
				var that = this
				uni.getStorage({
					key: 'storage_activityID',
					success: function(res) {
						that.activityID = res.data
						},
				})
			},
			returnIndex(){
				uni.removeStorageSync('pwdActivityData');
				uni.removeStorageSync('storage_choose');
				let url='../index/index'
				uni.reLaunch({url:url })
			},
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.content{
		padding: 20rpx 20rpx;
		z-index: 10;
		&_card{
			width: 80%;
			height: 24vh;
			background-color: #FFFFFF;
			border: 1px solid #FFFFFF;
			border-radius: 8px;
			padding: 4px 30px;
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
				font-size: 13px;
				color: #252630;
				padding: 13px 8px;
				
			}
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
				width: 90px;
				color: #8f9999;
			}
			
			.edit-txt {
				color: rgb(52, 113, 209);
				cursor: pointer;
				margin-left: 10px;
			}
		}
	}

</style>
