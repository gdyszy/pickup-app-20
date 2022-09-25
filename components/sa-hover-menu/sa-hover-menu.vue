<!-- 
	name: 悬浮菜单
	version: v0.0.1
	update_time: 2020-6-25 
 -->
<template>
	<view>
		<!-- 遮罩 -->
		<view class="mask" v-if="show" @tap="show = false" @touchmove.stop.prevent></view>
		<!-- 按钮 -->
		<view class="major-box" :class="{show: show}" :style="{top: top + 'px' }" >
			<view class="click-btn" @tap="touchstart">
				<view>在线</view>
				<view>客服</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			show: false ,// 是否显示
			top: 480,	// 顶端距离 
			deviationTop: 0,	// 偏移量
			windowHeight: uni.getSystemInfoSync().windowHeight,	// 视图高度 
		};
	},
	methods: {
		// 点击按钮 
		clickBtn: function(btn) {
			console.log('点击了：' + btn.text);
		},
		// 上下拖动时 
		touchstart: function(e) {
						wx.openCustomerServiceChat({
						  extInfo: {url: this.$extInfoUrl},
						  corpId: this.$corpId,
						  success(res) {
						  }
						})
		},
	}
};
</script>

<style>
	/* 遮罩 */
	.mask {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 10000;
		background: rgba(0, 0, 0, 0.4);
	}
	/* 总盒子 */
	.major-box {
		border: 1px 0 solid;
		z-index: 10001;
		position: fixed;
		width: 100%;
		/* height: 0px; */
		left: 650rpx;
		transition: left 0.5s;
		overflow: hidden;
	}
	.click-btn,
	.nav-box {
		float: left;
	}
	/* 按钮样式 */
	.nav-box{
		background-color: #FFF;
		border-radius: 0 0 0 5px;
	}
	.click-btn {
		width: 100rpx;
		background-color: #fe6d34;
		color: #fff;
		font-size: 10px;
		text-align: center;
		border-radius: 100rpx 0 0 100rpx;
		line-height: 12px;
		padding: 5px 0;
	}
	.click-btn view {
		padding-left: 15rpx;
	}

	/* 按钮盒子 */
	.nav-box {
		width: 500rpx;
		padding: 30rpx 20rpx 20rpx 20rpx;
		display: flex;
		flex-wrap: wrap;
		text-align: center;
		justify-content: center;
	}
	.nav-btn {
		flex: 1;
		border: 0px #000 solid;
		min-width: 150rpx;
		padding: 12rpx 0;
		padding-bottom: 20rpx;
	}
	.nav-icon {
		width: 80rpx;
		height: 80rpx;
		line-height: 80rpx;
		display: inline-block;
		font-size: 15px;
		border-radius: 50%;
		background-color: #666;
		color: #fff;
	}
	.nav-text {
		font-size: 12px;
		font-weight: bold;
		margin-top: 8rpx;
	}
</style>
