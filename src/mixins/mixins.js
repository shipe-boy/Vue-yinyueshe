import {LoginCode} from '../mixins/loginCode.js'

//获取验证码， 获取手机号
export const BindBookCommon = {
	data() {
		return {
			phone: '',
			code: '',
			isTime: false, //计时
			waitTime: 60, //s
			ishavePhone: false
		}
	},
	methods: {
		codeLength(){
			if(this.code.length>6)this.code=this.code.slice(0,6)
		},
    verifyPhone(phone) {
        //分为国内手机或国外手机
        if (phone.length < 8) return false;
        if (phone.substring(0, 2) == '00' || phone.substring(0, 1) == '+') {
            if (phone.length > 15) return false;
        } else {
            //手机号正则
            var phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
            if (!phoneReg.test(phone)) {
                return false;
            }
        }
        return true;
    },
		clickCode() {
			if (!this.verifyPhone(this.phone)) {
				this.mui.toast('请输入正确的手机号！', {
					duration: 'long',
					type: 'div'
				})
				return false;
			}
			if (!this.isTime) {
				this.isTime = true;
				this.getCode()
				let timer = null;
				timer = setInterval(() => {
					this.waitTime -= 1;
					if (this.waitTime <= 0) {
						clearInterval(timer)
						this.waitTime = 60;
						this.isTime = false;
					}
				}, 1000)
			}

		},
		getCode() {
			let formData = new FormData();
			formData.append("Mobile", this.phone);
			if(this.getLoginCode()){
				formData.append("code", this.getLoginCode());
			}
			this.$.post('/QRCodeApi/FetchVCode', formData)
				.then((res) => {
					if (res.data && res.data.Status == 0) { //获取验证码成功

					} else {
						this.$router.push({
							path: '/ErrorPage',
							query: {
								message: res.data.Message
							}
						})
					}
					// console.log(res)
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
		getIsLogin() {
			let formData = new FormData();
			if(this.getLoginCode()){
				formData.append("code", this.getLoginCode());
			}
			this.$.post('/MemberApi/IsUserLogined', formData)
				.then((res) => {
					if (res.data && res.data.Status >= 0) {
						this.isLogin = true;
						this.getUserName()
					} else {
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
		getUserName() {
			this.$.post('/MemberApi/Info')
				.then(res => {
					if (res.data && res.data.Status >= 0) {
						this.userInfo = res.data.Data
						if (res.data.Data.Mobile) {
							this.phone = res.data.Data.Mobile;
							this.ishavePhone = true
						}
					} else {
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
		getLoginCode(){
			var arr = location.href.split("code=")[1];
			var code = "";
			if(arr){
				code = arr.split('&')[0]
			}
			return code;
		}
	}
}

//输入框
export const BindBookInput = {
	methods: {
		inputFocus(e) {
			let target = e.target;
			setTimeout(function() {
				target.scrollIntoViewIfNeeded();
			}, 400);
		},
		inputBlur() {
			window.scrollTo(0, 0);
			setTimeout(function() {
				if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
					return
				}
				document.activeElement.scrollIntoViewIfNeeded(true);
			}, 100)
		}
	}
}
