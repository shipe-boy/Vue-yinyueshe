<template>
	<div style="height: 100%;">
		<!-- 头部 -->
		<header-nav>
			<h1 class="top-title">购买记录</h1>
		</header-nav>


		<div v-if="payList.length !== 0" class="mui-content">
			<div v-for="(item, index) in payList" :key="index">
				<div class="time-totalprice">
					<span>{{item.CreateDate}}</span>
					<p>总计：￥<span>{{item.TotalAmount}}</span></p>
				</div>
				<ul class="record-list">
					<li v-for="(item1, index1) in item.Items" :key="index1" :class="{'files': item1.SubItems}">
						<img v-if="item1.ItemType == 0" src="../../static/image/pay_file.png">
						<img v-if="item1.ItemType == 1" src="../../static/image/pay_music.png">
						<span>{{item1.ItemName}}</span>
						<template v-if="item1.SubItems">
							<span class="mui-icon mui-icon-arrowdown arrow" @click="menuDown(index, index1)"></span>
							<ul :class="['group-list', {'active': item1.isShowSubList}]">
								<li v-for="(item2, index2) in item1.SubItems" :key="index2">
									<!-- @click="toDetails(item2.RemoteID)" -->
									<!-- <img src="../../static/image/pay_music.png"> -->
									<img v-if="item2.ItemType == 0" src="../../static/image/pay_file.png">
									<img v-if="item2.ItemType == 1" src="../../static/image/pay_music.png">
									<span>{{item2.ItemName}}</span>
								</li>
							</ul>
						</template>
					</li>
				</ul>
			</div>
		</div>

		<div v-if="payList.length === 0 && !isEmpty" class="loading">
			<img src="../assets/loading-svg/loading-spining-bubbles.svg" />
		</div>

		<div v-if="isEmpty" class="mui-content">
			<div class="is-empty">
				您还没有购买过商品！
			</div>
		</div>
	</div>
</template>

<script>
	import HeaderNav from '../components/HeaderNav.vue'
	import {LoginCode} from '../mixins/loginCode.js'
	export default {
		name: 'PayRecord',
		mixins: [LoginCode],
		data() {
			return {
				payList: [],
				isEmpty: false
			}
		},
		components: {
			HeaderNav
		},
		methods: {
			menuDown(index, index1) { //下拉菜单
				// alert(JSON.stringify(this.payList[index].Items[index1]))
				let bool = this.payList[index].Items[index1].isShowSubList
				this.payList[index].Items[index1].isShowSubList = !bool;
			},
			getPayList() {
				let formData = new FormData();
				if(this.getCode()){
					formData.append("code", this.getCode());
				}
				this.$.post('/MemberApi/MyOrderList',formData)
					.then(res => {
						// alert(JSON.stringify(res.data.Data))
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
						data.forEach((item) => {
							if (item.Items) {
								item.Items.forEach((item1) => {
									if (item1.SubItems) {
										// item1.SubItems.forEach((item2) => {
										this.$set(item1, "isShowSubList", false)
										// })

										// item1.isShowSubList = false
										// alert(JSON.stringify(item.Items))
									}
								})

							}


						})
						this.payList = data;
						this.isEmpty = this.payList.length == 0
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
			// toDetails(id) {
			// 	this.$router.push('/PlayVideo/' + id)
			// }
		},
		mounted() {
			this.getPayList()
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.mui-content {
		min-height: 100%;
		background: #fff;
		padding: .8rem .27rem 1.5rem;
	}

	.mui-content>div.is-empty {
		font-size: 0.3rem;
		text-align: center;
		margin-top: 0.5rem;
	}

	.time-totalprice {
		display: flex;
		border-bottom: 1px solid #888b8b;
		line-height: .5rem;
		margin-top: .3rem;
	}

	.time-totalprice>span {
		color: #000000;
		font-size: .28rem;
		flex: 1;
	}

	.time-totalprice>p {
		color: #c35b58;
		font-size: .28rem;
		font-weight: 600;
	}

	.record-list {
		margin-bottom: .36rem;
	}

	.record-list>li {
		width: 100%;
		background-color: #f2f2f2;
		border-radius: .1rem;
		padding: .25rem .07rem 0.1rem;
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

	.record-list .files .arrow {
		color: #d2aa6f;
		font-size: .5rem;
		opacity: 1;
		display: block;
		text-align: center;
		/* margin-top: .27rem; */
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
