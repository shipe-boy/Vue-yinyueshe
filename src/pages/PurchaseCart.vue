<template>
	<div style="height: 100%;">
		<!-- 头部 -->
		<header-nav>
			<h1 class="top-title">购物车</h1>
			<span class="delete-all" @click="delGoods">删除</span>
		</header-nav>

		<div v-if="goodsList.length !== 0" class="mui-content">
			<ul class="record-list">
				<li v-for="(item, index) in goodsList" :key="index" :class="{'files': item.SubItems}">
					<div class="music-name">
						<img v-if="item.BuyType == 0" src="../../static/image/pay_music.png">
						<img v-if="item.BuyType == 1" src="../../static/image/pay_file.png">
						<span class="name">{{item.Name}}</span>
						<span v-if="item.IsPurchased" class="bought">已购买</span>
						<span class="mui-icon mui-icon-trash delete" @click="delDoodsOne(item)"></span>
					</div>
					<div class="mui-input-row mui-checkbox mui-left">
						<label><span v-if="item.SubItems" class="total-num">{{item.SubItems.length}}首</span>￥<span class="unit-price">{{item.Price}}</span></label>
						<input name="unit-price" v-model="item.checked" type="checkbox" class="choice">
					</div>
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
			<div class="amount">
				<div class="mui-input-row mui-checkbox mui-left">
					<label>全选</label>
					<input v-model="checkedAllFlag" name="checkbox2" type="checkbox" @click="checkedAll">
				</div>
				<p class="total-parice">合计：<span>￥{{totalPrice}}</span></p>
				<a href="javascript:;" class="submit" @click="toPay">去结算</a>
			</div>
		</div>
		<div v-if="goodsList.length === 0 && !isEmpty" class="loading">
			<img src="../assets/loading-svg/loading-spining-bubbles.svg" />
		</div>
		<div v-if="isEmpty" class="mui-content">
			<div class="is-empty">
				购物车里没有商品！
			</div>
		</div>
	</div>
</template>

