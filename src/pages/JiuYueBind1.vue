<template>
	<div class="bind-wrap" ref="wrap">
		<a class="logo-title" href="https://a.app.qq.com/o/simple.jsp?pkgname=com.jiuyueqinfang.app">
			<img src="../../static/image/logo-title.png" width="100%" height="100%" />
		</a>
		<img class="gifts" src="../../static/image/gifts.png" />
		<!-- <p class="succ-title">正版图书验证成功！</p>
		<p class="gift-title">送你大礼包</p> -->
		<img class="lihe" src="../../static/image/jiuyue_la.png"/>
		<div class="footer-wrap" ref="footerWrap">
			
			<div class="content" ref="content">
				<div class="c-top">
					<img class="t-bg" :src="userInfo.MemberPic || '../../static/image/jiuyue_tab.png'"></img>
					<span class="c-msg">{{userInfo.NickName}}</span>
				</div>
				<template v-if="!isBind">
					<p class="c-message marg">领取一个月玖月琴房VIP会员</p>
					<p class="c-message">快去乐理专区闯关吧</p>
				</template>
				<template v-if="isBind">
					<p class="f-bind-msg">您已领取一个月玖月琴房VIP会员~</p>
				</template>
			</div>

			<div class="bind-info" ref="bindInfo">
				<div class="info" v-if="!isBind">
					<input type="text" @focus="inputFocus" @blur="inputBlur" :disabled="ishavePhone" v-model="phone" placeholder="输入手机号" />
					<div>
						<input class="code" @focus="inputFocus" @blur="inputBlur" @input="codeLength" v-model="code" placeholder="输入验证码" />
						<button class="send-code" @click="clickCode"><span v-if="!isTime">发送验证码</span><span v-if="isTime">({{waitTime}}s)</span></button>
					</div>
					<button class="source" @click="bookBind">立即领取 &gt;</button>
				</div>
				<div class="f-info" v-if="isBind">
					<!-- <p class="f-info-title">快去乐理专区闯关吧</p> -->
					<!-- <img class="arrow" src="../../static/image/jiuyue_arrow.png"> -->
					<button class="f-source" @click="toDetails">查看详情 &gt;</button>
					<!-- <p class="down-msg mar-top">下载玖月琴房APP</p> -->
					<!-- <p class="down-msg">获取海量正版曲库&教学级试听功能</p> -->
					<div class="down-wrap">
						<div class="down-flex">
							<div class="down-logo"></div>
							<div class="down-title">
								<p>玖月琴房</p>
								<p>全脑音乐教育明星品牌</p>
							</div>
						</div>

						<a class="download" href="https://a.app.qq.com/o/simple.jsp?pkgname=com.jiuyueqinfang.app" ref="download">立即下载</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {BindBookCommon, BindBookInput} from '../mixins/mixins.js'
	export default {
		name: 'JiuYueBind1',
		mixins: [BindBookCommon,BindBookInput],
		data() {
			return {
				isBind: true,
				userInfo: {},
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
							this.isBind = true;
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
			toDetails() {
				// location.href = "https://a.app.qq.com/o/simple.jsp?pkgname=com.jiuyueqinfang.app"
				this.$router.push({
					name: 'BookInfo',
					params: {
						id: this.$route.query.id
					}
				})
			}
		},
		mounted() {
			this.isBind = this.$route.query.isBind;
			// this.isBind = false
			document.title = '玖月琴房';
			this.getIsLogin()
			this.$nextTick(() => {

				this.$refs.wrap.style = "height:" + this.$refs.wrap.offsetHeight + "px;"
				let UA = navigator.userAgent;
				if (UA.match(/iPad/) || UA.match(/iPhone/) || UA.match(/iPod/)) {
					// return true;
				} else {
					this.$refs.footerWrap.style = "height:" + this.$refs.footerWrap.offsetHeight + "px;"
					this.$refs.content.style = "height:" + this.$refs.content.offsetHeight + "px;"
					this.$refs.bindInfo.style = "height:" + this.$refs.bindInfo.offsetHeight + "px;"
				}
			})
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.bind-wrap {
		/* overflow: hidden; */
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
		padding-top: 0.4rem;
		background-image: url(../../static/image/jiuyue_bg.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: left bottom;
	}

	.bind-wrap .logo-title {
		position: relative;
		z-index: 2;
		display: block;
		width: 1.6rem;
		/* height: 0.54rem; */
		margin: 0.8vh auto 2.2vh;
	}

	.bind-wrap .succ-title {
		font-family: PingFangSC-Semibold;
		font-size: 0.48rem;
		color: #ffffff;
		line-height: 0.48rem;
		text-align: center;
	}

	.bind-wrap .gift-title {
		font-family: PangMenZhengDao;
		font-size: 0.9rem;
		color: #ffffff;
		line-height: 0.9rem;
		text-align: center;
		margin: 0.3rem auto 0;
	}

	.bind-wrap .content {
		box-sizing: border-box;
		/* width: 5.44rem; */
		width: 72.6%;
		height: 20vh;
		background-image: linear-gradient(180deg, #febeff 0%, #fff5ff 45%, #ffffff 100%);
		border-radius: 0.12rem;
		margin: 0px auto -4vh;
		padding: 0.2rem;
	}

	.bind-wrap .content .c-top .t-bg {
		overflow: hidden;
		display: inline-block;
		width: 6vh;
		height: 6vh;
		/* background: url(../../static/image/jiuyue_tab.png) no-repeat center/cover; */
		vertical-align: middle;
		border-radius: 50%;
		margin-right: 0.1rem;
	}

	.bind-wrap .content .c-top .c-msg {
		font-family: PingFangSC-Regular;
		font-size: 0.28rem;
		line-height: 0.28rem;
		color: #8e7251;
		vertical-align: middle;
	}

	.bind-wrap .content .c-message {
		font-family: PingFangSC-Semibold;
		font-size: 0.3rem;
		line-height: 0.3rem;
		color: #333333;
		text-align: center;
		font-weight: bold;
	}

	.bind-wrap .content .c-message.marg {
		margin: 0.2rem 0 0.2rem;
	}

	.footer-wrap {
		height: 63vh;
		width: 100%;
		position: absolute;
		bottom: 0;
		left: 0;
	}

	.bind-info {
		overflow: hidden;
		width: 100%;
		height: 47vh;
		background-image: url(../../static/image/content_bg.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.bind-info .info {
		width: 5.44rem;
		margin: 16% auto 0;
	}

	.bind-info .info>div {
		margin-bottom: 11%;
	}

	.bind-info .info input {
		box-sizing: border-box;
		width: 100%;
		height: 0.76rem;
		background-color: #ffffff;
		border-radius: 0.08rem;
		outline: none;
		border: none;
		margin-bottom: 8%;
		font-size: 0.28rem;
	}

	.bind-info .info input.code {
		width: 3.14rem;
		padding: 0.1rem 0.3rem;
		margin-right: 0.2rem;

	}

	.bind-info .info input::placeholder {
		color: #999;
	}

	.bind-info .info .send-code {
		box-sizing: border-box;
		width: 2rem;
		height: 0.76rem;
		border-radius: 0.08rem;
		border: solid 0.02rem #ffffff;
		font-family: PingFangSC-Regular;
		font-size: 0.28rem;
		color: #ffffff;
		background-color: transparent;
	}

	.bind-info .info .source {
		width: 100%;
		height: 0.76rem;
		background-color: #ffb61b;
		border-radius: 0.08rem;
		font-family: PingFangSC-Semibold;
		font-size: 0.32rem;
		color: #ffffff;
	}

	.f-bind-msg {
		font-family: PingFangSC-Semibold;
		font-size: 0.32rem;
		color: #999999;
		text-align: center;
		font-weight: 600;
		margin-top: 0.25rem;
	}

	.f-info {
		width: 6.2rem;
		margin: 35% auto 0;
	}

	.f-info .f-info-title {
		font-family: PingFangSC-Regular;
		font-size: 0.46rem;
		color: #ffffff;
		margin: 24% 0 8%;
		text-align: center;
		font-weight: 500;
	}

	.bind-info .info .source,
	.f-source {
		display: block;
		width: 5.4rem;
		height: 0.76rem;
		background-color: #ffb61b;
		border-radius: 0.08rem;
		font-family: PingFangSC-Semibold;
		font-size: 0.32rem;
		color: #ffffff;
		margin: auto;
		border: none;
		outline: none;
	}

	.down-wrap {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 7.5vh;
		padding: 0.15rem 0.4rem;
		background-color: rgba(0, 0, 0, 0.6);
	}

	.down-wrap .down-logo {
		display: inline-block;
		width: 0.6rem;
		height: 0.6rem;
		background: url(../../static/image/logo.png) no-repeat center/contain;
	}

	.down-wrap .down-title {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-around;
		height: 100%;
		margin-left: 0.15rem;
	}

	.down-wrap .down-title>p {
		font-family: PingFangSC-Semibold;
		font-size: 0.26rem;
		line-height: 0.26rem;
		color: #ffffff;
		margin: 0;
		padding: 0;
	}

	.down-wrap .down-title>p:nth-child(2) {
		font-size: 0.24rem;
		line-height: 0.24rem;
	}

	.down-wrap .download {
		/* float: right; */
		width: 1.52rem;
		height: 0.64rem;
		background-color: #7b2aaa;
		border-radius: 0.1rem;
		font-family: PingFangSC-Regular;
		font-size: 0.24rem;
		color: #ffffff;
		text-align: center;
		line-height: 0.64rem;
	}

	.down-msg.mar-top {
		margin-top: 8%;
	}

	.down-msg {
		line-height: 0.42rem;
		color: #4b2766;
		text-align: center;
		margin: 0;
		padding: 0;
	}

	.bind-wrap img.gifts {
		position: relative;
		z-index: 2;
		display: block;
		margin: 3.8vh auto 0;
		/* width: 4.2rem; */
		width: 56%;
	}

	.down-flex {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		height: 100%;
	}
	.lihe{
		    position: absolute;
		    z-index: 1;
		    top: 7vh;
		    width: auto;
		    height: 90vh;
			left: 50%;
			transform: translateX(-50%);
	}
	.bind-wrap .content,
	.bind-info{
		position: relative;
		z-index: 2;
	}
	.arrow{
		display: block;
		margin: 0 auto 5%;
		width: 0.6rem;
	}

	input,
	textarea {
		-webkit-user-select: auto !important;
		-khtml-user-select: auto !important;
		-moz-user-select: auto !important;
		-ms-user-select: auto !important;
		-o-user-select: auto !important;
		user-select: auto !important;
	}
</style>
