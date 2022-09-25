<script>
	export default {
		globalData: {
		},
		onLaunch: function() {
			let  emp_code = this.$route.query.emp_code?this.$route.query.emp_code:''
			return emp_code
			// console.log('App Launch:'+this.$route.query.emp_code)
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
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
	.btn-noSelect {
		width: 100%;
		margin-top: 20px;
		border-radius: 4px;
		background: #AAADB4;
		color: #FFFFFF;
	}
	
	.btn-Select {
		width: 100%;
		margin-top: 20px;
		border-radius: 4px;
		background: #c79a68;
		color: #FFFFFF;
	}
	
	.btn_OK {
		width: 100%;
		margin-top: 20px;
		border-radius: 4px;
		background: #c79a68;
		color: #FFFFFF;
	}
	
	.btn_Not {
		width: 100%;
		margin-top: 20px;
		border-radius: 4px;
		background: #d9b58c;
		color: #FFFFFF;
	}
</style>
