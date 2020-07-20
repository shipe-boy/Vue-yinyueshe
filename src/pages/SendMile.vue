<template>
	<div style="height: 100%;">
		<!-- 头部 -->
		<header-nav>
			<h1 class="top-title">下载</h1>
		</header-nav>
		<!-- 内容 -->
		<div class="mui-content">
			<img src="../../static/image/download.png">
			<p class="tips-1">系统会将下载链接发送至您预留的邮箱地址</p>
			<div class="mui-input-row" id="input-wrap">
				<input v-if="!isOwn" type="email" placeholder="请输入邮箱地址" id="email" v-model="email">
				<p class="emial-address" v-if="isOwn">{{email}}</p>
			</div>
			<p v-if="!isOwn" class="tips-2">该邮箱预留后暂无法直接修改，请仔细填写。</p>
			<button type="button" @click="submit">确认</button>
		</div>
	</div>
</template>

<script>
	import HeaderNav from '../components/HeaderNav.vue'
	import { LoginCode } from '../mixins/loginCode.js'
	export default {
		name: 'SendMile',
		mixins: [LoginCode],
		data() {
			return {
				email: '',	
				isOwn: false,
				loading: false
			}
		},
		components: {
			HeaderNav
		},
		methods: {
			submit() {
				let self = this;
				if (this.isOwn) {	//一开始就有邮箱
					this.getSendEmail()
				}else{	//没有邮箱，要填写邮箱
					var reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
					if (reg.test(this.email)) {
						this.getSendEmail()
						var btnArray = ['确认'];
						this.mui.confirm('邮件已发送', '提示', btnArray, function(e) {
							if (e.index == 0) {
								// self.isOwn = true;
							}
						});
					} else {
						var btnArray = ['确认'];
						this.mui.alert('邮箱输入不正确！', '提示', btnArray, function(e) {
							if (e.index == 0) {
								// self.email = "";
							}
						});
					}
				}
			},
			getUserInfo(){
				let formData = new FormData();
				if (this.getCode()) {
					formData.append("code", this.getCode());
				}
				this.$.post('/MemberApi/Info',formData)
					.then(res => {
						if(!res) return
						if(res.data && res.data.Status==0){
							if(res.data.Data.Email){
								this.email = res.data.Data.Email
								this.isOwn = true
							}else{
								this.isOwn = false
							}
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
						this.$router.replace({
							path: '/ErrorPage',
							query: {
								message: '请稍后重试！'
							}
						})
					})
			},
			getSendEmail(){
				if(this.loading) return
				this.loading = true
				let formData = new FormData();
				formData.append("Email", this.email);
				formData.append("QRItemID", parseInt(this.$route.query.QRItemID));	//单曲ID
				formData.append("RemoteID", parseInt(this.$route.query.RemoteID));	//乐库单曲标识
				formData.append("IsNew", this.isOwn ? 0 : 1);
				if (this.getCode()) {
					formData.append("code", this.getCode());
				}
				this.$.post('/QRModel/ToSendMail', formData)
					.then(res => {
						this.loading = false
						if(!res) return
						if (res.data && res.data.Status < 0) {
							this.$router.push({
								path: '/ErrorPage',
								query: {
									message: res.data.Message
								}
							})
							return
						}
						this.mui.toast('邮件已发送成功！',{ duration:'long', type:'div' })
						// console.log(res)
					})
					.catch(err => {
						this.loading = false
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
			this.getUserInfo()
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.mui-content {
		min-height: 100%;
		background-color: transparent;
		display: flex;
		align-items: center;
		flex-direction: column;
		padding-top: 1.2rem;
	}

	.mui-content img {
		height: 1.59rem;
		width: 1.58rem;
	}

	.mui-content .tips-1 {
		font-size: .32rem;
		color: #262123;
		margin: .72rem 0;
	}

	.mui-content form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.mui-content input {
		width: 6.63rem;
		height: .81rem;
		background-color: #f2f2f2;
		border-radius: .1rem;
		border: solid 1px #cecece;
		color: #262123;
		font-size: .3rem;
		text-align: center;
	}

	input::-webkit-input-placeholder {
		/* WebKit browsers */
		color: #262123;
	}

	input:-moz-placeholder {
		/* Mozilla Firefox 4 to 18 */
		color: #262123;
	}

	input::-moz-placeholder {
		/* Mozilla Firefox 19+ */
		color: #262123;
	}

	input:-ms-input-placeholder {
		/* Internet Explorer 10+ */
		color: #262123;
	}

	.mui-content .emial-address {
		color: #d3aa6d;
		font-size: .4rem;
		margin-bottom: 1.35rem;
		padding: 0 .2rem;
		text-align: center;
		word-wrap: break-word;
		overflow: hidden;
		word-break: break-all;
		line-height: .7rem;
	}

	.mui-content .tips-2 {
		font-size: .3rem;
		color: #c35b58;
		margin: .4rem 0 .83rem 0;
	}

	.mui-content button {
		width: 4.95rem;
		height: .8rem;
		background-color: #d2aa6f;
		border-radius: .1rem;
		color: #fff;
		font-size: .36rem;
		border: none;
	}
</style>
