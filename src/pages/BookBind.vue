<template>
	<div style="height: 100%;">
		<template v-if="!isloading">
			<!-- 头部 -->
			<header-nav>
				<h1 class="top-title">绑定图书资源</h1>
			</header-nav>
			<!-- 内容 -->
			<div class="mui-content">
				<form class="mui-input-group">
					<div class="mui-input-row">
						<label>手机号</label>
						<input type="text" :disabled="ishavePhone" class="mui-input-clear" placeholder="请输入手机号" data-input-clear="1" v-model="phone"><span
						 class="mui-icon mui-icon-clear mui-hidden"></span>
					</div>
					<div class="mui-input-row">
						<label>验证码</label>
						<input type="text" v-model="code" @input="codeLength" placeholder="请输入验证码">
						<a v-if="!isTime" href="javascript:;" class="code" @click="clickCode">获取验证码</a>
						<a v-if="isTime" href="javascript:;" class="code wait">{{waitTime}}s</a>
					</div>
					<div class="mui-button-row">
						<button type="button" class="mui-btn" @click="bookBind">确认绑定</button>
						<button type="button" class="mui-btn" @click="skipBind">跳过绑定</button>
					</div>
				</form>
			</div>
		</template>
		<template v-if="isloading">
			<div class="loading">
				<img src="../assets/loading-svg/loading-spining-bubbles.svg"/>
			</div>
		</template>
	</div>
</template>

