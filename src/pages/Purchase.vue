<template>
	<div class="purchase">
		<!-- 头部 -->
		<header-nav>
			<h1 class="top-title">选择购买</h1>
		</header-nav>

		<div class="mui-content">
			<div class="buy-item">
				<div class="music-name">
					<img src="../../static/image/pay_music.png">
					<span class="name">{{goods.Name}}</span>
					<span class="bought" v-if="goods.IsPurchased">已购买</span>
				</div>
				<div class="item-row">
					<span class="price">{{goods.Price | currency("￥")}}</span>
					<div class="btn">
						<button type="button" @click="toConfirmOrder(goods, 0)">购买</button>
						<button type="button" @click="addCart(goods, $event, 0)">加入购物车</button>
					</div>
				</div>
			</div>

			<div class="recommend">
				<div class="recommend-title">包含此曲的专辑</div>
				<ul class="recommend-list">
					<li v-for="(item, index) in goods.Albums" :key="index">
						<div class="music-name">
							<img src="../../static/image/pay_file.png">
							<span class="name">{{item.AlbumTitle}}</span>
							<span class="bought" v-if="item.IsPurchased">已购买</span>
						</div>
						<div class="item-row">
							<span class="price">{{item.AlbumPrice | currency("￥")}}</span>
							<div class="btn">
								<button type="button" @click="toConfirmOrder(item, 1, true)">购买</button>
								<button type="button" @click="addCart(item, $event, 1, true)">加入购物车</button>
							</div>
						</div>
						<div class="sub-list-wrap" v-if="item.Items">
							<span class="mui-icon mui-icon-arrowdown arrow" @click="menuDown(index)"></span>
							<ul :class="['sub-list', {'active': item.isShowSubList}]">
								<li v-for="(item1, index1) in item.Items" :key="index1">
									<img src="../../static/image/pay_music.png">
									<span>{{item1.ItemName}}</span>
								</li>
							</ul>
						</div>
					</li>
				</ul>
			</div>

		</div>
	</div>
</template>

