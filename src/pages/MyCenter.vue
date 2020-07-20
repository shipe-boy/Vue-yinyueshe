<template>
	<div style="height: 100%;">
		<!-- 头部 -->
		<header-nav>
			<h1 class="top-title">会员中心</h1>
		</header-nav>
	
	<div class="mui-content">
		<div class="user-info">
			<img :src="userInfo.MemberPic || require('../../static/image/vip_userImg.png.jpg')" class="user-head">
			<div class="info">
				<p>用户</p>
				<p @click="toRoute">{{userName}}</p>
			</div>
		</div>
		<div class="info-other">
			<a href="javascript:;" @click="toRoute('/BindRecord')">
				<img src="../../static/image/vip_bind.png">
				<p>绑定记录</p>
			</a>
			<a href="javascript:;" @click="toRoute('/MusicRecord')">
				<img src="../../static/image/vip_music.png">
				<p>已购乐曲</p>
			</a>
			<a href="javascript:;" @click="toRoute('/PayRecord')">
				<img src="../../static/image/vip_word.png">
				<p>购买记录</p>
			</a>
		</div>
	</div>
	</div>
</template>

<script>
	import HeaderNav from '../components/HeaderNav.vue'
	import {LoginCode} from '../mixins/loginCode.js'
	export default {
		mixins: [LoginCode],
		data() {
			return {
				isLogin: false,
				userName: '点击登录',
				userInfo: {}
			}
		},
		components: {
			HeaderNav
		},
		methods: {
			getIsLogin(){
				let formData = new FormData();
				if(this.getCode()){
					formData.append("code", this.getCode());
				}
				
				this.$.post('/MemberApi/IsUserLogined',formData)
					.then((res) => {
						// alert(JSON.stringify(res))
						if(!res) return
						if(res.data && res.data.Status>=0){
							this.isLogin = true;
							this.getUserName()
						}else{
							this.$router.replace({
								path: '/ErrorPage',
								query: {
									message: res.data.Message
								}
							})
						}
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
			getUserName(){
				let formData = new FormData();
				if(this.getCode()){
					formData.append("code", this.getCode());
				}
				this.$.post('/MemberApi/Info',formData)
					.then(res => {
						if(!res) return
						if(res.data && res.data.Status>=0){
							// alert(JSON.stringify(res.data.Data))
							this.userInfo = res.data.Data;
							this.userName = res.data.Data.NickName;
						}else{
							this.$router.replace({
								path: '/ErrorPage',
								query: {
									message: res.data.Message
								}
							})
						}
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
			toRoute(route){
				if(this.isLogin){
					route && this.$router.push(route)
				}else{
					this.$router.push('/')
				}
				
			}
		},
		mounted(){
			
			this.getIsLogin()
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.mui-content{
		min-height: 100%;
		background: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1.3rem .34rem 1.8rem;
	}
	.user-info{
		display: flex;
		align-items: center;
		width: 100%;
		height: 1.9rem;
		background-color: #ecf0ef;
		border-radius: .1rem;
	}
	.user-head{
		width: 1.13rem;
		height: 1.13rem;
		border-radius: 50%;
		margin: 0 .24rem;
	}
	.info p{
		color: #d2aa6f;
		font-size: .33rem;
		line-height: .4rem;
	}
	.info-other{
		width: 100%;
		margin-top: .74rem;
		display: flex;
	}
	.info-other a{
		flex: 1;
		height: 1.23rem;
		border-right: 1px solid #d2aa6f;
		
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.info-other a:active{
		opacity: .6;
	}
	.info-other a:last-child{
		border-right: 0;
	}
	.info-other a>img{
		width: .43rem;
		height: .43rem;
	}
	.info-other p{
		font-size: .28rem;
		color: #d2aa6f;
		margin-top: .29rem;
	}
</style>
