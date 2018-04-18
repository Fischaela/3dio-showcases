import * as types from '../mutation-types'

// initial state
const state = {
  isLoadingApp: false
}

// actions
const actions = {
  // load specific app
  loadApp ({commit, state, rootState}) {
    console.log('loading app', commit, state, rootState)
    if (state.isLoadingApp) {
      console.warn('already loading')
      return
    }
    commit('LOADING_APP', true)

    function toDataUrl (url, callback) {
      let xhr = new XMLHttpRequest()
      xhr.onload = function () {
        let reader = new FileReader()
        reader.onloadend = function () {
          callback(reader.result)
        }
        reader.readAsDataURL(xhr.response)
      }
      xhr.open('GET', url)
      xhr.responseType = 'blob'
      xhr.send()
    }
    let dataURL = null
    let proxyUrl = 'https://cors-anywhere.herokuapp.com/'
    let targetUrl = 'https://raw.githubusercontent.com/archilogic-com/3dio-js/HEAD/3dio-logo.png'
    toDataUrl(proxyUrl + targetUrl, function (data) {
      dataURL = data
      commit('UPDATE_LOGO', {
        src: 'https://raw.githubusercontent.com/archilogic-com/3dio-js/HEAD/3dio-logo.png',
        width: 80,
        showLogo: true,
        dataURL: dataURL,
        alignRight: false
      })
      commit('LOADING_APP', false)
    })
  }
}

// mutations
const mutations = {
  [types.LOADING_APP] (state, data) {
    console.log('Loading App', state, data)
    state.isLoadingApp = data
  }
}

export default {
  state,
  actions,
  mutations
}
