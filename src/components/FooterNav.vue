<template>
  <div class="footer">
  	<ul>
  		<li v-for="(item, index) in footerList" :key="index">
			<router-link :to="item.url">
				<div class="icon-wrap">
					<span v-if="item.count && item.count > 0">{{item.count}}</span>
					<img :src="item.imgSrc" >
				</div>
			</router-link>
		</li>
  	</ul>
  </div>
</template>

<script>
	import common from './common.js'
	import {LoginCode} from '../mixins/loginCode.js'
export default {
	mixins:[LoginCode],
  data () {
    return {
		footerList: [
			{
				url: '/PurchaseCart',
				imgSrc: require('../../static/image/videoPlay_bigcar.png'),
				count: 0
			},
			{
				url: '/MyCenter',
				imgSrc: require('../../static/image/videoPlay_user.png')
			}
		]
    }
  },
  methods:{
	  getCartCount(){
		  let formData = new FormData();
		  if(this.getCode()){
		  	formData.append("code", this.getCode());
		  }
		  this.$.post('/Member/GetCartNum',formData)
			.then(res => {
				if(!res) return
				if(res.data && res.data.Status<0){
					this.mui.toast(res.data.Message,{ duration:'long', type:'div' })
					return
				}
				// this.$set(this.footerList[0],'count',res.data.Data)
				this.footerList[0].count = res.data.Data;
			})
			.catch(err => {
				this.mui.toast('请稍后重试！',{ duration:'long', type:'div' })
			})
	  }
  },
  mounted(){
	  this.getCartCount();
	  common.$on('updateCartNum', this.getCartCount)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	/* 底部导航 */
	.footer{
		position: fixed;
		z-index: 999;
		bottom: 0;
		left: 0;
		height: 1.36rem;
		width: 100%;
		background-color: #ffffff;
		box-shadow: .02rem .03rem .49rem 0
			rgba(142, 142, 142, 0.53);
	}
	.footer ul{
		display: flex;
	}
	.footer li{
		padding: .08rem 0;
		flex: 1;
		position: relative;
	}
	.footer a{
		border-right: 1px solid #e7c98c;
		height: 1.2rem;
		width: 100%;
		
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.footer a:active{
		opacity: .6;
	}
	.footer li:last-child a{
		border-right: 0;
	}
	.footer a .icon-wrap{
		position: relative;
		display: inline-block;
		width: .6rem;
		height: .6rem;
	}
	.footer a .icon-wrap>img{
		width: 100%;
		height: 100%;
	}
	.footer a .icon-wrap>span{
		font-size: .24rem;
		color: #fff;
		position: absolute;
		right: 0rem;
		top: 0rem;
		width: .3rem;
		height: .3rem;
		border-radius: 50%;
		text-align: center;
		line-height: .3rem;
		background-color: red;
	}
</style>
