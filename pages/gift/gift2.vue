<template>
	<view style="position: relative;">
		<view class="content">
			<view class="form_top">
				<view class="span_1">
					<text>套餐名: </text><span class="span_top1">{{getStorageData.activityTitle}}</span>
				</view>
				<view class="span_1">
					<span class="span_top1">卡号：{{getStorageData.numb}}</span>
				</view>
				<view class="span_1">
				<span class="span_top1">可兑换总金额：<span class="zje">{{totalAmount?totalAmount:0}}元</span></span>
				</view>
				<view class="span_1">
				<span class="span_top1">已选择商品总金额：<span class="zje">{{ctotalAmount?ctotalAmount:0}}元</span></span>
				</view>
				<view class="span_1">
					<span class="span_top">状态: {{getStorageData.state | local_state}}</span>
					<span class="span_top">到期: {{getStorageData.activityEndTime | filterTime}}</span>
				</view>
				<view class="span_2" v-if="totalAmount>0">此卡额度为{{totalAmount}}元、不支持分次提货，分次提货此卡（账号、密码）已显示作废，有疑问请先联系客服再下单。</view>
			</view>
			<view class="form_body">
				<view class="card flex-center" v-for="(item,index) in gdsList" :key="index">
					<view>
						<image class="img" lazy-load :src="item.image"></image>
					</view>
					<view class="flex-column-center details">
						<view class="flex-column">
							<span class="font-weight-700 font-middle">{{item.title}}</span>
						</view>
						<view class="flex-column" v-if="item.price">
							<span class="font-weight-700 font-middle">单价：{{item.price}}元</span>
						</view>
						<view class="flex-column" v-if="item.chooseNumb">
							<span class="font-weight-700 font-middle">小计：{{item.price*item.chooseNumb}}元</span>
						</view>
					</view>
					<view>
					<cartcontrol :goods="item" :totalAmount="totalAmount" :ctotalAmount="ctotalAmount" @add="addCart" @dec="decreaseCart" @input="inputCart"></cartcontrol>
					<view class="errtip">{{item.disabledtip}}</view>
					</view>
				</view>
			</view>
			<button class="btn-Select" @click="nextStep">立即订购</button>
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<!-- <sa-hover-menu></sa-hover-menu> -->
		<!-- #endif -->
	</view>
</template>

