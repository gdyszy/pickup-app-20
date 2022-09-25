<template>
	<view style="display: flex;flex-direction: row;height: 27px;">
		<view class="food-control">
			<view class="cont" style="margin-top: 2px;" @click="decreaseCart(goods)" v-show="goods.chooseNumb>0">
				<image src="/static/des.png" mode="" style="width: 20px;height: 20px;"></image>
			</view>
			<input type="number" maxlength="3"
					style="margin: 0 2px;width: 36px;padding: 0 1px;border: 1px solid #C8C7CC;border-radius: 3px;" v-show="goods.chooseNumb>0"
					v-model="goods.chooseNumb"  @input="inputCart(goods)"/>
		</view>
		<view style="flex: 1;margin-top: 2px; " class="cont" @click="addCart(goods)">
			<image src="/static/add2.png" style="width: 20px;height: 20px;color: #CCCCCC;" mode=""></image>
		</view>
	</view>
</template>

<script>
	// import Vue from 'vue'
	export default {
		props: {
			goods: {
				type: Object,
			}
		},
		data() {
			return {
			};
		},
		methods: {
			addCart: function(item) {
				if (item.chooseNumb >= item.exchangeLimit) {
					this.show_nativeUI_toast("已超过可兑换上限~", "error");
					return false;
				}else{
					this.$emit('add',item)
				}
				
			},
			decreaseCart(item) {
				this.$emit('dec',item)
			},
			inputCart(item) {
				if (Number(item.chooseNumb) >= item.exchangeLimit) {
					this.show_nativeUI_toast("已超过可兑换上限~", "error");
					item.chooseNumb=1
					this.$emit('input', item)
					return false;
				} else {
					this.$emit('input', item)
				}
			
			}
		}
	}
</script>

<style scoped>
	.food-control {
		display: flex;
		flex: 1;
		justify-content: space-around;
	}

	.cont {
		width: 22px;
		height: 22px;
		box-sizing: border-box;
		border-radius: 50%;
		text-align: center;
	}
</style>
