<template>
	<div style="height: 100%;">
		<!-- 头部 -->
		<header-nav>
			<h1 class="top-title">结算</h1>
		</header-nav>

		<div class="mui-content">
			<template v-if="goodsList && goodsList.length !== 0">
				<ul class="record-list">
					<li v-for="(item, index) in goodsList.Items" :key="index" :class="{'files': item.SubItems}">
						<img v-if="item.BuyType == 1" src="../../static/image/pay_file.png">
						<img v-if="item.BuyType == 0" src="../../static/image/pay_music.png">
						<span>{{item.Name}}</span>
						<p class="unit-price"><span>{{item.Price | currency("￥")}}</span></p>
						<template v-if="item.SubItems">
							<span class="mui-icon mui-icon-arrowdown arrow" @click="menuDown(index)"></span>
							<ul :class="['group-list', {'active': item.isShowSubList}]">
								<li v-for="(item1, index1) in item.SubItems" :key="index1">
									<img v-if="item1.BuyType == 0" src="../../static/image/pay_music.png">
									<img v-if="item1.BuyType == 1" src="../../static/image/pay_file.png">
									<span>{{item1.Name}}</span>
								</li>
							</ul>
						</template>

					</li>
				</ul>
				<div class="tips" v-html="goodsList.OrderMemo">
				</div>
				<h3>支付方式：微信支付</h3>
				<div class="amount">
					<span class="pay">应付金额：</span>
					<span class="total-parice">{{goodsList.TotalAmount | currency("￥")}}</span>
					<a href="javascript:;" class="submit" @click="payOrder">提交订单</a>
				</div>
			</template>
			<template v-else>
				<h2>空空如也</h2>
			</template>
		</div>
	</div>
</template>

