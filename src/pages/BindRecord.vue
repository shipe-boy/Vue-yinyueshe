<template>
	<div style="height: 100%;">
		<!-- 头部 -->
		<header-nav>
			<h1 class="top-title">绑定记录</h1>
		</header-nav>
		<div v-if="booksList.length !== 0" class="mui-content">
			<router-link v-for="(item, index) in booksList" :key="index" :to="{name:'BookInfo',params:{id: item.QRBookID}}">
				<div class="img">
					<img :src="item.Picture">
				</div>
				<div class="introduce">
					<h4>{{item.GoodsName}}</h4>
					<p>{{item.Author}}</p>
					<p>书号：{{item.ISBN}}</p>
				</div>
				<span>&gt;</span>
			</router-link>
		</div>
		<div v-if="booksList.length === 0 && !isEmpty" class="loading">
			<img src="../assets/loading-svg/loading-spining-bubbles.svg"/>
		</div>
		<div v-if="isEmpty" class="mui-content">
			<div class="is-empty">
				您还没有绑定过书籍！
			</div>
		</div>
	</div>
</template>

<script>
	import HeaderNav from '../components/HeaderNav.vue'
	import {LoginCode} from '../mixins/loginCode.js'
	export default {
		name: 'BindRecord',
		mixins:[LoginCode],
		data() {
			return {
				booksList: [],
				isEmpty: false
			}
		},
		components: {
			HeaderNav
		},
		methods: {
			getBookList() {
				let formData = new FormData();
				if(this.getCode()){
					formData.append("code", this.getCode());
				}
				this.$.post('/MemberApi/MyBindedBook',formData)
					.then(res => {
						if(!res) return
						if (res.data && res.data.Status < 0) {
							this.$router.replace({
								path: '/ErrorPage',
								query: {
									message: res.data.Message
								}
							})
						}
						this.booksList = res.data.Data;
						this.isEmpty = this.booksList.length == 0
					})
					.catch(err => {
						this.$router.replace({
							path: '/ErrorPage',
							query: {
								message: '请稍后重试！'
							}
						})
					})
			}
		},
		mounted() {
			this.getBookList()
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.mui-content {
		min-height: 100%;
		background: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem .2rem 0 .2rem;
	}
	.mui-content .is-empty{
		font-size: 0.3rem;
		text-align: center;
		margin-top: 0.5rem;
	}

	.mui-content:after {
		content: '';
		height: 1.36rem;
		display: block;
	}

	.mui-content a {
		width: 100%;
		display: flex;
		align-items: center;
		background-color: #f2f2f2;
		border-radius: 10px;
		height: 2.7rem;
		margin-top: .6rem;
		position: relative;
	}

	.mui-content a:active {
		opacity: .6;
	}

	.mui-content a:last-child {
		margin-bottom: .3rem;
	}

	.mui-content a>.img {
		width: 1.8rem;
		height: 2.5rem;
		background-color: #fff;
		box-shadow: .14rem .23rem .57rem 0 rgba(131, 131, 131, 0.55);
		border-radius: .1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		left: .2rem;
		bottom: .4rem;
	}
	.mui-content a>.img>img {
		max-width: 100%;
		max-height: 100%;
	}

	.mui-content .introduce {
		margin-left: 2.5rem;
		flex: 1;
	}

	.mui-content .introduce h4 {
		font-size: .3rem;
		line-height: .45rem;
		color: #2c2c2c;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}

	.mui-content .introduce>p {
		font-size: .28rem;
		line-height: .4rem;
		color: #000000;
		opacity: 0.48;
	}

	.mui-content a>span {
		color: #000000;
		opacity: 0.48;
		font-size: .3rem;
		margin-right: .1rem;
	}
	div.loading{
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	div.loading>img{
		width: 1rem;
		height: 1rem;
	}
</style>
