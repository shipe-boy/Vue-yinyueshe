<template>
  <div class="top-nav">
  	<span @click="back" class="return"></span>
	<slot></slot>
  </div>
</template>

<script>
export default {
  data () {
    return {
		
    }
  },
  methods:{
	back(){
		window.history.go(-1);
	}
  },
  mounted() {
  	
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	/* 头部 */
	.top-nav{
		height: .8rem;
		width: 100%;
		padding: 0 .21rem 0 .21rem;
		background: #fff;
		z-index: 99;
		box-sizing: border-box;
		
		display: flex;
		align-items: center;
		
		position: fixed;
		top: 0;
		left: 0;
	}
	.top-nav .return{
		display: block;
		width: .6rem;
		height: 100%;
		background: url(../../static/image/return.png) no-repeat center;
		background-size: .18rem .3rem;
		/* margin-right: .3rem; */
	}
	.top-title{
		color: #262123;
		font-size: .36rem;
		flex: 1;
		text-align: center;
	}
	.search{
		width: .4rem;
		height: .4rem;
		background: url(../../static/image/search.png) no-repeat center center;
		background-size: .2rem .2rem;
		margin: 0 .2rem;
	}
	.mui-icon-search:before {
	    content: '';
	}
	.input-sea{
		flex: 1;
		text-align: center;
	}
	input[type='search']{
		height: .5rem;
		width: 3.8rem;
		margin-bottom: 0;
		font-size: .25rem;
	}
	.delete-all{
		display: block;
		color: #000;
		font-size: .3rem;
		line-height: .3rem;
		padding: 0 .2rem;
	}
</style>
