<template>
	<div class="level-icon">
		<!-- 免费 -->
		<template v-if="items.ShowLevel == 0 && items.ItemType != 0">
			<template v-if="items.ItemType == 2 || items.ItemType == 1">
				<template v-if="!items.OnlineUrl">
					<router-link :to="{path: '/PlayVideo', query:{QRBookID: QRBookID,id: 'A'+ items.ID}}">
						<img v-if="items.ItemType == 2" src="../../static/image/bookIntr_videoPlay.png">
						<img v-if="items.ItemType == 1" src="../../static/image/bookIntr_musicPlay.png">
					</router-link>
				</template>
				<template v-if="items.OnlineUrl">
					<a :href="items.OnlineUrl">
						<img v-if="items.ItemType == 2" src="../../static/image/bookIntr_videoPlay.png">
						<img v-if="items.ItemType == 1" src="../../static/image/bookIntr_musicPlay.png">
					</a>
				</template>
			</template>
			
			<template v-if="!items.ItemType || items.ItemType == 3">
				<router-link :to="{path: '/SendMile', query:{QRItemID: items.ID,RemoteID:items.RemoteID}}">
					<template v-if="!items.ItemType">
						<img src="../../static/image/bookIntr_download.png"> 
					</template>
					<!--pdf -->
					<template v-if="items.ItemType == 3">
						<img src="../../static/image/bookIntr_word.png">
					</template>
				</router-link>
			</template>
		</template>
		<!-- 绑定 -->
		<template v-if="items.ShowLevel == 1 && items.ItemType != 0">
			<!-- 绑定的 -->
			<template v-if="bindStus == 2">
				<template v-if="items.ItemType == 2 || items.ItemType == 1">
					<template v-if="!items.OnlineUrl">
						<router-link :to="{path: '/PlayVideo', query:{QRBookID: QRBookID,id: 'A'+ items.ID}}">
							<img v-if="items.ItemType == 2" src="../../static/image/bookIntr_videoPlay.png">
							<img v-if="items.ItemType == 1" src="../../static/image/bookIntr_musicPlay.png">
						</router-link>
					</template>
					<template v-if="items.OnlineUrl">
						<a :href="items.OnlineUrl">
							<img v-if="items.ItemType == 2" src="../../static/image/bookIntr_videoPlay.png">
							<img v-if="items.ItemType == 1" src="../../static/image/bookIntr_musicPlay.png">
						</a>
					</template>
					
				</template>
				
				<template v-if="!items.ItemType || items.ItemType == 3">
					<router-link :to="{path: '/SendMile', query:{QRItemID: items.ID,RemoteID:items.RemoteID}}">
						<template v-if="!items.ItemType">
							<img src="../../static/image/bookIntr_download.png"> 
						</template>
						<!--pdf -->
						<template v-if="items.ItemType == 3">
							<img src="../../static/image/bookIntr_word.png">
						</template>
					</router-link>
				</template>
			</template>
			<!-- 未绑定的 -->
			<template v-if="bindStus == 1">
				<!-- 已购买 -->
				<template v-if="items.IsPurchased">
					<template v-if="items.ItemType == 2 || items.ItemType == 1">
						<template v-if="!items.OnlineUrl">
							<router-link :to="{path: '/PlayVideo', query:{QRBookID: QRBookID,id: 'A'+ items.ID}}">
								<img v-if="items.ItemType == 2" src="../../static/image/bookIntr_videoPlay.png">
								<img v-if="items.ItemType == 1" src="../../static/image/bookIntr_musicPlay.png">
							</router-link>
						</template>
						<template v-if="items.OnlineUrl">
							<a :href="items.OnlineUrl">
								<img v-if="items.ItemType == 2" src="../../static/image/bookIntr_videoPlay.png">
								<img v-if="items.ItemType == 1" src="../../static/image/bookIntr_musicPlay.png">
							</a>
						</template>
						
					</template>
					
					<template v-if="!items.ItemType || items.ItemType == 3">
						<router-link :to="{path: '/SendMile', query:{QRItemID: items.ID,RemoteID:items.RemoteID}}">
							<template v-if="!items.ItemType">
								<img src="../../static/image/bookIntr_download.png"> 
							</template>
							<!--pdf -->
							<template v-if="items.ItemType == 3">
								<img src="../../static/image/bookIntr_word.png">
							</template>
						</router-link>
					</template>

				</template>
				<!-- 未购买 -->
				<template v-if="!items.IsPurchased">
					<a href="javascript:;" class="buy" @click="selected(items)">
						<img class="buy-icon" src="../../static/image/bookIntr_money.png">
					</a>
				</template>

			</template>
		</template>
		<!-- 购买 -->
		<template v-if="items.ShowLevel == 2 && items.ItemType != 0">
			<!-- 买过的 -->
			<template v-if="items.IsPurchased">
				<template v-if="items.ItemType == 2 || items.ItemType == 1">
					
					<template v-if="!items.OnlineUrl">
						<router-link :to="{path: '/PlayVideo', query:{QRBookID: QRBookID,id: 'A'+ items.ID}}">
							<img v-if="items.ItemType == 2" src="../../static/image/bookIntr_videoPlay.png">
							<img v-if="items.ItemType == 1" src="../../static/image/bookIntr_musicPlay.png">
						</router-link>
					</template>
					<template v-if="items.OnlineUrl">
						<a :href="items.OnlineUrl">
							<img v-if="items.ItemType == 2" src="../../static/image/bookIntr_videoPlay.png">
							<img v-if="items.ItemType == 1" src="../../static/image/bookIntr_musicPlay.png">
						</a>
					</template>
				</template>
				<!-- <template v-if="items.IsDownload && items.ItemType == 3"> -->
				<template v-if="!items.ItemType || items.ItemType == 3">
					<router-link :to="{path: '/SendMile', query:{QRItemID: items.ID,RemoteID:items.RemoteID}}">
						<template v-if="!items.ItemType">
							<img src="../../static/image/bookIntr_download.png"> 
						</template>
						<!--pdf -->
						<template v-if="items.ItemType == 3">
							<img src="../../static/image/bookIntr_word.png">
						</template>
					</router-link>
				</template>
			</template>
			<!-- 未买的 -->
			<template v-if="!items.IsPurchased">
				<a href="javascript:;" class="buy" @click="selected(items)">
					<img class="buy-icon" src="../../static/image/bookIntr_money.png">
				</a>
			</template>
		</template>
	</div>
</template>

<script>
	export default {
		props: {
			items: {
				type: Object,
				default () {
					return {}
				}
			},
			bindStus: {
				type: Number,
				default: -1
			}
		},
		data() {
			return {
				QRBookID: 0
			}
		},
		methods: {
			selected(item) {
				this.$emit('selected', item)
			}
		},
		mounted() {
			this.QRBookID = this.$route.params.id
			// console.log(this.bindStus,this.items)
		}
	}
</script>

<style scoped>
	.level-icon {
		display: flex;
		align-items: center;
	}

	.level-icon a {
		width: .6rem;
		height: 1.2rem;

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.level-icon a:active {
		opacity: .6;
	}

	.level-icon a:last-child {
		margin-right: 0;
	}

	.level-icon img {
		width: .4rem;
		/* height: .4rem; */
	}
	img.buy-icon{
		width: 0.24rem;
	}
</style>
