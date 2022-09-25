<template>
	<view>
		<view class="logistics-content">
			<view class="tit">快递信息</view>
			<view class="logistics-info">
				<view class="logistics-description">快递公司：</view>
				<view class="logistics-cont cursor" >{{emsFirm}}</view>
			</view>
			<view class="logistics-info">
				<view class="logistics-description">快递单号：</view>
				<view class="logistics-cont cursor" @click="copy(emsNumb)">{{emsNumb}}    (点击单号可复制)</view>
			</view>
			<view class="tip" v-if="showReason">{{Reason}}</view>
			 <YSteps :style="YStepsClass" :lineNum='1' color='#fff' backgroundColor='#afafaf' :infoList='list2'></YSteps>
			<view class="kuaidi100">
			</view>
		</view>
	</view>
</template>

<script>
import YSteps from '@/components/Y-Steps/Y-Steps.vue'
	export default {
		components: {
		  YSteps
		},
		data() {
			return {
				Reason:"",
				showReason:false,
				list2:[],
				emsFirm: "", // 快递公司名称
				emsNumb: "", // 快递单号
				YStepsClass:'margin-top: 60rpx;'
			}
		},
		onLoad(option) {
			if(option.emsNumb){
				this.emsNumb = option.emsNumb
				this.emsFirm = option.emsFirm
				let submitData ={
					emsNumb:option.emsNumb,
					emsCode:option.emsCode,
					emp_code:option.emp_code
				}
				this.init(submitData)
			}
			const resWidth = uni.getSystemInfoSync();
			if(resWidth.screenWidth>800){
				this.YStepsClass = 'width: 1200rpx;margin-top: 60rpx;'
			}
		},
		methods: {
			init(submitData){
				this.commHttpRequest('query_user','queyLogistics', submitData, true, (res) => {
					if(res.result){
						if(res.result.Traces==''){
							this.showReason = true
							this.Reason = res.result.Reason
						}else{
						this.list2= res.result.Traces
						this.list2.sort(function(a,b){return Date.parse(b['AcceptTime'])-Date.parse(a['AcceptTime'])})
						}
						}
				})
			},
			// 复制内容
			copy(emsNumb) {
				uni.setClipboardData({
					data: emsNumb,
					success: () => {
						uni.showToast({
							title: '复制成功'
						})
					}
				}) 
			},
			navigateBack() {
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss">
	.uni-title {
		font-weight: 700;
		font-size: 24px;
	}

	.logistics-content {
		padding: 0 15px;

		.cursor {
			cursor: pointer;
		}

		.tit {
			font-weight: 600;
			font-size: 20px;
			margin-top: 20px;
		}

		.logistics-info {
			display: flex;
			margin-top: 10px;

			.logistics-description {
				width: 90px;
				color: #8f9999;
			}
		}

		.kuaidi100 {
			margin-top: 20px;
		}
	}
	.tip{
		margin: 30rpx 10rpx 30rpx;
		color: #8f9999;
		font-size: 16px;
	}
</style>
