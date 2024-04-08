<template>
		<view class="content">
			<view class="logistics-content">
				<view class="tit">订单状态</view>
				<view class="logistics-info">
					<view class="logistics-description">订单状态：</view>
					<view  class="logistics-cont">{{options.status_valuetotext[formData.state]}}</view>
				</view>
				<view class="tit">发货信息</view>
				<view class="logistics-info">
					<view class="logistics-description">快递公司：</view>
					<view class="logistics-cont">{{formData.emsFirm}}</view>
				</view>
				<view class="logistics-info">
					<view class="logistics-description">快递单号：</view>
					<view class="logistics-cont" @click="viewLogistic()">{{formData.emsNumb}}    (点击单号查看物流)</view>
				</view>
				<view class="tit">订单信息</view>
				<view class="logistics-info">
					<view class="logistics-description">订单编号：</view>
					<view class="logistics-cont">{{formData.orderID}}</view>
				</view>
				<view class="logistics-info">
					<view class="logistics-description">活动名称：</view>
					<view class="logistics-cont">{{formData.activityTitle}}</view>
				</view>
				<view class="logistics-info">
					<view class="logistics-description">所选商品：</view>
					<view class="logistics-cont">	<view v-for="(item,index) in selectGdsIdLists" :key="index">
						{{item.gdsTitles}}
					</view></text></view>
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
		onLoad(option) {
			if(option.cardNumb!=''){
				this.getOrder(option.cardNumb)
			}
		},
		methods: {
			/* const orderDetail = uni.getStorageSync('orderDetail')
			if(orderDetail){
				let _this = this
				this.formData =orderDetail
				this.selectGdsIdLists =[]
				let gdsTitles = ''
				const selectGdsIdArr = this.formData.selectGdsIdList
				for (let i = 0; i < selectGdsIdArr.length; i++) {
					 if(selectGdsIdArr[i].chooseNumb!=undefined){
							gdsTitles = '【'+ selectGdsIdArr[i].chooseNumb+'件】'+selectGdsIdArr[i].gdsTitle; 
					 }else{
						 	gdsTitles = selectGdsIdArr[i].gdsTitle;
					 }
							_this.selectGdsIdLists.push({gdsTitles:gdsTitles})	
				}
			} */
			getOrder(cardNumb){
				let _this = this
				let param = {
					cardNumb:cardNumb
				}
				this.commHttpRequest('query_user','queyOrder', param, true, (res) => {
					if (res.result.data) {
						this.formData = res.result.data[0]
						this.selectGdsIdLists =[]
						let gdsTitles = ''
						const selectGdsIdArr = this.formData.selectGdsIdList
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
			
			returnIndex(){
			uni.reLaunch({
				url: '../index/index'
			})
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
	.btn-Select {
		width: 100%;
		margin-top: 20px;
		border: 1px solid #41D5A3;
		border-radius: 10rpx;
		background: #41D5A3;
		color: #FFFFFF;
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
	
	/* 列表 */
	.uni-list {
		background-color: #FFFFFF;
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	.uni-list:after {
		position: absolute;
		z-index: 10;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}
</style>
