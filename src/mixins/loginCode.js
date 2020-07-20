

export const LoginCode = {
	data() {
		return {
		}
	},
	methods:{
		getCode(){
			var arr = location.href.split("code=")[1];
			var code = "";
			if(arr){
				code = arr.split('&')[0]
			}
			return code;
		}
	}
}