<script>
	import common from '../components/common.js'
	import HeaderNav from '../components/HeaderNav.vue'
	import {
		currency
	} from '../utils/currency.js'
	import {
		LoginCode
	} from '../mixins/loginCode.js'
	export default {
		name: "ConfirmOrder",
		mixins: [LoginCode],
		data() {
			return {
				goodsList: {},
				wxJson: {}, //微信哦呢支付参数
				orderID: '' //订单号
			}
		},
		filters: {
			currency
		},
		components: {
			HeaderNav
		},
		methods: {
			menuDown(index) { //下拉菜单
				let bool = this.goodsList.Items[index].isShowSubList
				this.goodsList.Items[index].isShowSubList = !bool;
			},
			getConfirmOrder() { //获取商品
				let formData = new FormData();
				if (this.getCode()) {
					formData.append("code", this.getCode());
				}
				this.$.post('/QRCodeApi/GetPreOrder')
					.then(res => {
						// alert(JSON.stringify(res.data.Data))
						if (!res) return
						if (res.data && res.data.Status < 0) {
							this.$router.replace({
								path: '/ErrorPage',
								query: {
									message: res.data.Message
								}
							})
						}
						let data = res.data.Data;
						data.Items.forEach((item) => {
							if (item.SubItems) {
								this.$set(item, 'isShowSubList', false)
							}
						})
						this.goodsList = data;

					})
					.catch(err => {
						this.$router.replace({
							path: '/ErrorPage',
							query: {
								message: '请稍后重试！'
							}
						})
					})
			},
			payOrder() { //提交订单
				let formData = new FormData();
				formData.append("OrderKey", this.goodsList.DataKey);
				formData.append("OrderAmount", this.goodsList.TotalAmount);
				formData.append("Sign", this.goodsList.Sign);
				formData.append("UniqueCode", this.goodsList.GUID);
				if (this.getCode()) {
					formData.append("code", this.getCode());
				}

				this.$.post('/Member/ToCreatePreOrderJson', formData)
					.then(res => {
						if (!res) return
						if (res.data && res.data.Status < 0) {
							this.$router.replace({
								path: '/ErrorPage',
								query: {
									message: res.data.Message
								}
							})
						}
						// alert(JSON.stringify(res.data.Data))
						/* {
							PreOrderID: 5061,
							WxPayJson: {
								appId: "wxf6a0e5719fdddb26",
								nonceStr: '3423991189',
								package:'prepay_id=wx111432379201259d4e46df1e1822838100',
								paySign: "14c8a8629cd52d324f2fe719b5f4971f",
								signType: "MD5",
								timeStamp:'1583879557'
							}
						} */
						this.orderID = res.data.Data.PreOrderID;
						this.wxJson = res.data.Data.WxPayJson;
						//微信支付
						if (typeof WeixinJSBridge == "undefined") { //微信特有字段
							if (document.addEventListener) {
								document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
							} else if (document.attachEvent) {
								document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
								document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
							}
						} else {
							this.onBridgeReady();
						}
					})
					.catch((err) => {
						this.$router.replace({
							path: '/ErrorPage',
							query: {
								message: '请稍后重试！'
							}
						})
					})
			},
			onBridgeReady() { //微信支付
				let self = this;
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest', JSON.parse(this.wxJson),
					function(res) {
						if (res.err_msg == "get_brand_wcpay_request:ok") {
							// 使用以上方式判断前端返回,微信团队郑重提示：
							//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
							// alert(JSON.stringify(res))
							common.$emit('updateCartNum')
							// https://e.yuehi.cc/page/#/SuccessOrder          https://etest.yuehi.cc/Page/
							location.replace('https://e.yuehi.cc/page/#/SuccessOrder?orderID=' + self.orderID + '&orderPrice=' + self.goodsList
								.TotalAmount)
							// self.$router.replace({
							// 	path: '/SuccessOrder',
							// 	query: {
							// 		orderID: self.orderID,
							// 		orderPrice: self.goodsList.TotalAmount
							//            // bookID: self.$route.query.bookID
							// 	}
							// })
						} else {
							self.$router.push({
								path: '/ErrorPage',
								query: {
									message: "支付失败！"
								}
							})
						}
					});
			}
		},
		mounted() {
			this.getConfirmOrder()
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.mui-content {
		min-height: 100%;
		background: #fff;
		padding: 1rem .27rem 2.27rem;
		height: 100vh;
		overflow: auto;
		position: relative;
		/* background: url(../../static/image/bookIntr_bg.png); */
	}

	.record-list {
		width: 100%;
		margin-bottom: .36rem;
	}

	.record-list>li {
		width: 100%;
		background-color: #f2f2f2;
		border-radius: .1rem;
		padding: .25rem .07rem;
		margin-top: .3rem;
	}

	.record-list li img {
		height: .25rem;
		width: .25rem;
		margin-left: .1rem;
		vertical-align: middle;
	}

	.record-list li span {
		color: #000000;
		opacity: 0.97;
		font-size: .25rem;
	}

	.record-list li .unit-price {
		color: #c35b58;
		font-size: .27rem;
		line-height: .6rem;
		font-weight: bold;
		text-indent: .58rem;
	}

	.record-list .unit-price>span {
		color: #c35b58;
		font-size: .27rem;
		line-height: .6rem;
		font-weight: bold;
		text-indent: .58rem;
	}

	.record-list .files .arrow {
		color: #d2aa6f;
		font-size: .6rem;
		opacity: 1;
		display: block;
		text-align: center;
	}

	.files .group-list {
		height: 0;
		overflow: hidden;
	}

	.files .group-list.active {
		height: auto;
	}

	.files .group-list li:last-child {
		padding-bottom: 0;
	}

	.record-list .files li {
		border-bottom: 1px solid #888b8b;
		padding: .27rem 0;
	}

	.record-list .files li:last-child {
		border-bottom: 0;
	}

	.files li>span {
		font-size: .25rem;
	}

	.files>img {
		width: .25rem;
		height: .23rem;
	}

	.files li>img {
		width: .22rem;
		height: .23rem;
	}

	.mui-content .tips {
		color: #c35b58;
		font-size: .26rem;
		line-height: .4rem;
	}

	.mui-content>h3 {
		color: #313131;
		font-size: .26rem;
		margin: .9rem 0;
	}

	.mui-content .amount {
		background: #fff;
		display: flex;
		align-items: center;
		width: 100%;
		padding: .2rem 0 .2rem .3rem;
		box-sizing: border-box;
		position: fixed;
		bottom: 1.36rem;
		left: 0;
	}

	.mui-content .amount .pay {
		color: #000;
		font-size: .25rem;
	}

	.mui-content .amount .total-parice {
		color: #c35b58;
		font-size: .3rem;
		flex: 1;
		text-indent: .7rem;
		font-weight: bold;
	}

	.mui-content .amount .submit {
		width: 2.2rem;
		height: .61rem;
		line-height: .61rem;
		text-align: center;
		background-color: #d2aa6f;
		border-radius: .1rem;
		font-size: .24rem;
		color: #fff;
		font-weight: bold;
		margin-right: .2rem;
	}
</style>
