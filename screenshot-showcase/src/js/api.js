const IO3D_BASE_URL = 'https://storage-nocdn.3d.io'
const API_KEY = 'thisWillChange'

export default {
  getShortCode (directory) {
    console.log('Get Shortcode', directory)
    return fetch(`https://app.3d.io/get-short-id/${directory.replace(/^\//, '')}`, {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY
      }
    }).then((res) => res.text())
  },
  readFromDirectory (directory) {
    console.log('Read From Directory', directory)
    return fetch(`${IO3D_BASE_URL}${directory}index.html?x=${Date.now()}`, {mode: 'cors'}).then((res) => res.text())
  }
}
