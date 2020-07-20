<template>
	<div class="progress-bar" ref="progressBar" @click.stop="progressClick">
		<div class="bar-inner">
			<div class="progress" ref="progress"></div>
			<div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove"
			 @touchend="progressTouchEnd">
				<div class="progress-btn"></div>
			</div>
		</div>
	</div>
</template>

<script>
	const progressBtnWidth = 16; //小球宽度
	export default {
		props: {
			percent: { //百分比
				type: Number,
				default: 0
			}
		},
		data() {
			return {}
		},
		watch: {
			percent(newVal) {
				// console.log(newVal, !this.touch.init)
				if (newVal >= 0 && !this.touch.init) { //百分比大于0并且没有拖动事件
					const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
					const offsetWidth = newVal * barWidth; //偏移宽度
					this.offset(offsetWidth)
				}
			}
		},
		methods: {
			progressTouchStart(e) {
				//是否初始化
				this.touch.init = true;
				//初始x
				this.touch.startX = e.touches[0].pageX;
				//进度条宽度
				this.touch.left = this.$refs.progress.clientWidth;
			},
			progressTouchMove(e) {
				if (!this.touch.init) return
				//差值
				const disX = e.touches[0].pageX - this.touch.startX;
				//新的宽度偏移量
				const offsetWidth = Math.min(Math.max(0, this.touch.left + disX), this.$refs.progressBar.clientWidth)
				this.offset(offsetWidth)
			},
			progressTouchEnd() {
				this.touch.init = false;
				this.changePercent();
			},
			offset(offsetWidth) {
				//进度条
				this.$refs.progress.style.width = `${offsetWidth}px`;
				//小球
				this.$refs.progressBtn.style['transform'] = `translate3d(${offsetWidth}px, 0, 0)`;
			},
			changePercent() {
				const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
				//新的百分比
				const percent = this.$refs.progress.clientWidth / barWidth;
				// console.log(percent)
				this.$emit('percentChange', percent)
			},
			progressClick(e) {
				const rect = this.$refs.progressBar.getBoundingClientRect();
				const offsetWidth = e.pageX - rect.left;
				//   点击btn时e.offsetX获取不对
				//   this.offset(e.offsetX);
				this.offset(offsetWidth);
				this.changePercent();
			}
		},
		created() {
			this.touch = {};
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.progress-bar {
		height: 30px;

	}

	.progress-bar .bar-inner {
		position: relative;
		top: 13px;
		height: 4px;
		background: #ebedf0;
	}

	.progress {
		position: absolute;
		height: 100%;
		background: #ffcd32;
	}

	.progress-btn-wrapper {
		position: absolute;
		left: -8px;
		top: -13px;
		width: 30px;
		height: 30px;
	}

	.progress-btn {
		position: relative;
		top: 7px;
		left: 7px;
		box-sizing: border-box;
		width: 16px;
		height: 16px;
		border: 3px solid #e8e8e8;
		border-radius: 50%;
		background: #ffcd32;
	}
</style>
