import Vue from 'vue'
import Router from 'vue-router'

const BookInfo = () => import('../pages/BookInfo') //详情页
const Purchase = () => import('../pages/Purchase') //选择购买页
const PurchaseCart = () => import('../pages/PurchaseCart') //购物车
const ConfirmOrder = () => import('../pages/ConfirmOrder') //结算
const SuccessOrder = () => import('../pages/SuccessOrder') //购买成功
const MyCenter = () => import('../pages/MyCenter')	//个人中心
const BindRecord = () => import('../pages/BindRecord')	//绑定记录
const MusicRecord = () => import('../pages/MusicRecord')	//已购乐曲
const PayRecord = () => import('../pages/PayRecord')	//购买记录
const BookBind = () => import('../pages/BookBind')	//绑定图书--首页
const BookList = () => import('../pages/BookList')	//图书列表
const SendMile = () => import('../pages/SendMile')	//下载
const PlayVideo = () => import('../pages/PlayVideo')	//视频播放
const ErrorPage = () => import('../pages/ErrorPage')	//错误页
const JiaYinBind = () => import('../pages/JiaYinBind')	//佳音绑定页
const JiuYueBind = () => import('../pages/JiuYueBind')	//九月绑定页
const JiuYueBind1 = () => import('../pages/JiuYueBind1')	//九月绑定页

Vue.use(Router)

export default new Router({
	routes: [
    {
			path: '/',
			name: 'BookBind',
			component: BookBind,
		}, {
			path: '/BookInfo/:id',
			name: 'BookInfo',
			component: BookInfo
		}, {
			path: '/Purchase/:id',
			name: 'Purchase',
			component: Purchase
		}, {
			path: '/PurchaseCart',
			name: 'PurchaseCart',
			component: PurchaseCart
		}, {
			path: '/ConfirmOrder',
			name: 'ConfirmOrder',
			component: ConfirmOrder
		}, {
			path: '/MyCenter',
			name: 'MyCenter',
			component: MyCenter
		}, {
			path: '/BindRecord',
			name: 'BindRecord',
			component: BindRecord
		}, {
			path: '/MusicRecord',
			name: 'MusicRecord',
			component: MusicRecord
		}, {
			path: '/PayRecord',
			name: 'PayRecord',
			component: PayRecord
		}, {
			path: '/BookList',
			name: 'BookList',
			component: BookList
		}, {
			path: '/SendMile',
			name: 'SendMile',
			component: SendMile
		}, {
			path: '/PlayVideo',
			name: 'PlayVideo',
			component: PlayVideo
		}, {
			path: '/SuccessOrder',
			name: 'SuccessOrder',
			component: SuccessOrder
		}, {
			path: '/ErrorPage',
			name: 'ErrorPage',
			component: ErrorPage
		}, {
			path: '/JiaYinBind',
			name: 'JiaYinBind',
			component: JiaYinBind
		}, {
			path: '/JiuYueBind',
			name: 'JiuYueBind',
			component: JiuYueBind
		}, {
			path: '/JiuYueBind1',
			name: 'JiuYueBind1',
			component: JiuYueBind1
		}
	]
})
