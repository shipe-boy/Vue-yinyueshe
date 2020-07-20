<template>
	<div class="bind-wrap" ref="wrap">
		<a href="javascript:;" style="display: inline-block;" @click="toDetails"><img src="../../static/image/p2_btn1.png" class="introduction"></a>
		<div class="p2_pic">
			<img src="../../static/image/p2_pic.png">
		</div>
		<div class="register">
			<div class="form_group">
				<input type="text" @focus="inputFocus" @blur="inputBlur" :disabled="ishavePhone" class="form_control" v-model="phone" placeholder="请填写手机号注册/绑定乐海书情账号" value="">
			</div>
			<div class="form_group">
				<input type="text" class="form_control" @focus="inputFocus" @blur="inputBlur" placeholder="请输入验证码" @input="codeLength" v-model="code" style="width: 55%;">
				<a class="code" @click="clickCode">获取验证码 <span v-if="isTime">({{waitTime}}s)</span> </a>
			</div>
			<div class="form_group">
				<a href="javascript:;" @click="bookBind" class="p2_submit"><img src="../../static/image/p2_btn2.png"></a>
			</div>
		</div>
		<div class="p2_txt">
			<a ref="downLoad" class="down-btn" href="https://a.app.qq.com/o/simple.jsp?pkgname=com.example.midogan" download="听见米多">下载「听见咪哆」APP</a><br /> 获取海量正版曲库 & 教学级视听功能
		</div>
	</div>
</template>

<script>
	import {BindBookCommon, BindBookInput} from '../mixins/mixins.js'
	export default {
		name: 'JiaYinBind',
		mixins: [BindBookCommon,BindBookInput],
		data() {
			return {
				isBindWaiting: false
			}
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
				let code = this.$route.query.QRCodeID;
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
						if (res.data && res.data.Status == 0) { //绑定成功,app提示
							//https://a.app.qq.com/o/simple.jsp?pkgname=com.example.midogan
							// this.$refs.downLoad.click()
							let self = this;
							var btnArray = ['确认', "取消"];
							this.mui.confirm('已完成绑定，点“确认”前往听见咪哆APP。如您未注册过咪哆，系统会以您的手机号自动生成帐号，初始密码为手机号。点“取消”留在当前页。', '提示', btnArray, function(e) {
								if (e.index == 0) {
									// self.$refs.downLoad.click()
									location.href = "https://a.app.qq.com/o/simple.jsp?pkgname=com.example.midogan";
								}
							});


						}else {
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
			toDetails() {
				this.$router.push({
					name: 'BookInfo',
					params: {
						id: this.$route.query.id
					}
				})
			},

		},
		mounted() {
			// document.title = '一书一码';
			this.getIsLogin()
			this.$nextTick(()=>{
				this.$refs.wrap.style = "height:"+this.$refs.wrap.offsetHeight+"px;"
			})
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.bind-wrap{
		overflow: hidden;
		position: relative;
		width: 100%;
		height: 100%;
		background: url(../../static/image/bg2.jpg) no-repeat center/cover;
	}

	.introduction {
		height: 0.8rem;
		margin: 4vh 0 0 0.53rem;
	}

	.p2_pic {
		text-align: center;
	}

	.p2_pic img {
		width: 70%;
	}

	.form_group {
		margin-bottom: 1vh;
		width: 100%;
		font-size: 0.24rem;
	}

	.form_control {
		height: 0.8rem;
		padding: 0 0.3rem;
		width: 100%;
	}

	.form_group input {
		font-size: 0.24rem;
		border: 1px solid #726d68;
	}

	.register {
		margin: -4vh auto 7.4vh;
		width: 70%;
	}

	.code {
		float: right;
		display: inline-block;
		line-height: 0.8rem;
		height: 0.8rem;
		width: 43%;
		background-color: #c2fef3;
		color: #6d58b8;
		text-align: center;
		border-radius: 0.1rem;
	}

	.p2_submit {
		text-align: center;
		display: inline-block;
		width: 100%;
		margin: 3vh 0px;
	}

	.p2_submit img {
		width: 92%;
		max-width: 100%;
	}

	.p2_txt {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 9vh;
		font-size: 0.28rem;
		line-height: 0.3rem;
		text-align: center;
		color: #ffffff;
		padding: 0.06rem 0;
	}

	a.down-btn {
		color: #fff;
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
