import axios from "axios";
import router from "./router";
import Element from "element-ui"

const request = axios.create({
	baseURL: "/api", // api的base_url
	timeout: 30000,
	headers: {
		'Content-Type': "application/json; charset=utf-8"
	}
})

request.interceptors.request.use(config => {
	config.headers['Authorization'] = localStorage.getItem("token")
	return config
})

request.interceptors.response.use(
	response => {

		console.log("response ->" + response)

		let res = response.data

		if (res.code === 200) {
			return response
		} else {
			Element.Message.error(!res.message ? '系统异常' : res.message)
			return Promise.reject(response.data.message)
		}
	},
	error => {
		console.log('error->'+error)
		if (error.response){
			if (error.response.data) {
				error.massage = error.response.data.message
			}

			if (error.response.status === 401) {
				router.push("/login")
			}
			Element.Message.error(error.massage, {duration: 3000})
		}else {
			Element.Message.error(error, {duration: 3000})
		}

		return Promise.reject(error)
	}
)

export default request
