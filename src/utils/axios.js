import Axios from 'axios'


// 允许携带cookie
Axios.defaults.withCredentials = true
import {
	BASEURL
} from '../../static/js/api.js'
Axios.defaults.baseURL = BASEURL;


//响应拦截
Axios.interceptors.response.use(res => {
	if (res.data.Status == -2) {
		// 官网
		// https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx520c15f417810387&redirect_uri=https%3A%2F%2Fchong.qq.com%2Fphp%2Findex.php%3Fd%3D%26c%3DwxAdapter%26m%3DmobileDeal%26showwxpaytitle%3D1%26vb2ctag%3D4_2030_5_1194_60&response_type=code&scope=snsapi_base&state=123#wechat_redirect
		// https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf6a0e5719fdddb26&connect_redirect=1&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect&redirect_uri=https://etest.yuehi.cc/page/#/MyCenter
		let appid = getAppId(res.data.Url)
		let url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + '&redirect_uri=' + encodeURIComponent(location.href) + "&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
		
		// alert(JSON.stringify(url))
		location.replace(url)
		return false
	}

	return res
}, err => {
	alert(err)
	return Promise.reject(err)
})

function getAppId(url) {
	var arr = url.split('appid=')[1];
	var appid = "";
	if(arr){
		appid = arr.split('&')[0]
	}
	return appid;
}



export default Axios
