import Vue from 'vue'
import Vuex from 'vuex'
import menus from "./modules/menus";

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		token: '',
		waitMsgNum: 0,
		userAvatar:'',
	},
	mutations: {
		SET_TOKEN: (state, token) => {
			state.token = token
			localStorage.setItem("token", token)
		},
		SET_WAIT_MSG_NUM:(state,waitMsgNum)=>{
			state.waitMsgNum = waitMsgNum
		},
		SET_USER_AVATAR:(state,userAvatar) =>{
			state.userAvatar = userAvatar
		},
	},
	actions: {},
	modules: {
		menus
	}
})
