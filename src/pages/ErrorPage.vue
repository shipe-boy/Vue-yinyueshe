<template>
	<div style="height: 100%;">
		
		<header-nav>
			<h1 class="top-title">页面出错</h1>
		</header-nav>
		
		<div class="mui-content">
			<img src="../../static/image/error.png">
			<p v-if="message != 0" class="tips-2">{{message}}</p>
			<p v-if="message == 0" class="tips-2">处理请求时出现错误:</br>此二维码已被绑定!</p>
			<button type="button" @click="submit">{{!bookID ? '返回':"继续浏览"}}</button>
		</div>
	</div>
	
</template>

<script>
	import HeaderNav from '../components/HeaderNav.vue'
	export default {
		name: 'ErrorPage',
		data() {
			return {
				message: '',
				bookID: 0
			}
		},
		components: {
			HeaderNav
		},
		methods: {
			submit(){
				if(this.bookID){
					this.$router.push({
						name: 'BookInfo',
						params: {
							id: this.bookID
						}
					})
				}else{
					this.$router.go(-1)
				}
				
			}
		},
		mounted() {
			this.bookID = this.$route.query.QRBookID;
			this.message = this.$route.query.message;
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.mui-content {
		min-height: 100%;
		background: #fff;
		display: flex;
		align-items: center;
		flex-direction: column;
		padding-top: 1.2rem;
	}

	.mui-content img {
		/* height: 3rem; */
		width: 3.4rem;
		margin-top: 0.5rem;
	}

	.mui-content .tips-1 {
		font-size: .72rem;
		font-weight: bolder;
		color: #d2aa6f;
		margin: .3rem 0;
	}
	.mui-content .tips-2 {
		text-align: center;
		font-size: .3rem;
		/* color: #c35b58; */
		margin: .4rem 0 0 0;
	}

	.mui-content button {
		width: 4.95rem;
		height: .8rem;
		margin-top: 0.7rem;
		background-color: #d2aa6f;
		border-radius: .1rem;
		color: #fff;
		font-size: .36rem;
		border: none;
	}
</style>
