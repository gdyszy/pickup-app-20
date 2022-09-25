<template>
		<view class="scrapingCard">
			<view id="content">{{text}}</view>
			<canvas v-if="showcanvas" id="canvas" @touchmove="touchmove" @touchstart="touchstart" @touchend="touchend" @touchcancel="touchend" canvas-id="canvas" type="2d"></canvas>
		</view>
</template>

<script>
	export default {
		data() {
			return {
				text: '卡号错误',
				nocardtext:'',
				query: {},
				isDraw: false,
				ctx: {},
				width: '',
				height: '',
				showcanvas:true,
				computing : false ,
				complete : false ,
				reset : false ,
				ready : false ,
			};
		},
		props: {
			resultList: {
				 type: Object
			},
			percentage : { //刮开百分之多少的时候算刮开
				type : Number ,
				default : 45 
			},
		},
		mounted() {
			this.ctx = uni.createCanvasContext('canvas')
			this.query = uni.createSelectorQuery().in(this);
			this.query.select('.scrapingCard #content').boundingClientRect(data => {
				this.height = data.height
				this.width = data.width
				this.init()
			}).exec();
		},
		watch: {
			resultList(newVal) {
				this.resultList=newVal
				this.init()
			},
			
		},
		methods: {
			init () {
				this.computing = false ;
				this.complete = false ;
				this.reset = false ;
				this.ready = false ;
				this.formatData()
				this.ctx.globalCompositeOperation = 'source-over'
				this.ctx.setFillStyle('#C3C3C0')
				this.ctx.fillRect(0, 0, this.width, this.height)
				this.ctx.setFontSize(20)
				this.ctx.draw(false)
			},
			touchstart () {
				this.isDraw = true
			},
			touchmove (e) {
				if (this.isDraw) {
					var { x, y } = e.changedTouches[0]
					if (x >= 0 && y >= 0) {
						this.ctx.globalCompositeOperation = 'destination-out'
						this.ctx.arc(x, y, 12, 0, 2 * Math.PI)
						this.ctx.fill()
						this.ctx.draw(true)
					}
					this.getFilledPercentage();
				}
			},
			touchend () {
				this.isDraw = false
			},
			formatData () {
				if(this.resultList.state==3||this.resultList.isScratch==2){//已使用，不显示蒙层
					this.showcanvas =false
				}
				if(this.resultList.state==2||this.resultList.state==3){
					this.text = this.resultList.pwd
					return
				}else{
					if(this.resultList.state){
						this.text = this.local_state(this.resultList.state)
					}
				return	
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
				} else if (index == 8) {
					return '提货中'
				}
			},
			getFilledPercentage:function(e){
				if (this.computing) {
					return ;
				}
				this.computing = true ;
				uni.canvasGetImageData({
					canvasId: 'canvas' ,
					x: 0,
					y: 0,
					width: this.width ,
					height: this.height ,
					success: (res) => {
						let pixels = res.data;
						let transPixels = [];
						for (let i = 0; i < pixels.length; i += 4) {
							if (pixels[i + 3] < 128) {
								transPixels.push(pixels[i + 3]);
							}
						}
						var percent = (transPixels.length / (pixels.length / 4) * 100).toFixed(2);
						if( percent >= this.percentage ){						
							this.success();
						}
						this.computing = false ;
					},
					fail : function(e){
					},
				}, this);
			},
			
			success : function(e){
				this.complete = true ;
				if (this.reset) {
					return ;
				}
				this.reset = true ;
				this.ctx.moveTo(0, 0);
				this.ctx.clearRect(0,0, this.width, this.height);
				this.ctx.stroke() ;
				this.ctx.draw(true);
				this.$emit("complete",{});
			},
			
			
		}
	}
</script>

<style lang="scss">
	.scrapingCard {
		position: relative;
		#content{
			padding: 0rpx 32rpx 40rpx 4rpx;
			height: 60rpx;
			width: 100%;
			text-align: center;
			line-height: 100rpx;
			color: #000000;
			font-size: 24px;
		}
		#canvas{
			position: absolute;
			left: 0;
			top: 0;
			z-index: 99;
			width: 100%;
			height: 220rpx;
		}
		border: 1px solid #8f9999;
		border-radius: 4px;
	}

</style>