<script>
	import HeaderNav from '../components/HeaderNav.vue'
	import {BindBookCommon} from '../mixins/mixins.js'
	export default {
		name: 'BookBind',
		mixins: [BindBookCommon],
		data() {
			return {
				bookID: '', //书籍ID
				isloading: true,
				isBindWaiting: false
			}
		},
		components: {
			HeaderNav
		},
		methods: {
			bookBind() {
				if (!this.verifyPhone(this.phone)) {
					this.mui.toast('请输入正确的手机号！', {
						duration: 'long',
						type: 'div'
					})
					return false;
				}
				if (!this.code ||(this.code + "").length != 6) {
					this.mui.toast('请输入正确的验证码！', {
						duration: 'long',
						type: 'div'
					})
					return false;
				}
				//可以绑定
				if(!this.isBindWaiting){
					this.isBindWaiting = true;
					this.getBookBind()
				}
				
			},
			getBookBind() { //绑定图书
				// 1000000000576329   1000000000581851   测试，别绑定
				// let code = this.$route.query.QRCodeID;
				let code = this.handleQRCodeID();
				let formData = new FormData();
				formData.append("Mobile", this.phone);
				formData.append("VerifyCode", this.code);
				formData.append("QRCodeID", code); //二维码
				if(this.getLoginCode()){
					formData.append("code", this.getLoginCode());
				}
				this.$.post('/QRCodeApi/ToBind', formData)
					.then((res) => {
						this.isBindWaiting = false;
						if(!res) return
						if (res.data && res.data.Status == 0) { //绑定成功,跳转图书详情
							this.$router.push({
								name: 'BookInfo',
								params: {
									id: this.bookID
								}
							})
						} else {
							this.$router.push({
								path: '/ErrorPage',
								query: {
									message: res.data.Message
								}
							})
						}
					})
					.catch((err) => {
						this.isBindWaiting = false;
						this.$router.push({
							path: '/ErrorPage',
							query: {
								message: '请稍后重试！'
							}
						})
					})
			},
			getCodeStuts() { //二维码状态
				// https://etest.yuehi.cc/page/#/?QRCodeID=1000000000337499
				// let code = this.$route.query.QRCodeID;
				let code = this.handleQRCodeID();
				
				if (!code) {
					this.$router.replace({
						path: '/ErrorPage',
						query: {
							message: "没有获取到二维码！"
						}
					})
				}
				let formData = new FormData();
				formData.append("QRCodeID", code);
				if(this.getLoginCode()){
					formData.append("code", this.getLoginCode());
				}
				this.$.post('/QRCodeApi/BookBind', formData)
					.then(res => {
						if(!res) return
						if (res.data && res.data.Status < 0) {
							this.$router.replace({
								path: '/ErrorPage',
								query: {
									message: res.data.Message
								}
							})
						} else {
							this.bookID = res.data.Data.QRBookID
							if (res.data.Data.QRStut == 1) { //未绑定，绑定页面
								if (res.data.Data.PartnerID == 5) { //佳音绑定
									// window.location.href = 'https://etest.yuehi.cc/page/#/JiaYinBind?id='+res.data.Data.QRBookID+'&QRCodeID='+this.$route.query.QRCodeID
									this.$router.replace({
										path: '/JiaYinBind',
										query: {
											id: res.data.Data.QRBookID,
											QRCodeID: code
										}
									})
								} else if (res.data.Data.PartnerID == 6) { //九月琴房
									this.$router.replace({
										path: '/JiuYueBind',
										query: {
											id: res.data.Data.QRBookID,
											QRCodeID: code
										}
									})
								}else if(res.data.Data.PartnerID == 7){
									this.$router.replace({
										path: '/JiuYueBind1',
										query: {
											id: res.data.Data.QRBookID,
											QRCodeID: code
										}
									})
								} else { //默认绑定
									this.isloading = false
								}

							} else if (res.data.Data.QRStut == 2) { //已绑定，图书详情页
								if(res.data.Data.PartnerID == 6){
									this.$router.replace({
										path: '/JiuYueBind',
										query: {
											id: res.data.Data.QRBookID,
											QRCodeID: code,
											isBind: true
										}
									})
								}else if(res.data.Data.PartnerID == 7){
									this.$router.replace({
										path: '/JiuYueBind1',
										query: {
											id: res.data.Data.QRBookID,
											QRCodeID: code,
											isBind: true
										}
									})
								}else{
									this.$router.replace({
										name: 'BookInfo',
										params: {
											id: res.data.Data.QRBookID,
										}
									})
								}
								
							} else {
								this.$router.replace({
									path: '/ErrorPage',
									query: {
										message: 0,
										QRBookID: this.bookID
									}
								})
							}
						}
					})
					.catch((err) => {
						// alert(err)
						this.$router.replace({
							path: '/ErrorPage',
							query: {
								message: '请稍后重试！！'
							}
						})
					})
			},
			skipBind() {
				this.$router.push({
					name: 'BookInfo',
					params: {
						id: this.bookID
					}
				})
			},
			handleQRCodeID(){
				let url = location.href;
				let id = '';
				
				let a = url.split("?QRCodeID=")
				if(a[1]){
					id = a[1].split('#/')[0]
				}
				
				return id
			}
		},
		mounted() {
			this.getCodeStuts()
			this.getIsLogin()
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.mui-content {
		min-height: 100%;
		background: #fff;
		padding: 1.5rem .34rem 3rem;
	}

	.mui-input-group:before {
		height: 0;
	}

	.mui-input-group:after {
		height: 0;
	}

	.mui-input-group .mui-input-row {
		height: .8rem;
	}

	.mui-input-group .mui-button-row {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: auto;
	}

	input[type='text'] {
		height: .8rem;
		font-size: .3rem;
	}

	.mui-button-row button {
		width: 5rem;
		height: .8rem;
		line-height: .8rem;
		margin-top: .2rem;
		padding: 0;
		background-color: #d2aa6f;
		color: #fff;
		border-radius: .1rem;
		font-size: .3rem;
		border: 0;
	}

	.mui-button-row button:last-child {
		background: #fff;
		color: #d2aa6f;
	}

	.mui-input-row label {
		padding: 0 .25rem;
		height: .8rem;
		line-height: .8rem;
		font-size: .3rem;
	}

	/* 获取验证码 */
	.code {
		display: block;
		position: absolute;
		top: 50%;
		right: 0;
		transform: translateY(-50%);
		width: 1.8rem;
		height: .5rem;
		line-height: .5rem;
		text-align: center;
		border: 1px solid #d2aa6f;
		color: #d2aa6f;
		border-radius: .25rem;
	}

	.code.wait {
		color: rgb(139, 136, 139);
		border: 1px solid rgb(139, 136, 139);
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
	input, textarea {
	    -webkit-user-select: auto!important;
	    -khtml-user-select: auto!important;
	    -moz-user-select: auto!important;
	    -ms-user-select: auto!important;
	    -o-user-select: auto!important;
	    user-select: auto!important;
	}
</style>
