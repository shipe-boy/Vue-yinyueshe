<template>
	<div class="audioWrap" @click="handlePrevent">
		<img src="../../static/image/videoPlay_book.jpg" class="music-book">
		<div class="audio">
			<div class="top-part">
				<!-- 模式 -->
				<span class="randow"></span>
				<!-- 进度条 -->
				<div class="progress">
					<progress-bar :percent="percent" @percentChange="changeProgress"></progress-bar>
				</div>
				<!-- 静音 -->
				<div :class="['trumpet' ,{'active': isMute}]" @click.stop="playVolume">
					<!-- <div class="volume-control" v-if="isVolumeControl">
						<progress-bar :percent="volume" @percentChange="changeVolume"></progress-bar>
					</div> -->
				</div>
			</div>
			<div class="time">
				<span class="now-time">{{ format(currentTime) }}</span>
				<span class="total-time" v-show="isFinite(duration) && duration!=0">{{ format(duration) }}</span>
			</div>
			<div class="music-play">
				<div class="play-list"></div>
				<div :class="['prev-music', {active: isPrevOrNext}]" @click="prev"></div>
				<div :class="['play-music', {'active': !playing}]" @click="togglePlaying"></div>
				<div :class="['next-music', {active: isPrevOrNext}]" @click="next"></div>
				<div class="play-speed" @click.stop="toggleSpeedList">
					<ul v-show="isShowSpeedList">
						<li :class="{active:item.active}" v-for="(item, index) in speedList" :key="index" @click="changeSpeed(index)">{{item.speed}}X</li>
					</ul>
				</div>
			</div>
			<audio v-if="!isM3u8" ref="audio" :src="currentSong.AttachUrl" @error="error" @play="ready" @timeupdate="updateTime" @ended="end"></audio>
			<div v-if="isM3u8" class="prism-player" id="J_prismPlayer"></div>
			<!-- <audio src="http://music.163.com/song/media/outer/url?id=1316563427.mp3">
				当前浏览器不支持audio
			</audio> -->
		</div>
	</div>
</template>

