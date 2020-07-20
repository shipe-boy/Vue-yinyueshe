<template>
	<div style="height: 100%;">
		<template v-if="searchList.GoodsID || searchList.GoodsName">
			<!-- 头部 -->
			<header-nav>
				<div class="input-sea">
					<input type="search" v-model="search" class="mui-input-clear" placeholder="请输入搜索内容">
				</div>
				<a href="javascript:;" @click="querySelect" class="search"></a>
			</header-nav>
			<!-- 内容 -->
			<div class="mui-content">
				<div class="book-introduction">
					<div class="top-intr">
						<div class="img">
							<img :src="searchList.GoodsPic">
						</div>
						<div class="info">
							<h4>{{searchList.GoodsName}}</h4>
							<p>作者：{{searchList.Author}}</p>
							<p>书号：{{searchList.ISBN}}</p>
							<!-- <p class="book-price">¥ 12.00</p>
  							<div class="book-buy buy">
  								<span></span>
  								购买
  							</div> -->
						</div>
					</div>
					<p>{{searchList.OverView}}</p>
				</div>
				<!-- 显示由后台富文本框编辑的页面内容的位置 -->
				<div class="text-edit" v-html="searchList.CustomMemo"></div>
				<!-- 列表 -->
				<ul class="song-list">
					<li v-for="(item, index) in searchList.Items" :key="index" :class="{'group-list': item.SubItems}">
						<div class="list">
							<div class="show-arrow">
								<h3>{{item.SubItems ? '' : '曲目'}}</h3>
								<!-- <img v-if="item.SubItems" :class="{'arrow-up': item.isShowSubList}" @click="menuDown(item, item.isShowSubList)"
								 src="../../static/image/bottomArrow.png"> -->
							</div>
							<div class="music-name">
								<!-- <h3 >{{item.Name}}</h3> -->
								<h3 v-html="item.Name"></h3>
								<p><span v-if="item.Composer">作曲：</span>{{item.Composer}}</p>
								<p><span v-if="item.Player">演奏：</span>{{item.Player}}</p>
							</div>
							<div v-if="item.SubItems" class="menu-more" @click="menuDown(item, item.isShowSubList)">
								{{item.isShowSubList ? '收起': '更多'}}
								<img :class="{'arrow-up': item.isShowSubList}" src="../../static/image/bottomArrow.png">
							</div>
							<div class="effect">
								<level-list :items="item" @selected="toBuy" :bindStus="searchList.QRStut"></level-list>

							</div>
						</div>
						<!-- 二级 -->
						<ul v-if="item.SubItems" :class="{'menu-down': item.isShowSubList}">
							<li class="group-list" v-for="(item1,index1) in item.SubItems" :key="index1">
								<div class="list">
									<div class="show-arrow">
										<h3>{{item1.SubItems ? '' : '曲目'}}</h3>
										<!-- <img v-if="item1.SubItems" :class="{'arrow-up': item1.isShowSubList}" @click="menuDown(item1, item1.isShowSubList)"
										 src="../../static/image/bottomArrow.png"> -->
									</div>
									<div class="music-name">
										<!-- <h3>{{item1.Name}}</h3> -->
										<h3 v-html="item1.Name"></h3>
										<p><span v-if="item1.Composer">作曲：</span>{{item1.Composer}}</p>
										<p><span v-if="item1.Player">演奏：</span>{{item1.Player}}</p>
									</div>
									<div v-if="item1.SubItems" class="menu-more" @click="menuDown(item1, item1.isShowSubList)">
										{{item1.isShowSubList ? '收起': '更多'}}
										<img :class="{'arrow-up': item1.isShowSubList}" src="../../static/image/bottomArrow.png">
									</div>
									<div class="effect">
										<level-list :items="item1" @selected="toBuy" :bindStus="searchList.QRStut"></level-list>
									</div>
								</div>
								<!-- 三级 -->
								<ul v-if="item1.SubItems" :class="{'menu-down': item1.isShowSubList}">
									<li v-for="(item2,index2) in item1.SubItems" :key="index2">
										<div class="list">
											<div class="show-arrow">
												<h3>{{item2.SubItems ? '' : '曲目'}}</h3>
												<!-- <img v-if="item2.SubItems" :class="{'arrow-up': item2.isShowSubList}" @click="menuDown(item2, item2.isShowSubList)"
												 src="../../static/image/bottomArrow.png"> -->
											</div>
											<div class="music-name">
												<!-- <h3>{{item2.Name}}</h3> -->
												<h3 v-html="item2.Name"></h3>
												<p><span v-if="item2.Composer">作曲：</span>{{item2.Composer}}</p>
												<p><span v-if="item2.Player">演奏：</span>{{item2.Player}}</p>
											</div>
											<div v-if="item2.SubItems" class="menu-more" @click="menuDown(item2, item2.isShowSubList)">
												{{item2.isShowSubList ? '收起': '更多'}}<img :class="{'arrow-up': item2.isShowSubList}" src="../../static/image/bottomArrow.png"></div>
											<div class="effect">
												<level-list :items="item2" @selected="toBuy" :bindStus="searchList.QRStut"></level-list>
											</div>
										</div>
									</li>
								</ul>
							</li>
						</ul>
					</li>
				</ul>
			</div>

		</template>
		<div v-if="!searchList.GoodsID || !searchList.GoodsName" class="loading">
			<img src="../assets/loading-svg/loading-spining-bubbles.svg" />
		</div>
	</div>
