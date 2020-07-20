<template>
	<div style="height: 100%;">
		<!-- 头部 -->
		<header-nav>
			<h1 class="top-title">已购乐曲</h1>
		</header-nav>

		<div v-if="musicList.length !== 0" class="mui-content">
			<ul>
				<li v-for="(item, index) in musicList" :key="index">
					<div class="record">
						<div class="img">
							<img :src="item.BookPic">
						</div>

						<div class="introduce">
							<h3>{{item.BookName}}</h3>
							<p class="author">作者：{{item.Author}}</p>
							<p>书号：{{item.ISBN}}</p>
						</div>
					</div>
					<a :class="['mui-icon',item.isShowSubList ? 'mui-icon-arrowup' :'mui-icon-arrowdown', 'arrow']" @click="menuDown(index)"></a>
					<div :class="['music-list', {'active': item.isShowSubList}]">
						<ul>
							<li v-for="(item1, index1) in item.Items" :key="index1" @click="toDatails(item1, item.BookID)">
								<span>
									<img v-show="item1.ItemType == 3||item1.ItemType == 0" src="../../static/image/bookIntr_word.png">
									<img v-show="item1.ItemType == 2" src="../../static/image/bookIntr_videoPlay.png">
									<img v-show="item1.ItemType == 1" src="../../static/image/bookIntr_musicPlay.png">
								</span>

								<p>{{item1.ItemName}}</p>
								<!-- <a href="videoPlay.html?http://music.163.com/song/media/outer/url?id=65538.mp3" class="play"></a> -->
							</li>
						</ul>
					</div>
				</li>
			</ul>
		</div>
		<div v-if="musicList.length === 0 && !isEmpty" class="loading">
			<img src="../assets/loading-svg/loading-spining-bubbles.svg" />
		</div>
		<div v-if="isEmpty" class="mui-content">
			<div class="is-empty">
				您还没有购买过商品！
			</div>
		</div>
	</div>
</template>

<script>
	import HeaderNav from '../components/HeaderNav.vue'
	import {
		LoginCode
	} from '../mixins/loginCode.js'
	export default {
		name: 'MusicRecord',
		mixins: [LoginCode],
		data() {
			return {
				musicList: [],
				isEmpty: false
			}
		},
		components: {
			HeaderNav
		},
		methods: {
			menuDown(index) { //下拉菜单
				let bool = this.musicList[index].isShowSubList
				this.musicList[index].isShowSubList = !bool;
			},
			getMusicList() {
				let formData = new FormData();
				if (this.getCode()) {
					formData.append("code", this.getCode());
				}
				this.$.post('/MemberApi/MyPurchasedBook', formData)
					.then(res => {
						// console.log(res)
						if (!res) return
						if (res.data && res.data.Status < 0) {
							this.$router.replace({
								path: '/ErrorPage',
								query: {
									message: res.data.Message
								}
							})
						}
						let data = res.data.Data;
						data.forEach((item) => {
							item.isShowSubList = false
						})
						this.musicList = data;
						this.isEmpty = this.musicList.length == 0
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
			toDatails(item, bookID) {
				// console.log(item)
				if (item.ItemType == 3) { //pdf、下载页
					this.$router.push({
						path: '/SendMile',
						query: {
							RemoteID: item.ItemID,
							QRItemID: item.QRBookItemID
						}
					})
				} else { //音频视频
					this.$router.push({
						path: '/PlayVideo',
						query: {
							// itemType: item.ItemType,
							id: "R" + item.OrderItemID
						}
					})
				}
			}
		},
		mounted() {
			this.getMusicList()
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.mui-content {
		min-height: 100%;
		background: #fff;
		padding: .8rem .27rem 1.8rem;
		margin-top: .2rem;
	}

	.mui-content .is-empty {
		font-size: 0.3rem;
		text-align: center;
		margin-top: 0.5rem;
	}

	.mui-content>ul>li {
		padding: 0 .24rem .22rem .24rem;
		background-color: #f2f2f2;
		border-radius: .1rem;
		overflow: inherit;
		margin-top: .7rem;
	}

	.mui-content li .record {
		/* height: 2.17rem; */
		display: flex;

		position: relative;
	}

	.mui-content .record>.img {
		width: 1.8rem;
		height: 2.5rem;
		box-shadow: .14rem .23rem .57rem 0 rgba(131, 131, 131, 0.55);
		border-radius: .1rem;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: -.32rem;
	}

	.mui-content .record>.img>img {
		max-width: 100%;
		max-height: 100%;
	}

	.mui-content .introduce {
		margin: .38rem 0 0 2.4rem;
		overflow: hidden;
	}

	.mui-content .introduce h3 {
		color: #2c2c2c;
		font-size: .3rem;
		line-height: .45rem;
		/* white-space: nowrap;
	    overflow: hidden;
	    text-overflow: ellipsis; */
	}

	.mui-content .introduce p {
		font-size: .28rem;
		line-height: .45rem;
	}

	.mui-content .author {
		color: #a8a8a8;
	}

	.mui-content .introduce p:last-child {
		color: #000000;
		opacity: 0.48;
	}

	.mui-content li>a {
		display: block;
		font-size: .5rem;
		cursor: pointer;
		text-align: center;
		color: #d2aa6f;
	}

	.mui-content .music-list {
		height: 0;
		overflow: hidden;
	}

	.mui-content .music-list.active {
		height: auto;
	}

	.music-list li {
		height: .3rem;
		margin-top: .3rem;
		display: flex;
		align-items: center;
	}

	.music-list li span {
		display: block;
	}

	.music-list li span:first-child {
		margin-right: .05rem;
		width: .2rem;
		height: .2rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.music-list li span:first-child img {
		width: 100%;
	}

	.music-list li .play {
		width: .23rem;
		height: .23rem;
		background: url(../../static/image/buy_musicPlay.png) no-repeat;
		background-size: .23rem .23rem;
	}

	.music-list li .play:active {
		opacity: .6;
	}

	.music-list li p {
		color: #000000;
		opacity: 0.97;
		font-size: .25rem;
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		padding-right: .2rem;
		margin-bottom: 0;
	}

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
