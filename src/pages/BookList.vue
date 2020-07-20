<template>
	<div style="height: 100%;">
		<!-- 头部 -->
		<header-nav>
			<h1 class="top-title">图书列表</h1>
		</header-nav>
		<!-- 内容 -->
		<div :class="['mui-input-row', 'mui-search',{'mui-active': isInput}]">
			<input type="search" class="mui-input-clear" placeholder="" data-input-clear="1" data-input-search="1" v-model="search"
			 @blur="inputBlur" @keyup.enter="inputBlur" ref="inputVal">
			<span :class="['mui-icon', 'mui-icon-clear', {'mui-hidden': search==''}]" @click="clearSearch"></span>
			<span @click="changeCss" class="mui-placeholder"><span class="mui-icon mui-icon-search"></span><span>请输入搜索内容</span></span>
		</div>
		<div class="mui-content">
			<router-link v-for="(item, index) in searchList" :key="index" :to="{name:'BookInfo',params:{id: item.QRBookID}}">
				<div class="img">
					<img :src="item.Picture">
				</div>

				<div class="introduce">
					<h4 class="name">{{item.GoodsName}}</h4>
					<p>作者：{{item.Author}}</p>
					<p>书号：{{item.ISBN}}</p>
					<p>价格：<span>{{item.Price}}</span></p>
				</div>
				<span>&gt;</span>
			</router-link>
		</div>

	</div>
</template>

<script>
	import HeaderNav from '../components/HeaderNav.vue'
	import {
		LoginCode
	} from '../mixins/loginCode.js'
	export default {
		mixins: [LoginCode],
		data() {
			return {
				search: "",
				isInput: false,
				bookList: [],
				searchList: []
			}
		},
		components: {
			HeaderNav
		},
		methods: {
			changeCss() {
				this.isInput = true
				this.$refs.inputVal.focus()
			},
			inputBlur() {
				if (!this.search) {
					this.isInput = false;
					this.bookList.forEach(item => {
						this.searchList.push(this.deepCopy(item))
					})
				} else {
					let initArr = [];
					this.bookList.forEach(item => {
						initArr.push(this.deepCopy(item))
					})
					let arr = [];
					for (let i = 0, len = initArr.length; i < len; i++) {
						if ((initArr[i].Author && initArr[i].Author.indexOf(this.search) > -1) || (initArr[i].GoodsName && initArr[
								i].GoodsName.indexOf(this.search) > -1) || (initArr[i].ISBN && initArr[i].ISBN.indexOf(this.search) > -
								1) || (initArr[i].Price && (initArr[i].Price + "").indexOf(this.search) > -1)) { //有结果
							arr.push(initArr[i])
						}
					}
					this.searchList = arr;
				}
			},
			clearSearch() {
				this.search = '';
				this.$refs.inputVal.focus()
			},
			getBookList() {
				let formData = new FormData();
				formData.append("PNID", 0);
				if (this.getCode()) {
					formData.append("code", this.getCode());
				}
				this.$.post('/Product/BookList', formData)
					.then(res => {
						if (!res) return
						if (res.data && res.data.Status == 0) {
							this.bookList = res.data.Data;
							if (this.bookList && this.bookList.length > 0) {
								this.bookList.forEach(item => {
									if (item.Picture) {
										// item.Picture = "http://www.smph.cn/picture/" + item.Picture;
									} else {
										item.Picture = '/images/No_Image.jpg';
									}
									this.searchList.push(this.deepCopy(item))
								})
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
			//深拷贝
			deepCopy(obj1, obj2 = {}) {
				for (let i in obj1) {
					if (obj1.hasOwnProperty(i)) {
						if (Array.isArray(obj1[i])) {
							obj2[i] = [];
							this.deepCopy(obj1[i], obj2[i]);
						} else if (typeof obj1[i] === "function") {
							obj2[i] = obj1[i];
						} else if (obj1[i] instanceof Object) {
							obj2[i] = {};
							this.deepCopy(obj1[i], obj2[i]);
						} else {
							obj2[i] = obj1[i];
						}
					}
				}
				return obj2;
			},
		},
		mounted() {
			this.getBookList()
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.mui-search {
		margin: .9rem .2rem 0;
	}

	.mui-search input[type='search'] {
		width: 100%;
		height: 100%;
		margin-bottom: 0;
	}

	.mui-search:before {
		transform: translateY(-50%);
		margin-top: 0;
	}

	.mui-content {
		min-height: 100%;
		background: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0 .2rem;
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
		margin-top: .6rem;
		height: 2.7rem;
		/* padding: .2rem .1rem .2rem .2rem; */
		position: relative;
	}

	.mui-content a p:last-child {
		color: red;
	}

	.mui-content a:last-child {
		margin-bottom: .3rem;
	}

	.mui-content a>.img {
		width: 1.8rem;
		height: 2.5rem;
		background-color: #fac010;
		box-shadow: .14rem .23rem .57rem 0 rgba(131, 131, 131, 0.55);
		border-radius: .1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
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
		/* margin-bottom: .15rem; */
		color: #2c2c2c;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.mui-content .introduce>p {
		font-size: .28rem;
		line-height: .4rem;
		color: #000000;
		opacity: 0.48;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}

	.mui-content a>span {
		color: #000000;
		opacity: 0.48;
		font-size: .3rem;
		margin-right: .1rem;
	}
</style>