</template>

<script>
	import HeaderNav from '../components/HeaderNav.vue'
	import LevelList from '../components/LevelList.vue'
	import {
		LoginCode
	} from '../mixins/loginCode.js'
	export default {
		name: 'BookInfo',
		mixins: [LoginCode],
		data() {
			return {
				songList: {}, //完整的数据列表
				search: '',
				searchList: {} //搜索后的列表
			}
		},
		components: {
			HeaderNav,
			LevelList
		},
		beforeDestroy() {
			let menuDownArr = []; //存展开的ID
			let scrolllTop = document.documentElement.scrollTop || document.body.scrollTop;

			function find(arr) {
				for (let i = 0; i < arr.length; i++) {
					if (arr[i].SubItems && arr[i].isShowSubList) { //组曲，下拉展开了
						menuDownArr.push(arr[i].ID)
						find(arr[i].SubItems)
					}
				}
			}
			if (this.searchList.Items && this.searchList.Items.length > 0) {
				find(this.searchList.Items)
			}
			// console.log(document.documentElement.scrollTop,document.body.scrollTop )
			let bookInfo = {
				menuDownArr,
				scrolllTop
			};
			sessionStorage.setItem("bookInfo", JSON.stringify(bookInfo))
		},
		methods: {
			back() { //返回点击
				window.history.go(-1);
			},
			initMenuDown() {
				var data = JSON.parse(sessionStorage.getItem('bookInfo'));
				// console.log(data)
				if (data) {
					data.menuDownArr.forEach(item => {
						this.menuDown(null, false, item)
					})
				}


			},
			menuDown(item, isDown, searchID) { //下拉点击
				function find(arr, id) {
					for (let i = 0; i < arr.length; i++) {
						if (arr[i].ID == id) {
							arr[i].isShowSubList = !isDown;
						}
						if (arr[i].SubItems) {
							find(arr[i].SubItems, id)
						}
					}
				}
				if (searchID) {
					find(this.searchList.Items, searchID)
				} else {
					find(this.searchList.Items, item.ID)
				}

			},
			getBookInfo() { //请求图书详情
				let id = this.$route.params.id;
				if (!id) {
					this.$router.replace({
						path: '/ErrorPage',
						query: {
							message: "没有找到该图书！"
						}
					})
					return
				}
				let formData = new FormData();
				formData.append("QRBookID", parseInt(id));
				if (this.getCode()) {
					formData.append("code", this.getCode());
				}
				this.$.post('/QRCodeApi/BookInfo', formData)
					.then((res) => {
						// alert(JSON.stringify(res.data.Data))
						if (!res) return
						if (res.data && res.data.Status < 0) {
							this.$router.replace({
								path: '/ErrorPage',
								query: {
									message: res.data.Message
								}
							})
							return
						}
						//判定绑定与否
						let data = res.data.Data;
						if (data.QRStut && data.QRStut <= 0) { //错误页,二维码有误
							this.$router.replace({
								path: '/ErrorPage',
								query: {
									message: '二维码有误！请联系管理员，' + data.QRStut + "。"

								}
							})
						} else { //图书详情
							if (data.Items && data.Items.length > 0) {
								this.handleTitle(data.Items)
							}
							this.songList = data;
							this.searchList = this.deepCopy(data);
							if (this.searchList.Items && this.searchList.Items.length > 0) {
								this.searchList.Items = this.addDownBool(data.Items)

								this.$nextTick(() => {
									this.initMenuDown()
								})
							}

						}
					})
					.catch((err) => {
						// console.log(err)
						this.$router.replace({
							path: '/ErrorPage',
							query: {
								message: '请稍后重试！'
							}
						})
					})
			},
			handleTitle(arr, titleLevel = 0) {

				let titleArr = [5.7 / 0.28, 4.7 / 0.28, 3.7 / 0.28]
				let maxLen = Math.floor(titleArr[titleLevel]);
				arr.forEach((item) => {
					if (item.Name && item.Name.length > maxLen) {
						// item.Name = this.titleBreak(item.Name, maxLen)
						item.Name = this.newLineStr(item.Name, maxLen, Math.floor(maxLen/2))
					}
					if (item.SubItems) {
						this.handleTitle(item.SubItems, titleLevel + 1)
					}
				})
			},
			newLineStr(str, maxLen, blurLen, newLineTag){  // maxLen 允许单行的最大长度, blurLen 允许的公差, newLineTag 分行符号默认<br />
				if ((str || '').length <= maxLen) return str;   // 如果没有到单行最大长度则直接返回
				
				var okLen = 0;  // 已处理的总长
				
				var lines = [];  // 已处理好的分行
				for(var i = maxLen + okLen; i > maxLen + okLen - blurLen; i--){
					var posNext = "`~!@#$^&*)=|':;',].>》/?~！@#￥……&*）——|}】；：”'。，、？ \-+".indexOf(str[i]);  // 查找当前字符是否特殊字符
					var posPrev = "【[《<{(（“'‘\"".indexOf(str[i]);
					if (posNext >= 0){ //有特殊符号，向后插入换行
						lines.push(str.substr(okLen, i - okLen +1));
						okLen = i + 1;
						i = okLen + maxLen;
					} 
					if (posPrev >= 0){ //有特殊符号，向前插入换行
						lines.push(str.substr(okLen, i - 1 - okLen));
						okLen = i ;	//  i  为  <
						i = okLen + maxLen;
					}
					if(i == maxLen + okLen - blurLen +1){	//循环结束，无特殊符号，
						lines.push(str.substr(okLen, maxLen));
						okLen = maxLen + okLen;
						i = okLen + maxLen;
					}
					if (str.substr(okLen, maxLen).length < maxLen || str.substr(okLen + maxLen + 1).length == 0) {//结束
						lines.push(str.substr(okLen));
						break
					}
					
				}
				
				return lines.join(newLineTag || "<br />");
			},
			// titleBreak(str, maxLen) {
			// 	let result = '';
			// 	let startIndex = 0; //初始位,慢

			// 	while (true) {
			// 		let loop = startIndex;
			// 		for (let i = loop + maxLen - 1; i > loop + (maxLen / 2); i--) {
			// 			if (this.chack_name(str[i])) { //有特殊符号
			// 				result += str.slice(startIndex, i + 1) + '</br>' //slice [)
			// 				startIndex = i + 1;
			// 				break;
			// 			}
			// 			if (i == Math.floor(loop + (maxLen / 2) + 1)) { //无特殊符号
			// 				result += str.substr(startIndex, maxLen);
			// 				startIndex = startIndex + maxLen;
			// 			}
			// 		}
			// 		//结束
			// 		if (str.substr(startIndex, maxLen).length < maxLen || str.substr(startIndex + maxLen + 1).length == 0) {
			// 			return result += str.substr(startIndex)
			// 		}
			// 	}
			// },
			chack_name(str) {
				var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ \\-+]");
				if (pattern.test(str)) {
					return true;
				}
				return false;
			},
			addDownBool(arr, bool = false) { //请求的数据新增一个属性，控制下拉
				arr.forEach((item) => {
					if (item.SubItems) {
						this.$set(item, "isShowSubList", bool)
						item.SubItems = this.addDownBool(item.SubItems)
					}
				})
				return arr;
			},
			toBuy(item) { //跳转选择购买页
				this.$router.push({
					name: 'Purchase',
					params: {
						id: item.ID
					}
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
			copyArr(arr) { //拷贝数组
				let resultArr = [];
				arr.forEach((item, index) => {
					resultArr.push(this.deepCopy(item))
				})
				return resultArr;
			},
			querySelect() { //搜索点击

				if (this.search) {
					let arr = this.copyArr(this.songList.Items);

					this.searchList.Items = this.queryWord(arr)
					this.searchList.Items = this.addDownBool(this.searchList.Items, true)
				} else {
					this.searchList = this.songList
				}

			},
			queryWord(arr) { //递归搜索
				let resultArr = [];
				for (let i = 0, len = arr.length; i < len; i++) {
					if (arr[i].Name.indexOf(this.search) > -1 || arr[i].Player.indexOf(this.search) > -1 || arr[i].Composer.indexOf(
							this.search) > -1) { //有结果
						resultArr.push(arr[i])
						continue
					} else { //搜索子列表
						if (arr[i].SubItems) {
							if (this.queryWord(arr[i].SubItems).length > 0) { //子列表有结果
								resultArr.push(arr[i])
							}

						}
					}

				}
				// console.log(resultArr)
				return resultArr;
			},
		},
		mounted() {
			document.title = '一书一码';
			this.getBookInfo()

		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.mui-content {
		min-height: 100%;
		background: #fff;
		padding-top: .8rem;
	}

	.mui-content:after {
		content: '';
		height: 1.36rem;
		display: block;
	}

	.book-introduction {
		background: #ecf0ef;
		padding: .2rem .4rem;
		margin: .7rem 0 .3rem 0;

	}

	.book-introduction .top-intr {
		display: flex;
		position: relative;
		/* height: 2.1rem; */
		margin-bottom: .3rem;
	}

	.book-introduction .top-intr .img {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.98rem;
		height: 2.61rem;
		box-shadow: .14rem .23rem .57rem 0 rgba(131, 131, 131, 0.55);
		background-color: #FFFFFF;
		position: absolute;
		left: 0;
		top: -.51rem;
	}

	.book-introduction .top-intr .img>img {
		max-width: 100%;
		max-height: 100%;
	}

	.top-intr .info {
		margin-left: 2.3rem;
		overflow: hidden;
	}

	.top-intr .info h4 {
		font-size: .3rem;
		color: #424242;
		line-height: .45rem;
	}

	.top-intr .info p {
		color: #000000;
		opacity: 0.47;
		font-size: .28rem;
		line-height: .45rem;
	}

	.book-introduction>p {
		color: #000000;
		opacity: 0.47;
		font-size: .25rem;
		line-height: .38rem;
	}

	.song-list {
		background: url(../../static/image/bookIntr_bg.png);
		background-size: 100%;
		padding: 0 .15rem;
	}

	.song-list li h3 {
		/* white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis; */
	}

	.song-list li {
		border-bottom: 1px solid #888b8b;
		padding-top: .3rem;
	}

	.song-list li .list {
		display: flex;
	}

	.song-list li .list h3 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: .28rem;
		line-height: 1.5;
	}

	.song-list li .list div.menu-more {
		width: 0.6rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: .24rem;
		/* margin-right: 0.3rem; */
		color: #D3AB6B;
		/* position: relative;
		top: 0.3rem; */
	}

	.song-list li .list>h3 {
		color: #515151;
		margin-right: .24rem;
	}

	.song-list .music-name {
		flex: 1;
		overflow: hidden;
	}

	.song-list .music-name h3 {
		color: #333333;
		opacity: 0.97;
		line-height: 1.5;
		word-break: break-word;
		/* white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis; */
	}

	.song-list .music-name p {
		color: #4a4a4a;
		font-size: .24rem;
		line-height: .32rem;
		height: 0.32rem;
		font-weight: 300;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-bottom: 0.1rem;
	}

	.song-list .effect {
		display: flex;
		align-items: center;
	}

	.song-list .effect a {
		width: .6rem;
		height: 1.2rem;

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.effect a:active {
		opacity: .6;
	}

	.song-list .effect a:last-child {
		margin-right: 0;
	}

	.song-list .effect img {
		width: .3rem;
		height: .3rem;
	}

	.song-list .effect a:last-child img {
		width: .16rem;
	}

	/* 价格按钮 */
	.song-list .group-list {
		border-bottom: 0;
	}

	.song-list .group-list>.list {
		border-bottom: 1px solid #888b8b;
		padding-bottom: .2rem;
	}

	.song-list .group-list ul {
		margin-left: 1rem;
	}

	.group-list ul>li {
		/* border-bottom: 0;
		padding-bottom: 0; */
	}

	.show-arrow {
		color: #515151;
		margin-right: .34rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 0.56rem;
	}

	.group-list img {
		margin-top: .15rem;
		width: .44rem;
		/* height: .2rem; */
		transition: 0.5s;
		/* margin-right: 0.3rem; */
	}

	.group-list img.arrow-up {
		transition: 0.5s;
		transform: rotate(180deg);
	}

	.group-list ul {
		transition: 0.5s;
		/* max-height: 0; */
		height: 0;
		overflow: hidden;
	}

	.group-list ul.menu-down {
		transition: 0.5s;
		/* max-height: 1000px; */
		height: auto;
	}

	.text-edit {
		padding: 0 0.2rem;
	}

	/* 	/deep/.text-edit * {
		position: relative !important;
		top: auto !important;
	}

	/deep/.text-edit div {
		position: relative !important;
		top: auto !important;
	}

	/deep/.text-edit div h2 {
		font-size: 0.3rem !important;
		line-height: 0.4rem !important;
		margin-bottom: 0.3rem !important;
	}

	/deep/.text-edit div p {
		color: #8f8f94 !important;
		font-size: 0.26rem !important;
		line-height: 0.36rem !important;
	} */

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
