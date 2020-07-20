<template>
  <div id="app">
    <router-view/>
	<footer-nav v-if="isShowFooter"></footer-nav>
  </div>
</template>

<script>
export default {
	name: 'App',
	data () {
		return {
			isShowFooter: true
		}
	},
	watch:{
		$route(){
			if(this.$route.path === '/' || this.$route.path === '/JiaYinBind' || this.$route.path === '/JiuYueBind' || this.$route.path === '/JiuYueBind1'){
				this.isShowFooter = false;
			}else{
				this.isShowFooter = true;
			}
		}
	}
}
</script>

<style>
	[v-cloak]{
	            display: none
	        }
	html,body{
		height: 100%;
	}
	body{
		font-family: "微软雅黑";
		background-color: #fff;
		font-weight: normal;
	}
	#app{
		height: 100%;
		background: url(../static/image/bookIntr_bg.png) no-repeat bottom/contain fixed;
	}
	
	/* 清零 */
	body,
	div,
	ul,
	li,
	ol,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	input,
	textarea,
	select,
	p,
	dl,
	dt,
	dd,
	a,
	img,
	button,
	form,
	table,
	th,
	tr,
	td,
	tbody,
	article,
	aside,
	details,
	figcaption,
	figure,
	footer,
	header,
	hgroup,
	menu,
	nav,
	section {
	    margin: 0;
	    padding: 0;
	    border: none;
	}
	
	ul,
	ol {
	  list-style: none;
	}
	a {
	  text-decoration: none;
		display: block;
	}
	a,
	input,
	button {
	  -webkit-tap-highlight-color: transparent;
	}
	input,
	textarea {
	  outline: none;
	}
	.clearfix::after,
	.clearfix::before {
	  content: '';
	  height: 0;
	  visibility: hidden;
	  line-height: 0;
	  clear: both;
	  display: block;
	}
</style>
