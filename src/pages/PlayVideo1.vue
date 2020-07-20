<template>
	<div style="height: 100%;">
		<!-- 头部 -->
		<header-nav>
			<h1 class="top-title">音视频播放</h1>
		</header-nav>
		<!-- 内容 -->
		<div class="mui-content">
			<p class="play-title">{{videoObj.AttachName}}</p>
			<!-- 视频 -->
			<div class="prism-player" id="J_prismPlayer"></div>
			
			<!-- <iframe src="https://etest.yuehi.cc/page/bookInfo.html" width="100%" height="500px"></iframe> -->
			

		</div>
	</div>
</template>

<script>
	import HeaderNav from '../components/HeaderNav.vue'
	import {
		LoginCode
	} from '../mixins/loginCode.js'
	export default {
		name: 'PlayVideo',
		mixins: [LoginCode],
		data() {
			return {
				videoObj: {},
				playList: [],
			}
		},
		components: {
			HeaderNav
		},
		computed: {
		},
		methods: {
			getPlayList() {
				let formData = new FormData();
				formData.append("VideoID", this.$route.query.id);

				if (this.getCode()) {
					formData.append("code", this.getCode());
				}
				this.$.post('/QRCodeApi/PlayVideo', formData)
					.then(res => {
						if (!res) return
						if (res.data && res.data.Status < 0) {
							this.$router.replace({
								path: '/ErrorPage',
								query: {
									message: res.data.Message
								}
							})
						}
						let stut = res.data.Data.Stut;


						//正规逻辑
						if (stut == 0) {
							this.$router.replace({
								path: '/ErrorPage',
								query: {
									message: '不存在的单曲！'
								}
							})
						} else if (stut == 101) {
							this.$router.replace({
								path: '/ErrorPage',
								query: {
									message: '无权限查看！'
								}
							})
						} else if (stut == 102) {
							this.$router.replace({
								path: '/ErrorPage',
								query: {
									message: '单曲无法查看！'
								}
							})
						} else { //成功
							this.videoObj = res.data.Data;
							
							if (!this.videoObj.Ext.Result) { //音频
								this.playList.push(this.videoObj)
							}
							
							this.creatPlay()
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
			creatPlay() {
				let self = this;
				let playOptions = {
					id: "J_prismPlayer",
					// cover: this.videoObj.Ext.CoverUrl || require("../../static/image/videoPlay_book.jpg"),
					// vid: this.videoObj.Ext.VideoId,
					// playauth: this.videoObj.Ext.PlayAuth,
					autoplay: false,
					isLive: false,
					playsinline: true,
					width: "100%",
					height: "252px",
					controlBarVisibility: "click",
					useH5Prism: true,
					useFlashPrism: false,
					x5_type: "h5"
				}
				if (this.videoObj.Ext.Result) { //.m3u8视频
					playOptions.vid = this.videoObj.Ext.VideoId;
					playOptions.playauth = this.videoObj.Ext.PlayAuth;
				}else{
					playOptions.cover = require("../../static/image/videoPlay_book.jpg");
					playOptions.source = this.playList[0].Ext.VideoId;
				}
				var player = new Aliplayer(playOptions, function(player) {
					// source: this.playList[this.currentIndex].Ext.VideoId,
					// console.log('播放器创建好了。',player)
					// let video = document.querySelector('#J_prismPlayer video')
					
					// video.setAttribute('x5-playsinline', "")
					// video.setAttribute('webkit-playsinline', "")
					// video.setAttribute('x5-video-player-type', "h5-page")
					// console.log(video)

				})
			}
		},
		mounted() {
			this.getPlayList()
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	/* 主体内容 */
	.mui-content {
		min-height: 100%;
		background: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: .8rem;
	}

	.mui-content:after {
		content: '';
		height: 1.36rem;
		display: block;
	}

	.mui-content .play-title {
		font-size: 0.4rem;
		color: #000;
		margin-top: 0.3rem;
		margin-bottom: 0.2rem;
	}

	/* 相关推荐 */
	.recommend {
		width: 100%;
		margin-bottom: .5rem;
	}

	.recommend h3 {
		color: #424242;
		font-size: .35rem;
		padding: 0 .71rem;
	}

	.recommend ul {
		padding: 0 .71rem;
		display: flex;
	}

	.recommend li {
		flex: 1;
		margin-right: .56rem;
		overflow: hidden;
	}

	.recommend li:last-child {
		margin-right: 0;
	}

	.recommend li img {
		margin: .35rem 0 .1rem 0;
		width: 1.65rem;
		height: 2.09rem;
	}

	.recommend p {
		font-size: .28rem;
		line-height: .4rem;
	}

	.recommend li .cover-name {
		color: #424242;
		display: -webkit-box;
		overflow: hidden;
		white-space: normal;
		text-overflow: ellipsis;
		word-wrap: break-word;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.recommend li .cover-price {
		color: #d3ab6b;
	}

	/* 购买按钮 */
	.recommend li a {
		display: none;
		color: #fff;
		font-size: .2rem;
		width: .9rem;
		height: .35rem;
		line-height: .35rem;
		background-color: #d3ab6b;
	}

	.recommend li a>span {
		display: inline-block;
		width: .17rem;
		height: .17rem;
		background: url(../../static/image/car_change.png) no-repeat;
		background-size: .17rem .17rem;
		margin: 0 .08rem;
	}

	.prism-player {
		margin-bottom: .4rem;
	}

	/* /deep/video.center{
	    object-position:50% 50% !important;

	} */
	/* /deep/video {
		object-fit: contain !important;
	} */
</style>
