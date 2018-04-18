<template>
  <div class="editor__container">
    <div class="editor__controls">
      <div v-if="!el.hide" class="editor__box" :class="el.color" v-for="(el, index) in elements">
        <div v-if="!el.isPreview" class="editor__box-toggle" :class="{'closed': !el.isOpen}" @click="el.isOpen = !el.isOpen"></div>
        <div class="editor__box-title" :class="el.color" @click="el.isOpen = !el.isOpen">{{el.name}}</div>
        <div v-if="el.isOpen && getValue(c.condition) && !c.hide" v-for="(c, key) in el.ctrl">
          <span v-if="c.type === 'text'" class="editor__box-text" v-html="c.text"></span>
          <input v-if="c.type === 'checkbox'" type="checkbox" :id="key" v-model="c.val" @change="runMethod(c.method)">
          <label v-if="c.label && (c.type === 'checkbox' || c.type === 'input')" :for="key" class="editor__box-label">{{c.label}}</label>
          <input v-if="c.type === 'input'" class="editor__box-input" v-model="c.val" :placeholder="c.placeholder" @input="runMethod(c.method)">
          <textarea v-if="c.type === 'textarea'" class="editor__box-textarea" v-model="c.val" :placeholder="c.placeholder" @input="runMethod(c.method)"></textarea>
          <button v-if="c.type === 'button'" class="editor__box-button" v-model="c.val" @click="(c.method ? runMethod(c.method) : $store.commit(c.mutation))">{{c.label}}</button>
          <vue-slider v-if="c.type === 'slider'"
                      class="editor__box-slider"
                      v-model="c.val"
                      tooltip="hover"
                      :min="c.range[0]"
                      :max="c.range[1]"
                      @input="runMethod(c.method)">
          </vue-slider>
          <div v-if="c.type === 'color'" class="editor__box-color-preview" :style="{'background-color': c.val.hex}" @click="showColorPicker = !showColorPicker">{{c.val.hex}}</div>
          <chrome-picker v-if="c.type === 'color' && showColorPicker" class="editor__box-color" v-model="c.val" @input="runMethod(c.method)"></chrome-picker>
          <image-upload v-if="c.type === 'upload'"
                        :upload-id="key"
                        :img-width="getValue(c.width)"
                        :img-url="getValue(c.src)"
                        v-on:upload="imageUpload">
          </image-upload>
          <div v-if="c.error" class="editor__box-error" v-html="c.error"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Chrome } from 'vue-color'
import vueSlider from 'vue-slider-component'
import { debounce } from 'lodash'
import controlELements from '../js/control-elements'
import ImageUpload from './image-upload'

