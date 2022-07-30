import axios from "axios";
import router from "./router";
import Element from "element-ui"

const request = axios.create({
	baseURL: 'localhost:8888/api', // api的base_url
	timeout: 5000,
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
		if (error.response.data) {
			error.massage = error.response.data.message
		}

		if (error.response.status === 401) {
			router.push("/common")
		}
		Element.Message.error(error.massage, {duration: 3000})
		return Promise.reject(error)
	}
)

export default request