<script>
	import cartcontrol from '@/components/cartcontrol.vue'
	export default {
		data() {
			return {
				goods:{},
				getStorageData: {},
				limitNumb: 0,
				chooseNumb: 0,
				gdsList: [],
				setStorageData: {},
				pName: '',
				Logo: '',
				activityType:2,
				totalAmount:0,
				ctotalAmount:0,
				hiddenLogo: true,
				selectItems:0
			}
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
		components: {
			cartcontrol
		},
		mounted() {
			this.getProjectInfo()
			var that = this;
			this.getList()
		},
		methods: {
			delShopcart() {
				this.$emit('delAll');
			},
			addCart: function(item) {
				if(item.disabled==true){
					return false
				}
			/* 	if(this.ctotalAmount>this.totalAmount){
					this.show_nativeUI_toast("已超过可兑换总金额~", "error");
					return false;
				} */
				 if (item.chooseNumb >= 0) {
				 	item.chooseNumb++
				 	this.gdsList.forEach((good) => {
				 		if (item._id == good._id){
								good.chooseNumb = item.chooseNumb
						}
				 		
				 	})
				 } else {
				 	this.gdsList.forEach((good) => {
				 		if (item._id == good._id){
				 				Vue.set(good, 'count', 1)
				 		}
				 	})
				 }
				 this.getTotalAmount()
			},
			getTotalAmount(){
				var _this=this;
				var total=0
			this.gdsList.forEach((good) => {
				if (good.chooseNumb>0){
				var subtotal=good.chooseNumb*good.price;
				total+=subtotal
				}
			})	
			_this.ctotalAmount= total
			},
			decreaseCart(item) {
				if (item.chooseNumb) {
					item.chooseNumb--
					this.gdsList.forEach((good) => {
						if (item._id == good._id){
								good.chooseNumb = item.chooseNumb
						}
					})
				}
				this.getTotalAmount()
			},
			inputCart: function(item) {
				/* if(this.ctotalAmount>this.totalAmount){
					this.show_nativeUI_toast("已超过可兑换总金额~", "error");
					return false;
				} */
				if (item.chooseNumb >= 0) {
					item.chooseNumb++
					this.gdsList.forEach((good) => {
						if (item._id == good._id){
								good.chooseNumb = item.chooseNumb+ -1
						}
					})
				} else {
					this.gdsList.forEach((good) => {
						if (item._id == good._id){
								Vue.set(good, 'count', 1)
						}
					})
				}
				this.getTotalAmount()
			},
			getList() {
				let _this = this
				const pwdActivityData = uni.getStorageSync('pwdActivityData')
				this.getStorageData = pwdActivityData
				var arr = Object.keys(pwdActivityData)
				_this.totalAmount = pwdActivityData.totalAmount //单次可兑换商品总数
				if (arr.length == 0) {
					this.showToast(1)
					this.limitNumb = 0
				} else {
					let goodsID = []
					for (let i in pwdActivityData.activityGds) {
						if(pwdActivityData.activityGds[i].exchange==1){
						goodsID.push(pwdActivityData.activityGds[i]._id)
						}
					}
					let params = {
						gdsQueryValue: goodsID
					}
					this.commHttpRequest('query_user', 'gdsQueryUser', params, true, (res) => {
						if (res.result.data) {
							const resultData = res.result.data
							for (let i in resultData) {
								resultData[i].haveChooseNumb = pwdActivityData.activityGds[i].haveChooseNumb
								resultData[i].chooseNumb = 0
								resultData[i].exchangeLimit = pwdActivityData.activityGds[i].exchangeLimit
								resultData[i].exchangeStock = pwdActivityData.activityGds[i].exchangeStock
							if(resultData[i].exchangeStock - resultData[i].exchangeLimit < 0 || resultData[i].stock - resultData[i].exchangeLimit < 0){
								resultData[i].disabled = true
								resultData[i].disabledtip = '该商品库存不足'
										}else{
											resultData[i].disabled = false
										}
							}
							_this.gdsList = resultData
						}
					})
				}
			},
			checkboxChange: function(e) {},
			selectItem(e) {
				this.selectItems =e
				return false
				if (this.gdsList[i].exchangeStock - this.gdsList[i].exchangeLimit < 0 || this.gdsList[i].stock - this
					.gdsList[i].exchangeLimit < 0) {
					uni.showToast({
						title: '该商品库存不足',
						icon: 'none'
					})
				} else if (this.chooseNumb > this.limitNumb) {
					uni.showToast({
						title: '已达最大选择数',
						icon: 'none'
					})
				} else if (this.chooseNumb == this.limitNumb) {
					uni.showToast({
						title: '已达最大选择数',
						icon: 'none'
					})
				}
				// 选了多少礼包
				this.chooseNumb = 0
				for (let i in this.gdsList) {
					if (this.gdsList[i].checked === true) {
						this.chooseNumb++
					}
				}
			},
			showToast(stateNumb) {
				switch (stateNumb) {
					case 1:
						uni.showToast({
							title: '无卡密信息，请重新输入卡密！',
							duration: 2500,
							image: "/static/false.png"
						});
						setTimeout(function() {
							uni.reLaunch({
								url: '../index/index'
							})
						}, 3000)
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
						break;
				}
			},
			nextStep() {
				
				var selectIdList = []
				for (let i in this.gdsList) {
					if (this.gdsList[i].chooseNumb >0) {
						selectIdList.push(this.gdsList[i])
					}
				}
				let checkChooseNumb = 0
				const setStorageData = {
					selectIdList: selectIdList,
					numb: this.getStorageData.numb,
					pwd: this.getStorageData.pwd,
					activityID: this.getStorageData._id,
					activityTitle: this.getStorageData.activityTitle,
					activityImg: this.getStorageData.activityImg,
					activityType:this.getStorageData.activityType
				}
				if(this.ctotalAmount==0){
					this.show_nativeUI_toast("请选择商品数量！", "error");
					return false
				}
				
				if(this.ctotalAmount>this.totalAmount){
					this.show_nativeUI_toast("已超过可兑换总金额~", "error");
					return false;
				}
				uni.setStorageSync('storage_choose', setStorageData)
				uni.navigateTo({
					url: '../gift/order',
					events: {
						refreshData: () => {
							this.getList()
						}
					}
				});

			},
			getProjectInfo() {
				let that = this
				uni.getStorage({
					key: 'projectInfo',
					success: function(res) {
						that.hiddenLogo = false
						that.pName = res.data.pName
						that.Logo = res.data.Logo
					}
				});
			}
		}
	}
</script>

<style>
	page {
		background-color: #fff;
	}

	.form_top {
		margin-top: 10px;
		margin-bottom: 20px;
		border: 1px solid #fffae8;
		border-radius: 10rpx;
		background: #f0f8f1;
		color: #000000;
		z-index: 1000;
	}

	.span_1 {
		display: flex;
		margin: 20rpx;
	}

	.span_top {
		display: block;
		width: 50%;
	}
   .span_2{
	   color: #f80000;
	   font-weight: 800;
	   margin-left: 10px;
	   margin-bottom: 15px;
   }
	.span_top1 {
		display: block;
		width: 80%;
		font-weight: 800;
	}

	.form_head {
		color: #252630;
		font-weight: bold;
		font-size: 15px;
		letter-spacing: 0pt;
	}


	.form_foot {
		display: flex;
		justify-content: space-between;
		color: #41424D;
		font-weight: medium;
		font-size: 15px;
		line-height: normal;
		text-align: left;
		margin-top: 10px;
	}

	.font-weight-700 {
		color: #282933;
		font-weight: medium;
	}

	.font-weight-600 {
		color: #AAADB4;
		font-weight: medium;
		font-size: 15;
	}

	.font-weight-200 {
		font-weight: 200;
		color: #8C90B2;
	}

	.content {
		padding: 20rpx 20rpx;
		z-index: 10;
	}

	.flex-center {
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.flex-column-center {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.details {
		height: 120rpx;
		margin-top: 50rpx;
		flex: 1;
		margin-left: 11px;
	}

	.uni-checkbox-input {
		margin-top: 50rpx;
	}

	.img {
		border-radius: 10rpx;
		width: 200rpx;
		height: 180rpx;
	}

	.font-middle {
		font-size: 16px;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
	}


	.logo {
		width: 100%;
	}

	.initLogo {
		left: 50%;
		margin-left: -90rpx;
	}



	checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		border: 1px solid var(--view-theme) !important;
		background-color: var(--view-theme) !important;
		color: #37C674 !important
	}
	.errtip{
		margin-top: 10rpx;
		font-size: 13px;
		color: #f80000;
	}
	.zje{
		font-weight: 600;
		font-size: 18px;
	}
</style>
