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
						<image class="banner-image" :src="item.bannerfile.url?item.bannerfile.url:item.url" mode="aspectFill" :draggable="false" />
					</view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
		<view class="card-form">
			<uni-forms  :value="submitData" validateTrigger="bind">
				<uni-forms-item label="收货人姓名" required>
					<uni-easyinput placeholder="请输入姓名" v-model="submitData.accept" trim="both"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="手机号码" required>
					<uni-easyinput placeholder="请输入手机号码" v-model="telephone" @blur="validatePhone()" @confirm="validatePhone()"  type="number" maxlength="11"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="所在地区" required>
					<input class="input" v-model="submitData.province" placeholder="请选择所在省市区" @click="addressShow = true">
					<pickerAddress v-model="addressShow" @confirm="addresspick" />
					</input>
				<!-- 	<view class="input"><comp-select-address class="address" @selectAddress="selectAddress" /></view> -->
					
				</uni-forms-item>
				<uni-forms-item label="详细地址" required>
					<uni-easyinput placeholder="请输入详细地址" v-model="submitData.address" trim="both"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="备注">
					<uni-easyinput placeholder="选填,请输入备注" v-model="submitData.leave" trim="both"></uni-easyinput>
				</uni-forms-item>
				<view class="uni-button-group">
					<button :disabled="isDisabled" v-if="submitData.accept!=''&&telephone!=''&&submitData.province!=''&&submitData.address!=''" class="btn_OK" @click="submitmp">确定预约</button>
								<button v-else class="btn_Not" >确定预约</button>
								<!-- <button class="btn_OK" @click="submitmp">确定预约</button> -->
											
				
				</view>
			</uni-forms>
		</view>
	</view>
</template>