export default {
  name: 'visual-editor',
  data () {
    return {
      elements: controlELements,
      showColorPicker: false
    }
  },
  components: {
    'chrome-picker': Chrome,
    'image-upload': ImageUpload,
    'vue-slider': vueSlider
  },
  computed: {
    ...mapGetters({
      aframeCode: 'aframeCode',
      sceneToLoad: 'sceneToLoad',
      modelStructure: 'modelStructure',
      shortId: 'shortId',
      screenshotDimensions: 'screenshotDimensions',
      logo: 'logo'
    })
  },
  methods: {
    getValue: function (c) {
      let prop = true
      if (c) {
        prop = c.split('.').reduce((o, i) => o[i], this)
      }
      return prop
    },
    runMethod: debounce(function (callback) {
      if (callback && this[callback]) this[callback]()
    }, 300),
    getEl: function (key, list) {
      let el, target
      el = document.createElement('div')
      el.innerHTML = this.aframeCode
      if (list) target = el.querySelectorAll(key)
      else target = el.querySelector(key)

      // console.log('Get El', key, this.aframeCode, el, target)

      return target
    },
    pushScene: function () {
      this.elements.scene.ctrl['scn-inpt'].error = false
      const sceneInput = this.elements.scene.ctrl['scn-inpt'].val
      var checkUuid = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i
      if (!checkUuid.test(sceneInput)) {
        this.elements.scene.ctrl['scn-inpt'].error = 'no valid uuid'
        return
      }
      // extract sceneId from url or sceneId string directly
      // scene id to for testing:
      // 5dc58829-ecd3-4b33-bdaf-f798b7edecd4
      const sceneId = checkUuid.exec(sceneInput)[0]
      this.$store.commit('UPDATE_CODE', sceneId)
    },
    pushColor: function () {
      this.elements.sky.ctrl['bkgrnd-ckbx-img'].val = false
      const newColor = this.elements.sky.ctrl['bkgrnd-clr'].val.hex
      this.$store.commit('UPDATE_COLOR', newColor)
    },
    pushSkyImg: function () {
      this.elements.sky.ctrl['bkgrnd-ckbx-clr'].val = false
      const newImg = this.elements.sky.ctrl['bkgrnd-inpt'].val
      const rot = this.elements.sky.ctrl['bkgrnd-rot'].val
      this.$store.commit('UPDATE_IMAGE', {
        src: newImg,
        rotation: rot
      })
    },
    alignLogo: function () {
      const newAlignState = this.elements.logo.ctrl['lg-align'].val
      const newLogoState = {
        src: this.logo.src,
        width: this.logo.width,
        showLogo: this.logo.showLogo,
        alignRight: newAlignState,
        dataURL: this.logo.dataURL
      }
      this.$store.commit('UPDATE_LOGO', newLogoState)
    },
    switchLogo: function () {
      const newLogoState = {
        src: this.logo.src,
        width: this.logo.width,
        showLogo: !this.logo.showLogo,
        alignRight: this.logo.alignRight,
        dataURL: this.logo.dataURL
      }
      this.$store.commit('UPDATE_LOGO', newLogoState)
    },
    pushLogo: function () {
      const newLogo = this.elements.logo.ctrl['lg-inpt'].val
      const logoSize = this.elements.logo.ctrl['lg-width'].val

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
      let targetUrl = newLogo
      toDataUrl(proxyUrl + targetUrl, (data) => {
        dataURL = data
        this.$store.commit('UPDATE_LOGO', {
          src: newLogo,
          width: logoSize,
          showLogo: true,
          dataURL: dataURL
        })
      })
    },
    imageUpload: function (el) {
      if (el.target === 'lg-upload') {
        this.elements.logo.ctrl['lg-inpt'].val = el.url
        this.pushLogo()
      } else if (el.target === 'bkgrnd-upload') {
        this.elements.sky.ctrl['bkgrnd-inpt'].val = el.url
        this.pushSkyImg()
      }
    },
    takeScreenshot: function () {
      this.$root.$emit('takeScreenshot')
    },
    changeScreenshotDimensions: function () {
      const widthInput = this.elements.screenshot.ctrl['screenshot-width'].val
      const heightInput = this.elements.screenshot.ctrl['screenshot-height'].val
      const dimensions = {
        width: widthInput,
        height: heightInput
      }

      this.$store.commit('UPDATE_SCREENSHOT', dimensions)
      // trigger a-scene resize
      window.setTimeout(function () {
        window.dispatchEvent(new Event('resize'))
      }, 500)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import '../styles/config.less';
  .editor {
     &__container {
       height: ~"calc(100vh - @{headerSmall})";
       position: relative;
       display: flex;
       flex-direction: column;
       justify-content: space-between;
       background: @white-0;
       // color: @grey-70;
    }
    &__controls {
      max-height: ~"calc(100vh - @{headerSmall})";
      overflow: auto;
    }
    &__box {
      position: relative;
      padding: 15px;
      background: @white-0;
      text-align: left;
      border-bottom: solid 1px @white-4;
      &-title {
        cursor: pointer;
        font-weight: bold;
        margin-bottom: 10px;
        &:hover {
          color: @grey-90;
        }
      }
      &:hover {
        box-shadow: 0 0 15px 0 rgba(0,0,0,0.1);
        z-index: 10;
      }
      &-input, &-textarea {
        width: 100%;
        height: 30px;
        margin: 10px 0;
        font-size: 14px;
        padding: 5px 8px;
        border-radius: 3px;
        color: @grey-70;
        border: solid 1px @grey-6;
        background: @white-2;
        outline: none;
      }
      &-textarea {
        height: 80px;
        line-height: 20px;
        resize: none;
      }
      &-label {
        margin-top: 5px;
        font-size: 15px;
        min-width: 100px;
        display: inline-block;
      }
      &-img {
        width: 100%;
      }
      button {
        padding: 4px 10px;
        font-size: 15px;
        margin-top: 10px;
        border-radius: 3px;
        background: @grey-6;
        border: 1px solid @grey-20;
        cursor: pointer;
        .transition(background ease 0.3s);
        &:hover {
          background: @grey-10;
        }
      }
      &-toggle {
        position: absolute;
        top: 18px;
        right: 14px;
        background:
          url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='45' version='1.1'><polyline fill='rgb(50,55,60)' points='0,10 40,10 20,45'/></svg>") left top / 11px auto no-repeat;
        height: 11px;
        width: 11px;
        transform-origin: center;
        .transition(all .3s ease);
        opacity: 0.4;
        &.closed {
          transform: rotate(180deg);
        }
        &:hover {
          cursor: pointer;
          opacity: 0.8;
        }
      }
      &-color-preview {
        margin: 5px 0;
        padding: 5px 10px;
        width: 80px;
        cursor: pointer;
        font-size: 14px;
        border-radius: 3px;
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1);
        &:hover {
          box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
        }
      }
      &-color {
        width: 100%;
        max-width: 255px;
        margin: 10px 0;
      }
      &-upload {
        position: relative;
        width: 100%;
        min-height: 120px;
        font-size: 14px;
        color: @grey-60;
        padding: 10px;
        margin: 5px 0;
        border-radius: 3px;
        border: solid 1px @grey-6;
        background-color: @white-2;
        .transition(background-color ease 0.3s);
        &:hover {
          background-color: @white-3;
          border: 1px solid @grey-10;
        }
      }
      &-text {
        font-size: 14px;
      }
      &-error {
        font-size: 12px;
        color: red;
      }
    }
  }
  .camera-controls {
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 100;
}
.btn-waypoint, .btn-toggle-play {
  background-color: rgba(255,255,255,0.9);
  box-sizing: border-box;
  display: block;
  border-radius: 3px;
  font-size: 14px;
  color: #333;
  height: 30px;
  box-shadow: 1px 1px 2px rgba(0,0,0,.1);
  transition: all ease 0.3s;
  cursor: pointer;
  margin: 0 5px 5px 0;
  padding: 0 10px;
  text-decoration: none;
  border: none;
  outline: none;
}
.btn-waypoint:hover, .btn-toggle-play:hover {
  background-color: rgba(255,255,255,1);
  box-shadow: 1px 1px 5px rgba(0,0,0,.2);
}

.btn-toggle-play {
  display: none;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 20px 20px;
  width: 35px;
  height: 35px;
  background-image: url('https://spaces-static.archilogic.com/build/170920-121718-65fe40d/e3d/ui/ui-play-black.svg');
}

/* display play button only if there are waypoints */
.btn-waypoint + .btn-toggle-play {
  display: block;
}

.btn-toggle-play.playing {
  background-image: url('https://spaces-static.archilogic.com/build/170920-121718-65fe40d/e3d/ui/ui-pause-black.svg');
}

.camera-mode > .btn {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
  margin: 5px 5px 0 0;
  box-shadow: 1px 1px 2px rgba(0,0,0,.1);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 30px 30px;
  transition: all ease 0.3s;
}
.camera-mode > .btn.camera {
  background-image: url('https://spaces-static.archilogic.com/build/170920-121718-65fe40d/e3d/ui/icon-camera-black.svg');
}
.camera-mode > .btn.bird {
  background-image: url('https://spaces-static.archilogic.com/build/170711-151653-c61293f/e3d/ui/icon-birdview-black.svg');
}
.camera-mode > .btn.person {
  background-image: url('https://spaces-static.archilogic.com/build/170711-151653-c61293f/e3d/ui/icon-person-black.svg');
}
.camera-mode > .btn.camera.active {
  background-image: url('https://spaces-static.archilogic.com/build/170920-121718-65fe40d/e3d/ui/icon-camera-blue.svg');
}
.camera-mode > .btn.bird.active {
  background-image: url('https://spaces-static.archilogic.com/build/170711-151653-c61293f/e3d/ui/icon-birdview-blue.svg');
}
.camera-mode > .btn.person.active {
  background-image: url('https://spaces-static.archilogic.com/build/170711-151653-c61293f/e3d/ui/icon-person-blue.svg');
}
.camera-mode > .btn:hover {
  box-shadow: 1px 1px 5px rgba(0,0,0,.2);
}
</style>