<script>
	import HeaderNav from '../components/HeaderNav.vue'
	import {currency} from '../utils/currency.js'
	import common from '../components/common.js'
	import {LoginCode} from '../mixins/loginCode.js'
	export default {
		name: 'Purchase',
		mixins: [LoginCode],
		data() {
			return {
				goods: {},
				isOpen: true
			}
		},
		components: {
			HeaderNav
		},
		filters: {
			currency
		},
		methods: {
			menuDown(index) {
				let bool = this.goods.Albums[index].isShowSubList
				this.goods.Albums[index].isShowSubList = !bool;
			},
			getRecommendList(id) {
				let formData = new FormData();
				formData.append("QRItemID", parseInt(id));
				if(this.getCode()){
					formData.append("code", this.getCode());
				}
				this.$.post('/QRCodeApi/PurchaseItems', formData)
					.then(res => {
						// alert(JSON.stringify(res.data))
						if(!res) return
						if (res.data && res.data.Status < 0) {
							this.$router.replace({
								path: '/ErrorPage',
								query: {
									message: res.data.Message
								}
							})
						}
						let data = res.data.Data;
						// alert(JSON.stringify(data))
						if(data.Price == 0){
							let self = this;
							let btnArray = ['确认'];
							this.mui.confirm('当前单曲还未开放购买！给您带来不便，敬请谅解！', '提示', btnArray, function(e) {
								if (e.index == 0) {
									self.isOpen = false;
								}
							});
						}
						if(data.Albums && data.Albums.length > 0){
							data.Albums.forEach((item) => {
								if (item.Items) {
									item.isShowSubList = false;
								}
							})
						}

						this.goods = data;
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
			toConfirmOrder(goods, buyType, buyOpen){
				if(!this.isOpen	&& !buyOpen){
					let btnArray = ['确认'];
					this.mui.confirm('当前单曲还未开放购买！给您带来不便，敬请谅解！', '提示', btnArray);
					return
				}
				if(goods.IsPurchased){
					let btnArray = ['确认'];
					this.mui.confirm('当前单曲已购买！', '提示', btnArray);
					return
				}
				//设置预置订单
				let formData = new FormData();
				if(buyType === 0){	//单曲
					formData.append("OrderItems", buyType+"_"+goods.ID);
				}else{	//专辑
					formData.append("OrderItems", 1+"_"+goods.AlbumID);
				}
				if(this.getCode()){
					formData.append("code", this.getCode());
				}
				this.$.post('/QRCodeApi/SetPreOrder',formData )
					.then(res => {
						// alert(JSON.stringify(res.data))
						if(!res) return
						if (res.data && res.data.Status == 0) {
							//跳转结算页
							this.$router.push('/ConfirmOrder')
						}else{
							this.$router.push({
								path: '/ErrorPage',
								query: {
									message: res.data.Message
								}
							})
						}

					})
					.catch((err) => {
						this.$router.push({
							path: '/ErrorPage',
							query: {
								message: '请稍后重试！'
							}
						})
					})
			},
			addCart(goods,e, buyType, buyOpen){
				if(!this.isOpen && !buyOpen){
					let btnArray = ['确认'];
					this.mui.confirm('当前单曲还未开放购买！给您带来不便，敬请谅解！', '提示', btnArray);
					return
				}
				let formData = new FormData();
				if(buyType === 0){	//0 单曲
					formData.append("BuyType", buyType);
					formData.append("ID", goods.ID);
					formData.append("RemoteID", goods.RemoteID);
				}else{	//1 专辑
					formData.append("BuyType", 1);
					formData.append("ID", goods.AlbumID);
				}
				if(this.getCode()){
					formData.append("code", this.getCode());
				}
				this.$.post('/Member/AddToCart', formData)
					.then(res => {
						if(!res) return
						if (res.data && res.data.Status < 0) {
							if(res.data.Status == -1){	//已在购物车
								let btnArray = ['确认'];
								this.mui.confirm(res.data.Message, '提示', btnArray);
								e.target.classList.add('active')
								return
							}
							this.$router.push({
								path: '/ErrorPage',
								query: {
									message: res.data.Message
								}
							})
						}else{
							//更新下标
							common.$emit('updateCartNum')
						}

					})
					.catch((err) => {
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
			this.getRecommendList(this.$route.params.id)
		}
	}
</script>

<style scoped>
	.purchase{
		height: 100%;
	}
	.mui-content {
		min-height: 100%;
		padding: 1rem .27rem 1.8rem;
		background-color: transparent;
	}

	.mui-content .buy-item {
		background-color: #f2f2f2;
		border-radius: .1rem;
		padding: .25rem .07rem;
		margin-top: .3rem;
	}

	.purchase .mui-content .music-name {
		display: flex;
		align-items: center;
		justify-content: start;
	}

	.purchase .mui-content .music-name>img {
		height: .29rem;
		width: .28rem;
		margin-left: .14rem;
	}

	.purchase .mui-content .music-name .name {
		color: #000;
		opacity: .97;
		font-size: .25rem;
		margin-left: .1rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.mui-content .bought {
		display: block;
		width: .95rem;
		height: .35rem;
		line-height: .35rem;
		text-align: center;
		background-color: #d2aa6f;
		border-radius: .1rem;
		color: #fff;
		font-size: .24rem;
		margin-left: .1rem;
	}

	.mui-content .item-row {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.1rem;
		margin-top: 0.1rem;
	}

	.mui-content .item-row .price {
		margin-left: 0.2rem;
		color: #c35b58;
		vertical-align: middle;
	}

	.mui-content .item-row .btn {
		flex: 1;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}



	.mui-content .item-row .btn>button {
		width: auto;
		height: auto;
		padding: 0.1rem;
		color: #FFFFFF;
		background-color: #d2aa6f;
		margin: 0;
		font-size: 0.26rem;
		/* outline: none; */
		border: none;
	}

	.mui-content .item-row .btn>button:nth-child(1) {
		margin-right: 0.3rem;
	}

	.mui-content .item-row .btn>button.active {
		background-color: gray;
	}

	.mui-content .recommend {
		margin-top: 0.5rem;
	}

	.mui-content .recommend .recommend-title {
		width: 96%;
		margin: auto;
		font-size: 0.26rem;
		border-bottom: 0.01rem solid #333;
	}

	.mui-content .recommend .recommend-list>li {
		padding: 0.2rem;
		margin-top: 0.3rem;
		background-color: #f2f2f2;
	}

	.mui-content .recommend .recommend-list .sub-list-wrap .arrow {
		color: #d2aa6f;
		font-size: .6rem;
		opacity: 1;
		display: block;
		text-align: center;
	}

	.mui-content .recommend .recommend-list .sub-list-wrap .sub-list {
		height: 0;
		overflow: hidden;
	}

	.mui-content .recommend .recommend-list .sub-list-wrap .sub-list.active {
		height: auto;
	}

	.mui-content .recommend .recommend-list .sub-list li {
		border-bottom: 1px solid #888b8b;
		padding: .27rem .13rem;
		display: flex;
		align-items: center;
		font-size: 0.25rem;
	}

	.mui-content .recommend .recommend-list .sub-list li>img {
		width: .22rem;
		height: .23rem;
		margin-right: .1rem;
	}
</style>
