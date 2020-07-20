<template>
	<div class="success-order">
		<!-- 头部 -->
		<header-nav>
			<h1 class="top-title">购买成功</h1>
		</header-nav>
		<!-- 内容 -->
		<div class="mui-content">
			<div class="tips">
				<i class="icon-bg"></i>
				<span>购买成功</span>
			</div>
			<div class="order">
				<p><span>订单号：</span>{{orderId}}</p>
				<p class="order-rmb"><span>订单金额：</span>{{orderPrice | currency("")}}<span class="rmb">元</span></p>
			</div>
			<button type="button" @click="changeRoute(false)">查看订单详情</button>
			<button v-if="isBackBookInfo" type="button" @click="changeRoute(true)">返回产品</button>
		</div>
	</div>
</template>

<script>
	import HeaderNav from '../components/HeaderNav.vue'
	import {LoginCode} from '../mixins/loginCode.js'
	import {
		currency
	} from '../utils/currency.js'
	export default {
		name: 'SuccessOrder',
		mixins: [LoginCode],
		data() {
			return {
				orderId: '',
				orderPrice: 0,
				orderObj: {},
				isBackBookInfo: false,
				timer: null,
				ajaxTimes: 0
			}
		},
		filters: {
			currency
		},
		components: {
			HeaderNav
		},
		methods: {
			changeRoute(isBookInfo) {
				if (isBookInfo) { //返回产品
					if (this.isBackBookInfo) {
						this.$router.push({
							name: 'BookInfo',
							params: {
								id: this.orderObj.OrderMemo
							}
						})
					} else {
						this.$router.push({
							path: '/PurchaseCart'
						})
					}
					// this.$router.go(-2)
				} else { //购买记录
					this.$router.push({
						path: '/PayRecord'
					})
				}
			},
			getOrderSuccess() {
				let formData = new FormData();
				formData.append("PreOrderID", this.orderId);
				if(this.getCode()){
					formData.append("code", this.getCode());
				}
				this.$.post('/QRCodeApi/OrderSuccess', formData)
					.then(res => {
						if(!res) return
						// status=-1是等待支付结果，需要等下再跳转，status=-8则是付款出错
						// alert(JSON.stringify(res))
						clearTimeout(this.timer)
						this.ajaxTimes++;
						if (this.ajaxTimes > 5) {
							location.replace('https://e.yuehi.cc/page/#/ErrorPage?message=订单异常！')
							// this.$router.replace({
							// 	path: '/ErrorPage',
							// 	query: {
							// 		message: "订单异常！"
							// 	}
							// })
						}

						if (res.data && res.data.Status == -1) {
							location.replace('https://e.yuehi.cc/page/#/ErrorPage?message=' + res.data.Message)
							// this.$router.replace({
							// 	path: '/ErrorPage',
							// 	query: {
							// 		message: res.data.Message
							// 	}
							// })
						} else if (res.data && res.data.Status == -2) {
							//再调接口

							this.timer = setTimeout(() => {
								this.getOrderSuccess()
							}, 2000)
						}
						
						this.orderObj = res.data.Data || {};
						if(this.orderObj.OrderID && this.orderObj.TotalAmount ){
							if (this.orderObj.OrderMemo > 0) {
								this.isBackBookInfo = true
							}
							this.orderId = this.orderObj.OrderID
							this.orderPrice = this.orderObj.TotalAmount
						}else{
							location.replace('https://e.yuehi.cc/page/#/ErrorPage?message=无法退回支付页面')
						}
					})
					.catch(err => {
						clearTimeout(this.timer)
						// alert(err)
						location.replace('https://e.yuehi.cc/page/#/ErrorPage?message=请稍后重试')
						// this.$router.replace({
						// 	path: '/ErrorPage',
						// 	query: {
						// 		message: '请稍后重试'
						// 	}
						// })
					})
			}
		},
		mounted() {
			this.orderId = this.$route.query.orderID
			this.orderPrice = this.$route.query.orderPrice
			this.getOrderSuccess()
		}
	}
</script>

<style scoped>
	.success-order {
		height: 100%;
		background-color: #fff;
	}

	.mui-content {
		min-height: 100%;
		overflow: hidden;
		padding: 0.8rem 0 1.4rem;
		background-color: #fff;
	}

	.mui-content .tips {
		width: 96%;
		height: 1rem;
		margin: 0.6rem auto 0;
		color: #fff;
		font-size: .42rem;
		background-color: #f2f2f2;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0.05rem;
	}

	.mui-content .tips .icon-bg {
		display: inline-block;
		width: 0.4rem;
		height: 0.4rem;
		margin-right: 0.3rem;
		background: url(../../static/image/ok.png) no-repeat center/contain;
	}

	.mui-content .tips>span {
		color: #2AC845;
	}

	.mui-content .order {
		width: 96%;
		margin: 0.2rem auto 0.5rem;
		padding: 0.3rem 0;
		background-color: #f2f2f2;
	}

	.mui-content .order>p {
		padding: 0.1rem 0.3rem;
		font-size: .36rem;
		color: #000000;
	}

	.mui-content .order>p>span {
		display: inline-block;
		width: 2rem;
		text-align: right;
		margin-right: 0.2rem;
		color: #000000;
	}

	.mui-content .order>p>span.rmb {
		text-align: left;
		width: auto;
		color: #000000;
	}

	.mui-content .order>p.order-rmb {
		color: #c35b58;
	}

	.mui-content button {
		display: block;
		width: 4.95rem;
		height: .8rem;
		background-color: #d2aa6f;
		border-radius: .1rem;
		color: #fff;
		font-size: .36rem;
		border: none;
		margin: 0.3rem auto 0;
	}
</style>