<script>
	import HeaderNav from '../components/HeaderNav.vue'
	import common from '../components/common.js'
	import {
		LoginCode
	} from '../mixins/loginCode.js'
	export default {
		name: 'PurchaseCart',
		mixins: [LoginCode],
		data() {
			return {
				goodsList: [],
				isEmpty: false
			}
		},
		components: {
			HeaderNav
		},
		computed: {
			checkedCount() { //选择的数量
				let num = 0;
				this.goodsList.forEach(item => {
					if (item.checked == 1) num++;
				})
				return num
			},
			checkedAllFlag: { //是否全选
				get() {
					return this.checkedCount == this.goodsList.length;
				},
				set(val) {
					return val
				}

			},
			totalPrice() { //总价
				let money = 0;
				this.goodsList.forEach(item => {
					if (item.checked == 1) {
						money += parseFloat(item.Price)
					}
				})
				return money
			}
		},
		methods: {
			menuDown(index) { //下拉菜单
				let bool = this.goodsList[index].isShowSubList
				this.goodsList[index].isShowSubList = !bool;
			},
			checkedAll() { //全选按钮
				// console.log("....")
				let flag = !this.checkedAllFlag;
				this.goodsList.forEach(item => {
					item.checked = flag;
				})

			},
			delGoods() { //右上角删除商品
				let self = this;
				var btnArray = ['确认', "取消"];
				this.mui.confirm('确认从购物车里移除这些商品吗？', '购物车', btnArray, function(e) {
					if (e.index == 0) {
						self.goodsList.forEach((item, index) => {
							if (item.checked == 1) {
								self.getDelGoods(item.CartID)
							}
						})
					}
				});

			},
			delDoodsOne(item) { //单个商品点击删除
				let self = this;
				var btnArray = ['确认', "取消"];
				this.mui.confirm('确认从购物车里移除该商品吗？', '购物车', btnArray, function(e) {
					if (e.index == 0) {
						self.getDelGoods(item.CartID)
					}
				});
			},
			getDelGoods(id) {
				let formData = new FormData();
				formData.append("CartID", parseInt(id));
				if (this.getCode()) {
					formData.append("code", this.getCode());
				}
				this.$.post('/Member/DelToCart', formData)
					.then(res => {
						if (!res) return
						if (res.data && res.data.Status < 0) {
							this.$router.push({
								path: '/ErrorPage',
								query: {
									message: res.data.Message
								}
							})
						} else { //成功
							this.getGoodsList()
							common.$emit('updateCartNum')
						}
					})
					.catch(err => {
						this.$router.push({
							path: '/ErrorPage',
							query: {
								message: '请稍后重试！'
							}
						})
					})
			},
			getGoodsList(goodsArr) {
				//发请求
				let formData = new FormData();
				if (this.getCode()) {
					formData.append("code", this.getCode());
				}
				this.$.post('/QRCodeApi/LoadCarts', formData)
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
						let data = res.data.Data;
						data.forEach((item) => {
							this.$set(item, "checked", false)
							if (item.SubItems) {
								this.$set(item, "isShowSubList", false)
							}
						})
						this.goodsList = data;
						this.isEmpty = this.goodsList.length == 0
					})
					.catch(err => {
						// alert(err)
						this.$router.replace({
							path: '/ErrorPage',
							query: {
								message: '请稍后重试！'
							}
						})
					})
			},
			toPay() { //去结算
				if (this.checkedCount == 0) {
					let self = this;
					var btnArray = ['确认'];
					this.mui.confirm('您还没有选择商品！', '提示', btnArray, function(e) {
						if (e.index == 0) {
							// self.isPost = true;
						}
					});
					return
				}
				let orderItems = [];
				this.goodsList.forEach(item => {
					if (item.checked == 1 && !item.IsPurchased) {
						let arrItem = "";
						arrItem = 2 + "_" + item.CartID;
						orderItems.push(arrItem)
					}
				})

				let formData = new FormData();
				formData.append("OrderItems", orderItems.join('|'));
				if (this.getCode()) {
					formData.append("code", this.getCode());
				}
				//预置订单
				this.$.post('/QRCodeApi/SetPreOrder', formData)
					.then(res => {
						if (!res) return
						if (res.data && res.data.Status == 0) {
							this.$router.push('/ConfirmOrder')
						} else {
							this.$router.push({
								path: '/ErrorPage',
								query: {
									message: res.data.Message
								}
							})
						}

					})
					.catch(err => {
						this.$router.push({
							path: '/ErrorPage',
							query: {
								message: '请稍后重试！'
							}
						})
					})
			}
		},
		mounted() {
			this.getGoodsList()
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
		background: url(../../static/image/bookIntr_bg.png) no-repeat bottom/contain fixed;
	}

	.mui-content .is-empty {
		font-size: 0.3rem;
		text-align: center;
		margin-top: 0.5rem;
	}

	.record-list {
		overflow-y: auto;
		height: 100%;
	}

	.record-list>li {
		background-color: #f2f2f2;
		border-radius: .1rem;
		padding: .25rem .07rem;
		margin-bottom: .3rem;
	}

	.record-list .music-name {
		display: flex;
		align-items: center;
	}

	.record-list .music-name>img {
		height: .29rem;
		width: .28rem;
		margin-left: .14rem;
	}

	.record-list .music-name .name {
		color: #000000;
		opacity: 0.97;
		font-size: .25rem;
		margin-left: .1rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.record-list .music-name .bought {
		display: block;
		width: .95rem;
		height: .35rem;
		line-height: .35rem;
		text-align: center;
		background-color: #d2aa6f;
		border-radius: .1rem;
		color: #fff;
		font-size: .24rem;
	}

	.record-list .mui-icon {
		font-size: .5rem;
		color: #535353;
		flex: 1;
		text-align: right;
	}

	.record-list li label {
		color: #c35b58;
		font-size: .27rem;
		font-weight: bold;
		line-height: .31rem;
	}

	.record-list label .total-num {
		color: #000;
		font-weight: 400;
		margin: 0 .36rem 0 .19rem;
	}

	.mui-checkbox.mui-left label {
		padding: .11rem .15rem .11rem .58rem;
	}

	.mui-checkbox input[type='checkbox'] {
		width: .31rem;
		height: .31rem;
		line-height: .31rem;
		top: 50%;
		transform: translateY(-65%);
		right: .2rem;
	}

	.mui-checkbox.mui-left input[type='checkbox'] {
		left: .2rem;
	}

	.mui-content .mui-checkbox input[type='checkbox']:before {
		font-size: .3rem;
	}

	.mui-checkbox input[type=checkbox]:checked:before {
		color: #d2aa6f;
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

	.record-list .files li {
		border-bottom: 1px solid #888b8b;
		padding: .27rem .13rem;
		display: flex;
		align-items: center;
		display: flex;
		align-items: center;
	}

	.record-list .files li:last-child {
		border-bottom: 0;
	}

	.files li>span {
		font-size: .25rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.files>img {
		width: .25rem;
		height: .23rem;
	}

	.files li>img {
		width: .22rem;
		height: .23rem;
		margin-right: .1rem;
	}

	.mui-content .amount {
		background: #fff;
		display: flex;
		align-items: center;
		width: 100%;
		padding: .2rem 0 .2rem .3rem;
		box-sizing: border-box;

		position: fixed;
		bottom: 1.5rem;
		left: 0;
	}

	.mui-content .amount label {
		color: #000000;
		opacity: 0.97;
		font-size: .26rem;
		line-height: .31rem;
	}

	.mui-content .amount .total-parice {
		color: #313131;
		opacity: 0.97;
		font-size: .26rem;
		flex: 1;
		text-indent: .4rem;
	}

	.mui-content .amount .total-parice>span {
		color: #c35b58;
		font-size: .33rem;
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
		margin-right: .67rem;
	}

	.mui-content .amount .submit.disable {
		background-color: gray;
	}

	div.loading {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	div.loading>img {
		width: 1rem;
		height: 1rem;
	}
</style>