<script>
	import pickerAddress from '@/components/liudx-pickerAddress/index.vue'
	import validCode from "@/components/ValidCode/index"
	import bjxForm from '@/components/bjx-form/bjx-form.vue'
	import bjxFormItem from '@/components/bjx-form/bjx-form-item.vue'

	export default {
		components: {
			pickerAddress,
			"valid-code": validCode,
			bjxForm,
			bjxFormItem
		},
		data() {
			return {
				c_mobile:true,
				current: 0,
				swiperDotIndex: 0,
				swiperData: [{
					"id": 1,
					"cid": 1,
					"name": "banner1",
					"url": "/static/banner1.png",
				}, {
					"id": 2,
					"cid": 1,
					"name": "banner1",
					"url": "/static/banner2.png",
				}],
				showrequired: true,
				showLogo: true,
				isDisabled: false,
				isShow: true,
				getStorageData: {},
				selectIDs: [], // 选中商品的ID列表
				chooseGiftList: [],
				storageKeys: [],
				submitData: {
					accept: "",
					acceptTel: "",
					province: "",
					address: "",
					leave: "",
					confirmCode: ""
				},
				telephone: "",
				checkPhoneNum: "",
				validCode: "",
				addressShow: false,
				form: {
					province: '',
					city: '',
					area: '',
				},

			

				// 确认时获取的活动绑定商品信息
				getActivityGds: [],
				// 确认时获取的商品信息
				getGoods: [],
				// 更改库存提交的对象
				stockObjSubmit: {
					activityID: "",
					goods: [],
					activityGds: []
				},
				pName: '',
				Logo: '',
				hiddenLogo: true
			}
		},
		onLoad() {
			this.swiperData = uni.getStorageSync('bannerData')
			 this.getOpenerEventChannel().emit('refreshData')
		},
		mounted() {
			this.getProjectInfo()
			var that = this;
			that.selectIDs = []
			this.getList()
		},
		methods: {
			selectAddress(value) {
				const [province, city, county] = value;
				var place = province+city+county
				this.submitData.province = place
			},
			getList() {
				let _this = this
				const storageChooseData = uni.getStorageSync('storage_choose')
				//已有订单信息，自动填写上一次提货的收货人信息
				if(storageChooseData.receivingInfo){
				this.submitData= storageChooseData.receivingInfo?storageChooseData.receivingInfo:this.submitData
				this.telephone = storageChooseData.receivingInfo.acceptTel?storageChooseData.receivingInfo.acceptTel:''
				}
				this.getStorageData = storageChooseData
				this.chooseGiftList = storageChooseData.selectIdList
				var arr = Object.keys(storageChooseData)
				_this.storageKeys = arr
				if (arr.length == 0) {
				this.showToast(1) //无存储信息
				setTimeout(function() {
					uni.reLaunch({
						url: '../index/index'
					})
				}, 3000)
				} else {
					let goodsID = []
					for (let i in storageChooseData.selectIdList) {
						goodsID.push(storageChooseData.selectIdList[i]._id)
					}
					
					_this.selectIDs =goodsID
					_this.stockObjSubmit.activityID = _this.getStorageData.activityID
				}
			},
			clickBannerItem(item){
				return false
				if(item.open_url==''||item.open_url==undefined){
						return false
					}
				let p = encodeURIComponent(item.open_url)
				uni.navigateTo({
					url: `/pages/webview/index?path=${p}`
				})	
			},
			validatePhone(){
			const c_mobile = /^1(3|4|5|6|7|8|9)\d{9}$/; //判断手机号码正则
			const _this = this;
			if (!c_mobile.test(_this.telephone)) {
			this.show_nativeUI_toast("请输入正确手机号码", "error");
			this.c_mobile=false
			return false;
			}else{
				this.c_mobile=true
			}
			},

			changeSwiper(e) {
				this.current = e.detail.current
			},
			init(callback) {
				this.getStorageData = uni.getStorageSync('storage_choose')
				let arr = this.getStorageData
				if (arr.length == 0) {
					this.showToast(1) //无存储信息
					setTimeout(function() {
						uni.reLaunch({
							url: '../index/index'
						})
					}, 3000)
				} else {
					callback(this.getStorageData, arr)

				}
			},
			submitmp() { //提交数据
			if(this.c_mobile==false){
				this.show_nativeUI_toast("请输入正确手机号码", "error");
				return false;
			}
			if(this.submitData.accept==""){
				this.show_nativeUI_toast("请输入收货人姓名", "error");
				return false;
			}
			if(this.submitData.province==""){
				this.show_nativeUI_toast("请选择地区", "error");
				return false;
			}
			if(this.submitData.address==""){
				this.show_nativeUI_toast("请输入详细地址", "error");
				return false;
			}
						let flag = true;
						if (flag == true) {
						// 检验是否存在卡密缓存
						if (this.storageKeys.length == 0) {
							this.showToast(1) //无存储信息
							setTimeout(function() {
								uni.reLaunch({
									url: '../index/index'
								})
							}, 3000)
						}
						else {
							// 检查库存是否充足
							this.checkStock()
						}
					} else {
						this.isDisabled = false
					}
			},

			checkStock() {
				let  params = {
					gdsQueryValue:this.selectIDs
				}
				//查询绑定在活动内的商品列表，获取绑定商品的库存
				this.commHttpRequest('query_user','gdsQueryUser', params, false, (res) => {
					this.getGoods = res.result.data
					var activityType = this.getStorageData.activityType
					this.stockObjSubmit.goods=[]
					for (let i in this.getGoods) {
						let obj = {}
						if(this.getGoods[i]._id==this.getStorageData.selectIdList[i]._id){
						obj._id = this.getGoods[i]._id
						obj.stock = activityType==2?(this.getGoods[i].stock- this.getStorageData.selectIdList[i].chooseNumb):(this.getGoods[i].stock - this.getStorageData.selectIdList[i].exchangeLimit)
						this.stockObjSubmit.goods.push(obj)	
						}
						
					}
					this.checkActivityBindStock()
				})
			},

			checkActivityBindStock() {
				let  params = {
					activityIDValue:this.getStorageData.activityID
				}
				// 查询活动绑定商品，获取限制库存
				this.commHttpRequest('query_user','activityQueryUser', params, false, (res) => {
					this.getActivityGds = res.result.data[0].activityGds
					this.stockObjSubmit.activityGds = this.getActivityGds
					var activityType = this.getStorageData.activityType
					// 判断库存是否充足，充足则判断卡密并修改库存量，不足则停止运行并弹出提示
					let arr = []
					let stockFlag = true
					for (let i in this.getActivityGds) {
						arr.push(this.getActivityGds[i]._id)
					}
				/* 	for (let i = 0; i < this.stockObjSubmit.activityGds.length; i++) {
					  for (let j = 0; j < this.getStorageData.selectIdList.length; j++) {
					   if (this.stockObjSubmit.activityGds[i]._id == this.getStorageData.selectIdList[j]._id) {
						   if(this.stockObjSubmit.activityGds[i].exchangeStock-this.getStorageData.selectIdList[j].chooseNumb<0||this.stockObjSubmit.activityGds[i].stock-this.getStorageData.selectIdList[j].chooseNumb<0){
							var title = this.getGoods[i].title + '库存不足，请返回重新选择！'
							uni.showToast({
								title: title,
								duration: 2500,
								image: "/static/false.png"
							});
							uni.hideLoading()
							stockFlag = false
							this.isDisabled = false
							return false 
						   }else{
							this.stockObjSubmit.activityGds[i].exchangeStock = (this.stockObjSubmit.activityGds[i].exchangeStock - this.getStorageData.selectIdList[j].chooseNumb)
							  this.stockObjSubmit.activityGds[i].chooseNumb = this.getStorageData.selectIdList[j].chooseNumb
							 this.stockObjSubmit.activityGds[i].haveChooseNumb = this.getStorageData.selectIdList[j].chooseNumb
							  break   
						   }
					    }else{
						this.stockObjSubmit.activityGds[i].chooseNumb = 0
						this.stockObjSubmit.activityGds[i].haveChooseNumb = 0	
						}
					  }
					} */
					for (let i in this.getStorageData.selectIdList) {
						if (arr.indexOf(this.getStorageData.selectIdList[i]._id) != -1) {
							let index = arr.indexOf(this.getStorageData.selectIdList[i]._id)
							// 库存不足。返回提示
							if(activityType==2){
							if (this.getActivityGds[index].exchangeStock - this.getStorageData.selectIdList[i].chooseNumb < 0 ) {
								var title = this.getGoods[i].title + '库存不足，请返回重新选择！'
								uni.showToast({
									title: title,
									duration: 2500,
									image: "/static/false.png"
								});
								uni.hideLoading()
								stockFlag = false
								this.isDisabled = false
								break;
							}
							// 库存充足，修改兑换后，活动库存的数据
							else {
								this.stockObjSubmit.activityGds[i].exchangeStock = this.getActivityGds[index].exchangeStock - this.getStorageData.selectIdList[i].chooseNumb;
							}		
							}else{
							if (this.getActivityGds[index].exchangeStock - this.getActivityGds[index]
								.exchangeLimit < 0 || this.getGoods[i].stock - this.getActivityGds[index]
								.exchangeLimit < 0) {
								var title = this.getGoods[i].title + '库存不足，请返回重新选择！'
								uni.showToast({
									title: title,
									duration: 2500,
									image: "/static/false.png"
								});
								uni.hideLoading()
								stockFlag = false
								this.isDisabled = false
								break;
							}
							// 库存充足，修改兑换后，活动库存的数据
							else {
								this.stockObjSubmit.activityGds[i].exchangeStock = this.getActivityGds[index].exchangeStock - this.getActivityGds[index].exchangeLimit;
							}	
							}
							
						}
					}
					if (stockFlag == true) {
						this.checkCardPwd()
					}
				})
			},
			checkCardPwd() {
				let _this =this
				// 查询卡密是否已经兑换
				let  params = {
					numbValue:this.getStorageData.numb
				}
				var activityType = this.getStorageData.activityType
				//查询绑定在活动内的商品列表，获取绑定商品的库存
				this.commHttpRequest('query_user','pwdCardQueryUser', params, false, (res) => {
					if (res.result.affectedDocs == 0) {
						uni.hideLoading()
						this.showToast(1) //卡密信息不存在
						setTimeout(function() {
							uni.reLaunch({
								url: '../index/index'
							})
						}, 3000)
					} else if (res.result.data[0].state == "2"||res.result.data[0].state == "8") {
						// 更改卡密状态&库存数据
						// 组合需要提交的数据
						this.createdOrderID()
						this.submitData.activityID = this.getStorageData.activityID
						this.submitData.activityImg = this.getStorageData.activityImg
						this.submitData.activityTitle = this.getStorageData.activityTitle
						this.submitData.cardNumb = this.getStorageData.numb
						this.submitData.activityType = activityType
					
						let gdsTitle = ""
						for (var i = 0; i < this.chooseGiftList.length; i++) {
							gdsTitle += this.chooseGiftList[i].title + "/"
						}
						gdsTitle = gdsTitle.substr(0, gdsTitle.length - 1)
						this.submitData.gdsTitle = gdsTitle
					
						var arr = []
						for (var j = 0; j < this.chooseGiftList.length; j++) {
							var obj = {
								gdsID: this.chooseGiftList[j]._id,
								gdsTitle: this.chooseGiftList[j].title,
								gdsImg: this.chooseGiftList[j].image,
								exchangeLimit: this.chooseGiftList[j].exchangeLimit,
								chooseNumb:this.chooseGiftList[j].chooseNumb,
								chooseNumb: activityType==2?this.chooseGiftList[j].chooseNumb:this.chooseGiftList[j].exchangeLimit
							}
							arr.push(obj)
						}
						this.submitData.selectGdsIdList = arr
						this.submitData.emp_code = uni.getStorageSync('emp_code')?uni.getStorageSync('emp_code'):this.$emp_code
						this.submitData.acceptTel = this.telephone
						//更新库存的参数
						var  stockUpdateParams = {
							numbValue:this.getStorageData.numb,
							stockObjSubmitValue:this.stockObjSubmit
						}
						this.submitData.stockUpdate = stockUpdateParams						
						// 提交订单
						this.commHttpRequest('add_user','orderAddUser', this.submitData, true, (res) => {
							if(res.result.code==10002){
								uni.showToast({
								    title: '已超过可兑换总金额,请重新选择商品',
									icon:'none',
									duration:2500
								})
								setTimeout(function() {
									uni.reLaunch({
										url: './gift2'
									})
								}, 3000)
								return false
							}else if(res.result.id){
							_this.show_nativeUI_toast("订单提交成功", "success");
							uni.setStorage({
								key: 'storage_activityID',
								data: this.getStorageData.activityID
							});
							setTimeout(function() {
								uni.reLaunch({
									url: '../gift/success'
								});
							}, 3000)	
							}else{
								_this.show_nativeUI_toast("提交异常，请重新提交", "error");
							}
							
						})
						
					} else {
						uni.hideLoading()
						this.showToast(4) //卡密状态不是未使用
					}
				})
				
			},
			createdOrderID() {
				let date = new Date().Format('yyyyMMddhhmmss')
				let times = Math.pow(10, 10)
				let rand = Math.floor(Math.random() * times)
				if (rand.toString().length != 10) {
					const len = rand.toString().length
					for (var j = 0; j < 10 - len; j++) {
						rand = "0" + rand
					}
				}
				let random = String(date) + String(rand)
				this.submitData.orderID = random
			},
			showToast(stateNumb) {
				switch (stateNumb) {
					case 1:
						uni.showToast({
							title: '无卡密信息，请重新输入卡密！',
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
						this.isShow = true
						uni.hideLoading()
						break;
					case 3:
						uni.showToast({
							title: '礼包信息不存在！',
							duration: 2500,
							image: "/static/false.png"
						});
						break;
					case 4:
						uni.showToast({
							title: '此礼包已领取！',
							duration: 2500,
							image: "/static/false.png"
						});
						setTimeout(function() {
							uni.reLaunch({
								url: '../index/index'
							})
						}, 3000)
						break;
					case "success":
						uni.showToast({
							title: '领取成功！',
							duration: 2500,
							icon: "success"
						});
						break;
				}

			},

			addresspick(obj) {
				let arr = ['province', 'city', 'area'];
				let place = '';
				arr.map(key => {
					this.form[key] = obj[key].code
					place += obj[key].name
				})
				this.submitData.province = place
			},
			code(data) {
				this.validCode = data
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

<style lang="scss">
	page{
		background-color: #fff;
	}
	.foot {
		display: flex;
		position: fixed;
		bottom: 0;
		width: 100%;
		flex: 1;
		justify-content: space-around;
		align-items: center;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 120vh;

		&_list {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-around;

			&_content {
				flex: 1;
				width: auto;
				text-align: right;
			}
		}
	}

	.form {
		margin-top: 60%;
		width: 80%;
		background-color: #FFFFFF;
		border: 1px solid #FFFFFF;
		border-radius: 8px;
		padding: 11px 12px;
		z-index: 10;
		display: flex;
		flex-direction: column;
	}

	.input {
		font-size: 18px;
		margin-top: 20rpx;
		border-bottom: 1px solid #E5E5E5;
	}

	

	.banner-image {
		width: 100%;
		height: 400rpx;
	}

	.swiper-box {
		height: 400rpx;
	}



	// .body {
	// 	padding: 10px;
	// }

	.form {
		background: #FFFFFF;
		border: 1px solid #FFFFFF;
		border-radius: 10px;
		padding: 17px 15px;
	}

	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
	}

	.card {
		width: 670rpx;
		height: 230rpx;

	}

	.img {
		width: 180rpx;
		height: 180rpx;
		border: 1px solid #bbb;
		border-radius: 6px;
	}

	.details {
		flex: 1;
		height: 75%;
		padding: 20rpx 20rpx 20rpx 30rpx;
	}

	.border {
		border: 1px solid #D9DDE5;
		margin-right: 10px;
		background: #D9DDE5;
	}

	.flex-center {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.flex-left {
		display: flex;
		justify-content: left;
		align-items: center;
	}

	.flex-column {
		display: flex;
		flex-direction: column;
	}

	.flex-column-center {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}


	.font-middle {
		font-size: 13rpx;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
	}

	.form-item {
		display: flex;
		flex-direction: column;
		justify-content: left;
		margin: 16px 0;

		.input-title {
			font-size: 13px;
			font-weight: 700;
			margin-bottom: 6px;
		}

		.input-text {
			font-size: 15px;
			font-weight: 200;
		}
	}

	.btn {
		margin: 20px 0;
		color: #fff;
		background: linear-gradient(0deg, #c82d2d, #e06363);
	}

	.font-weight-700 {
		font-weight: bold;
		font-size: 20px;
		color: #252630;
	}

	.font-weight-200 {
		font-weight: 200;
		color: #999;
	}

	.logo {
		width: 100%;
	}

	.initLogo {
		left: 50%;
		margin-left: -90rpx;
	}

	.uni-input-input {
	    position: relative;
	    display: block;
	    height: 100%;
	    background: none;
	    color: inherit;
	    opacity: 1;
	    font: inherit;
	    line-height: inherit;
	    letter-spacing: inherit;
	    text-align: inherit;
	    text-indent: inherit;
	    text-transform: inherit;
	    text-shadow: inherit;
	}
</style>
