export const state = {
  user:  null
  // sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) :
}

export const mutations = {
  changeUser(state, user) {
    state.user = user;
    // if (state.user) {
    //   sessionStorage.setItem("user", JSON.stringify(state.user));
    // } else {
    //   sessionStorage.removeItem('user')
    // }
  }
}

export const getters = {
  user(state) {
    return state.user
  }
}