<script>
	import ProgressBar from '../components/ProgressBar.vue'
	export default {
		props: {
			isM3u8: {
				type: Boolean,
				default: false
			},
			currentSong: {
				type: Object,
				default(){
					return {}
				} 
			},
			isPrevOrNext: {
				type: Boolean,
				default: false
			},
			playList: {
				type: Array,
				default(){
					return []
				} 
			}
		},
		data() {
			return {
				songReady: false, //节流，防止连续点击出错
				currentTime: 0,		//歌曲播放时间
				mode: 1	,//播放模式	{0:循环，1:单曲，2:随机}
				playing: false,
				duration: 0,
				player: null,
				p: 0,	//m3u8播放百分比
				isMute: false,
				isShowSpeedList: false,
				speedList: [
					{speed: 0.5, active: false},
					{speed: 0.75, active: false},
					{speed: 1, active: true},
					{speed: 1.25, active: false},
					{speed: 1.5, active: false},
					{speed: 2, active: false}
				]
			}
		},
		components: {
			ProgressBar
		},
		computed: {
			percent() { //百分比
					if(this.isM3u8){
						return this.p;
					}else{
						return this.currentTime / this.duration;
					}
			},
			currentIndex(){		//当前歌曲下表
				
				let index = -1;
				index = this.playList.findIndex((item) => {
					return item == this.$route.query.id.substr(1)
				})
				return index
			}
		},
		watch: {
			//歌曲发生变化时
			currentSong: {
				immediate: true,
				deep: true,
				handler (newSong, oldSong) {
					if (!newSong.AttachID) return
					if(oldSong){
						if (newSong.AttachID === oldSong.AttachID) return
					}
					this.currentTime = 0;
					this.p = 0;
					this.duration = 0;
					clearTimeout(this.timer);
					//dom加载完成后
					this.timer = setTimeout(() => { 
						if(this.isM3u8){
							this.createPlayer()
						}else{
							this.songReady = true;
							this.duration = parseFloat(this.$refs.audio.duration)
							this.$refs.audio.volume = 1;
							if (!this.playing) { 
								this.togglePlaying()
							}
						}
						
					}, 1000)
				}
			},
			playing(newVal) {	//播放状态
				this.$nextTick(() => {
					let audio = this.$refs.audio || this.player;
					newVal ? audio.play() : audio.pause();
				})
			}
		},
		methods: {
			changeSpeed(index){
				this.speedList.forEach((item,i) => {
					if(i != index){
						item.active = false
					}else{
						item.active = true
					}
				})
				let speed = this.speedList[index].speed;
				if(this.isM3u8){
					this.player.setSpeed(speed)
				}else{
					this.$refs.audio.playbackRate=speed
				}
			},
			toggleSpeedList(){
				this.isShowSpeedList = !this.isShowSpeedList
			},
			handlePrevent(){
				if(this.isShowSpeedList){
					this.isShowSpeedList = false
				}
			},
			format(time) { //格式化事件戳
				time = time | 0; //相当于Math.floor(time)
				const minute = time / 60 | 0;
				const second = this.pad(time % 60);
				return `${minute}:${second}`
			},
			pad(num, n = 2) { //给时间补0
				//n字符串长度
				let len = num.toString().length;
				while (len < n) {
					num = '0' + num;
					len++;
				}
				return num;
			},
			changeProgress(percent) {
				let currentTime = this.duration * percent;
				if(this.isM3u8){
					this.player && this.player.seek(currentTime)
				}else{
					this.$refs.audio.currentTime = currentTime;
				}
				
				if (!this.playing) { //暂停时拖动后播放
					this.togglePlaying()
				}
			},
			end() { //歌曲播放完了
				if (this.mode === 1) { //单曲循环
					this.loop();
				} else {
					this.next()
				}
			},
			loop() { //单曲循环
				if(this.isM3u8){
					this.player && this.player.seek(0)
					this.player && this.player.play();
				}else{
					this.$refs.audio.currentTime = 0;
					this.$refs.audio.play();
				}
				
			},
			next() {
				if(!this.isPrevOrNext) return
				if (!this.songReady) return //节流
				if(this.playList.length === 1){
					this.loop();
					if (!this.playing) { //要改变playing状态
						this.togglePlaying()
					}
					return;
				}else{
					try{
						if(this.player){
							this.player && this.player.pause()
							this.player && this.player.dispose()
						}
					}catch(e){
						console.log(e)
					}
					
					if (this.playing) { 
						this.changeSpeed(2)
						this.togglePlaying()
					}
					let index = this.currentIndex + 1;
					if (index === this.playList.length) {
						index = 0;
					}
					
					this.$emit('changeSong', this.playList, index)
					
				}
				this.songReady = false;
			},
			prev() {
				if(!this.isPrevOrNext) return
				if (!this.songReady) return //节流
				if(this.playList.length === 1){
					this.loop();
					if (!this.playing) { //暂停时切换要改变playing状态
						this.togglePlaying()
					}
					return
				}else{
					try{
						if(this.player){
							this.player && this.player.pause()
							this.player && this.player.dispose()
						}
					}catch(e){
						console.log(e)
					}
					if (this.playing) { 
						this.changeSpeed(2)
						this.togglePlaying()
					}
					let index = this.currentIndex - 1;
					if (index === -1) {
						index = this.playList.length - 1;
					}
					this.$emit('changeSong', this.playList, index)
					
				}
				this.songReady = false;
			},
			togglePlaying() {	//播放和暂停
				if (!this.songReady) return
				this.playing = !this.playing;
			},
			error() { //解决歌曲加载失败后songReady一直未false，其他按钮不能用
			
				this.songReady = true;
			},
			updateTime(e) {//播放时间
				this.currentTime = e.target.currentTime;
			},
			ready() {	//播放
				this.songReady = true;
			},
			playVolume(){	//音量
				this.isMute = !this.isMute;
				if(this.isMute){
					if(this.isM3u8){
						this.player.setVolume(0)
					}else{
						// this.$refs.audio.volume = 0; 
						this.$refs.audio.muted=true
					}
				}else{
					if(this.isM3u8){
						this.player.setVolume(1)
					}else{
						// this.$refs.audio.volume = 1; 
						this.$refs.audio.muted=false
						this.$refs.audio.volume = 1;
					}
				}
			},
			createPlayer(){
				
				let self = this;
				var player = new Aliplayer({
					id: "J_prismPlayer",
					source: this.currentSong.Ext.VideoId,
					autoplay: true,
					isLive: false,
					// rePlay: false,
					playsinline: true,
					preload: true,
					width: "0",
					height: "0",
					"mediaType": "audio",
					controlBarVisibility: "hover",
					useH5Prism: true,
				}, function(player) {
					self.player = player;
					self.songReady = true;
					self.player.setVolume(1)
					player.on('canplay', ()=>{
						if(isFinite(self.duration) && self.duration != 0) return
						self.duration = parseFloat(player.getDuration())
					})
					player.on('timeupdate', ()=>{	//播放百分比
						// console.log(isFinite(self.duration))
						if(!isFinite(self.duration) || self.duration == 0){
							// !isFinite(self.duration) && self.duration!=0
							
							self.duration = parseFloat(player.getDuration())
						}
						self.currentTime = self.player.getCurrentTime()
						self.p = self.player.getCurrentTime() / self.duration;
						// console.log(self.player.getCurrentTime(),self.duration)
					})
					player.on('ended', ()=>{
						self.loop()
					})
					player.on('playing', ()=>{
						// console.log("playing")
						if (!self.playing) {
							self.changeSpeed(2)
							self.togglePlaying()
						}
					})
					player.on('ready', ()=>{
						// setTimeout(() => {
							player.play()
							
						// }, 1000)
						// self.$nextTick(() => {
						// 	if (!self.playing) {
						// 		self.togglePlaying()
						// 	}
						// })
					})
				})
			}
		},
		mounted() {
			// console.log(this.playList)
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.music-book {
		width: 100%;
		height: auto;
		margin: 0 0 .7rem 0;
	}

	.audioWrap {
		margin-bottom: .4rem;
	}

	/* 播放器 */
	.audio {
		width: 100%;
		margin-bottom: .77rem;
	}

	.audio .top-part {
		padding: 0 .85rem;
		display: flex;
		align-items: center;
	}

	.audio .top-part>span {
		display: block;
		width: .3rem;
		height: .3rem;
	}

	.audio .top-part .randow {
		/* background: url(../../static/image/videoPlay_random.jpg.png) no-repeat center/contain; */
		background: url(../../static/image/loop.png) no-repeat center/contain;
		/* background-size: .18rem .18rem; */
	}

	.audio .top-part .trumpet {
		position: relative;
		width: .3rem;
		height: 0.3rem;
		background: url(../../static/image/videoPlay_trumpet.jpg.png) no-repeat center/contain;
		/* background-size: .23rem .18rem; */
	}
	.audio .top-part .trumpet.active{
		background: url(../../static/image/muted.png) no-repeat center/contain;
	}

	.audio .progress {
		flex: 1;
		height: 30px;
		/* background: #ebedf0; */
		border-radius: .07rem;
		margin: 0 .33rem;
	}

	.audio .progress .progress-bar {
		/* position: relative;
		height: .14rem;
		width: .37rem;
		background: #f6b333; */
	}

	.audio .progress .progress-bar>span {
		height: .37rem;
		width: .37rem;
		display: block;
		background: url(../../static/image/videoPlay_progress.jpg.png) no-repeat;
		background-size: .37rem .37rem;

		position: absolute;
		right: -.18rem;
		top: 50%;
		transform: translateY(-50%);
	}

	.audio .time {
		width: 100%;
		margin: .2rem 0;
		display: flex;
	}

	.audio .time>span {
		color: #525252;
		font-size: .3rem;
		line-height: .6rem;
		font-weight: 200;

	}

	.audio .time .now-time {
		margin-left: 1.37rem;
	}

	.audio .time .total-time {
		flex: 1;
		text-align: right;
		margin-right: 1.5rem;
	}

	.audio .music-play {
		display: flex;
		align-items: center;
		justify-content: space-around;
		margin: 0 0.7rem;
	}

	.audio .music-play>div {
		display: block;
		height: .3rem;
		width: .3rem;
	}
	.audio .music-play .prev-music{
		background: url(../../static/image/prev.png) no-repeat center/contain;
	}
	.audio .music-play .prev-music.active {
		background: url(../../static/image/videoPlay_up.jpg.png) no-repeat center/contain;
		/* background-size: .19rem .2rem; */
	}

	.audio .music-play .play-music {
		width: 0.65rem;
		height: 0.65rem;
		background: url(../../static/image/videoPlay_play.jpg.png) no-repeat center/contain;
		/* background-size: .5rem .5rem; */
	}
	.audio .music-play .play-music.active{
		background: url(../../static/image/videoPlay_pause.png) no-repeat center/contain;
	}
	
	.audio .music-play .next-music{
		background: url(../../static/image/next.png) no-repeat center/contain;
	}
	.audio .music-play .next-music.active {
		background: url(../../static/image/videoPlay_down.jpg.png) no-repeat center/contain;
		/* background-size: .19rem .2rem; */
	}
	.audio .music-play .play-list{
		width: 0.45rem;
		height: 0.45rem;
		/* background: url(../../static/image/playlist.png) no-repeat center/contain; */
	}
	.audio .music-play .play-speed{
		position: relative;
		background: url(../../static/image/play-speed.png) no-repeat center/contain;
	}
	.audio .music-play .play-speed > ul{
		position: absolute;
		left: -0.2rem;
		bottom: 0.4rem;
		padding: 0 0.2rem;
		background-color: #fff;
	}
	.audio .music-play .play-speed li.active{
		color: #007AFF;
	}
	#J_prismPlayer{
		height: 0;
		width: 0;
		overflow: hidden;
	}
	.volume-control{
		position: absolute;
		left: 0.3rem;
		top: auto;
		width: 0.6rem;
		height: 30px;
	}
</style>
