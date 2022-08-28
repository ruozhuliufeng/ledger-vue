import Vue from 'vue'
import Vuex from 'vuex'
import menus from "./modules/menus";

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		token: '',
		waitMsgNum: 0,
	},
	mutations: {
		SET_TOKEN: (state, token) => {
			state.token = token
			localStorage.setItem("token", token)
		},
		SET_WAIT_MSG_NUM:(state,waitMsgNum)=>{
			state.waitMsgNum = waitMsgNum
		}
	},
	actions: {},
	modules: {
		menus
	}
})
