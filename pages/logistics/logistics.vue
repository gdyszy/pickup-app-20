<template>
		<view class="content">
		<view class="uni-list" v-if="formData!=''">
			<block v-for="(item, index) in formData" :key="index" >
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="goDetail(item)">
					<view class="uni-media-list">
						<view class="uni-media-list-body">
							<view class="uni-media-list-text-top">商品：{{ item.gdsTitle }}</view>
							<view class="uni-media-list-text-bottom">
								<text>状态：{{options.status_valuetotext[item.state]}}</text>
							</view>
							<view class="uni-media-list-text-bottom">
								<text>创建时间：{{item.create_date | filterTime }}</uni-dateformat></text>
							</view>
						</view>
					</view>
				</view>
			</block>
			
		</view>
		<block v-else>
			<view class="nodata" >
				暂无信息
			</view>
		</block>
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
		filters: {
			filterTime(type) {
				if(type){
				 return new Date(type).Format('yyyy-MM-dd hh:mm:ss')	
				}
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
				let param = {
					cardNumb:cardNumb
				}
				this.commHttpRequest('query_user','queyOrderLogistics', param, true, (res) => {
					if (res.result.data!='') {
						let resData = res.result.data
						let gdsTitles = ''
						for (let k = 0;k < resData.length; k++) {
						const selectGdsIdArr = resData[k].selectGdsIdList
						for (let i = 0; i < selectGdsIdArr.length; i++) {
												gdsTitles += selectGdsIdArr[i].gdsTitle + '、';
											}
											if (gdsTitles.length > 0) {
												gdsTitles = gdsTitles.substr(0, gdsTitles.length - 1);
											}
											resData[k].gdsTitles = gdsTitles
					}
					this.formData = resData
					}else {
						this.formData =[]
					}
				})
			},
			goDetail(item){
				uni.setStorageSync('orderDetail', item)
				uni.navigateTo({
					url: './logisticsDetail'
				});
			},
			returnIndex(){
				const pwdActivityData = uni.getStorageSync('pwdActivityData')
				if(pwdActivityData && pwdActivityData.activityID){
					let url='../index/index?id='+ pwdActivityData.activityID
					uni.reLaunch({
					    url: url
					});
				}else{
					uni.reLaunch({
					    url: '../index/index'
					});
				}
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
		border-radius: 4px;
		background: #c79a68;
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
	
	.uni-list-cell {
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.uni-list-cell-hover {
		background-color: #eee;
	}
	.uni-list-cell-pd {
		padding: 22rpx 30rpx;
	}
	.uni-list-cell-left {
	    white-space: nowrap;
		font-size:28rpx;
		padding: 0 30rpx;
	}
	.uni-list-cell-db,
	.uni-list-cell-right {
		flex: 1;
	}
	.uni-list-cell::after {
		position: absolute;
		z-index: 3;
		right: 0;
		bottom: 0;
		left: 30rpx;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}
	.uni-list .uni-list-cell:last-child::after {
		height: 0rpx;
	}
	.uni-list-cell-last.uni-list-cell::after {
		height: 0rpx;
	}
	.uni-list-cell-divider {
		position: relative;
		display: flex;
		color: #999;
		background-color: #f7f7f7;
		padding:15rpx 20rpx;
	}
	.uni-list-cell-divider::before {
		position: absolute;
		right: 0;
		top: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}
	.uni-list-cell-divider::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0rpx;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}
	.uni-list-cell-navigate {
		font-size:30rpx;
		padding: 22rpx 30rpx;
		line-height: 48rpx;
		position: relative;
		display: flex;
		box-sizing: border-box;
		width: 100%;
		flex: 1;
		justify-content: space-between;
		align-items: center;
	}
	.uni-list-cell-navigate {
		padding-right: 36rpx;
	}
	.uni-navigate-badge {
		padding-right: 50rpx;
	}
	.uni-list-cell-navigate.uni-navigate-right:after {
		font-family: uniicons;
		content: '\e583';
		position: absolute;
		right: 24rpx;
		top: 50%;
		color: #bbb;
		-webkit-transform: translateY(-50%);
		transform: translateY(-50%);
	}
	.uni-list-cell-navigate.uni-navigate-bottom:after {
		font-family: uniicons;
		content: '\e581';
		position: absolute;
		right: 24rpx;
		top: 50%;
		color: #bbb;
		-webkit-transform: translateY(-50%);
		transform: translateY(-50%);
	}
	.uni-list-cell-navigate.uni-navigate-bottom.uni-active::after {
		font-family: uniicons;
		content: '\e580';
		position: absolute;
		right: 24rpx;
		top: 50%;
		color: #bbb;
		-webkit-transform: translateY(-50%);
		transform: translateY(-50%);
	}
	
	/* 图文列表 */
	.uni-media-list {
		padding: 22rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		width: 100%;
		flex-direction: row;
	}
	.uni-media-list-body {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
		overflow: hidden;
	}
	.uni-media-list-text-top {
		width: 100%;
		line-height: 36rpx;
		font-size: 30rpx;
	}
	.uni-media-list-text-bottom {
		margin: 10rpx 0;
		width: 100%;
		line-height: 30rpx;
		font-size: 30rpx;
		color: #8f8f94;
		margin-top: 10px;
	}
	.nodata{
		text-align: center;
		justify-content: center;
		align-items: center;
		font-size: 24px;
	}
</style>
