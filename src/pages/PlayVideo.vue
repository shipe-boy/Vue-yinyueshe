<template>
	<div v-cloak style="height: 100%;">
		<!-- 头部 -->
		<header-nav>
			<h1 class="top-title">音视频播放</h1>
			<span v-if="isPrevOrNext" @click="backInfo">返回图书</span>
		</header-nav>
		<!-- 内容 -->
		<div class="mui-content" v-if="videoObj.AttachName">
			<div class="title-wrap">
				<p v-if="isPlayVideo && isPrevOrNext" class="prev" @click="prev">上一首</p>
				<p class="play-title">{{videoObj.AttachName}}</p>
				<p v-if="isPlayVideo && isPrevOrNext" class="next" @click="next">下一首</p>
			</div>
			
			<!-- 视频 -->
			<div v-if="isPlayVideo" class="prism-player" id="J_prismPlayer"></div>
			<!-- 音频 -->
			<audio-player v-if="!isPlayVideo" :isM3u8="isM3u8Audio" :currentSong="currentSong" :playList="playIDList" @changeSong="changeSong" :isPrevOrNext="isPrevOrNext"></audio-player>

		</div>
	</div>
</template>

<script>
	import HeaderNav from '../components/HeaderNav.vue'
	import AudioPlayer from '../components/AudioPlayer.vue'
	import {
		LoginCode
	} from '../mixins/loginCode.js'
	export default {
		name: 'PlayVideo',
		mixins: [LoginCode],
		data() {
			return {
				videoObj: {},
				currentSong: {},
				playIDList: [],
				isM3u8Audio: false,
				isPrevOrNext: false,
				onceGetplayID: false,
				currentIndex:0,
				player: null
			}
		},
		components: {
			HeaderNav,
			// VideoPlayer,
			AudioPlayer
		},
		computed: {
			isPlayVideo() {
				// console.log(this.videoObj.ItemType == 2)
				return this.videoObj.ItemType == 2;
			}
		},
		watch: {
			$route(){
				this.getPlayList()
			}
		},
		methods: {
			changeSong(playIDList, index) {
				this.currentIndex = index;
				let playID = playIDList[index]
				let route = this.$route.query.id.substr(0,1)
				// console.log(this.playIDList, index, playID,this.videoObj)
				this.$router.push({
					path: '/PlayVideo',
					query: {
						id: route + playID,
						QRBookID: this.$route.query.QRBookID
					}
				})
			},
			prev(){
				if(!this.videoReady) return
				try{
					if(this.player){
						this.player && this.player.pause()
						this.player && this.player.dispose()
					}
				}catch(e){
					console.log(e)
				}
				let index = this.currentIndex - 1;
				if (index === -1) {
					index = this.playIDList.length - 1;
				}
				this.changeSong(this.playIDList, index)
				this.videoReady = false
			},
			next(){
				if(!this.videoReady) return
				try{
					if(this.player){
						this.player && this.player.pause()
						this.player && this.player.dispose()
					}
				}catch(e){
					console.log(e)
				}
				let index = this.currentIndex + 1;
				if (index === this.playIDList.length) {
					index = 0;
				}
				this.changeSong(this.playIDList, index)
				this.videoReady = false
			},
			getPlayList() {
				let route = this.$route.query.id.substr(0,1)
				if(route == "R"){
					this.isPrevOrNext = false
				}else{
					this.isPrevOrNext = true
				}
				
				let formData = new FormData();
				formData.append("VideoID", this.$route.query.id);

				if (this.getCode()) {
					formData.append("code", this.getCode());
				}
				this.$.post('/QRCodeApi/PlayVideo', formData)
					.then(res => {
						if (!res) return
						// alert(JSON.stringify(res.data))
						if (res.data && res.data.Status < 0) {
							this.$router.replace({
								path: '/ErrorPage',
								query: {
									message: res.data.Message
								}
							})
							return
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
							// this.mui.toast("不存在的单曲",{ duration:'long', type:'div' })
						} else if (stut == 101) {
							this.$router.replace({
								path: '/ErrorPage',
								query: {
									message: '无权限查看！'
								}
							})
							// this.mui.toast("无权限查看",{ duration:'long', type:'div' })
						} else if (stut == 102) {
							this.$router.replace({
								path: '/ErrorPage',
								query: {
									message: '单曲无法查看！'
								}
							})
							// this.mui.toast("单曲无法查看",{ duration:'long', type:'div' })
						} else { //成功
							// console.log(res.data.Data)
							this.videoObj = res.data.Data;
							if (this.videoObj.ItemType == 2) { //.m3u8视频
								this.$nextTick(()=> {
									
									this.creatPlay()
								})
								
							} else {
								if (this.videoObj.Ext.VideoId.indexOf('.m3u8') > -1) { //.m3u8的音频
									this.isM3u8Audio = true
								} else { //直接是地址.mp3，
									this.isM3u8Audio = false
								}
								this.currentSong = this.videoObj
							}
							if(!this.onceGetplayID){
								this.getPlayIDList()
							}
							
						}

					})
					.catch(err => {
						// console.log(err)
						this.$router.replace({
							path: '/ErrorPage',
							query: {
								message: '请稍后重试！'
							}
						})
					})
			},
			getPlayIDList(){
				let QRBookID = this.$route.query.QRBookID;
				let nowID = this.$route.query.id.substr(1)
				if(!QRBookID || QRBookID== 0){
					console.log("QRBookID不正确")
					this.playIDList.push(nowID)
					return
				}
				let formData = new FormData();
				formData.append("QRBookID", QRBookID);
				
				
				if (this.getCode()) {
					formData.append("code", this.getCode());
				}
				this.$.post('/MemberApi/MyItemIDs', formData)
					.then(res => {
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
						this.onceGetplayID = true
						let data = res.data.Data
						if(data && data.length > 0){
							this.playIDList.push(...data)
						}
						this.currentIndex = this.playIDList.findIndex((item) => {
							return nowID == item
						})
						
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
				var player = new Aliplayer({
					id: "J_prismPlayer",
					// cover: this.videoObj.Ext.CoverUrl,
					vid: this.videoObj.Ext.VideoId,
					playauth: this.videoObj.Ext.PlayAuth,
					autoplay: false,
					isLive: false,
					rePlay: true,
					playsinline: true,
					// preload: true,
					width: "100%",
					height: "252px",
					// "mediaType": "video",
					controlBarVisibility: "click",
					useH5Prism: true
					// x5_video_position: 'top',
					// x5_type: 'h5', //声明启用同层H5播放器，支持的值：h5
					// x5_fullscreen: false
				}, function(player) {
					// console.log('播放器创建好了。',player)
					self.player = player
					self.videoReady = true

					self.$nextTick(() => {
						self.player.play()
					})
				})
			},
			backInfo(){
				let id = this.$route.query.QRBookID;
				if(!id) return
				this.$router.replace({
					name: 'BookInfo',
					params: {
						id: id,
					}
				})
			}
		},
		created() {
			this.videoReady = false;
		},
		mounted() {
			this.getPlayList()
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	[v-cloak]{
	            display: none
	        }
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
	.mui-content .title-wrap{
		width: 100%;
		display: flex;
		align-items: flex-start;
		justify-content: space-around;
	}
	.mui-content .title-wrap .prev,
	.mui-content .title-wrap .next{
		width: 18%;
		height: 0.9rem;
		text-align: center;
		color: #000000;
		margin: 0;
		line-height: 0.9rem;
	}
	.mui-content .play-title {
		width: 64%;
		text-align: center;
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
	/deep/video {
		object-fit: contain !important;
	}
</style>
