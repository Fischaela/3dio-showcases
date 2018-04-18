<template>
  <div class="scene-container">
    <a-scene embedded :style="{width: screenshotWidth + 'px', height: screenshotHeight + 'px'}">
      <a-sky :color="color" :src="backgroundImageSrc" :rotation="backgroundImageRotation"></a-sky>
    </a-scene>
    <div v-if="cameraControlsVisible" class="camera-controls">
      <div id="waypoints" class="waypoints">
        <button v-for="waypoint in waypoints" class="btn-waypoint" v-on:click="handleWaypointClick(waypoint.id)" v-text="waypoint.name"></button>
      </div>
      <div class="camera-mode">
        <div class="btn camera active"
             onclick="document.querySelector('.waypoints').classList.toggle('hide'), this.classList.toggle('active')">
        </div>
        <div class="btn bird"
             id="btn-bird"
             onclick="document.querySelector('[camera]').components['tour'].updateViewPoint({position:{y:7}, rotation:{x:-60}}), document.querySelector('#btn-person').classList.remove('active'), this.classList.add('active')">
        </div>
        <div class="btn person active"
             id="btn-person"
             onclick="document.querySelector('[camera]').components['tour'].updateViewPoint({position:{y:1.6}, rotation:{x:0}}), document.querySelector('#btn-bird').classList.remove('active'), this.classList.add('active')">
        </div>
      </div>
    </div>
    <div v-if="logo.showLogo" id="custom-logo" class="logo" :style="{width: logo.width + 'px'}" :class="{'logo--align-right': logo.alignRight}">
      <img :src="logo.dataURL" class="logo__img">
    </div>
    <div id="screenshot-preview" class="screenshot-preview">
      <div v-if="logo.showLogo" id="custom-logo" class="logo" :style="{width: logo.width + 'px'}">
        <img :src="logo.dataURL" class="logo__img" :class="{'logo--align-right': logo.alignRight}">
      </div>
      <img id="screenshot-img" class="screenshot-img"src="#">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import html2canvas from 'html2canvas'
import fileSaver from 'file-saver'

export default {
  name: 'aframe-scene',
  data () {
    return {
      cameraControlsVisible: false,
      waypoints: [],
      preview: false
    }
  },
  watch: {
    'aframeCode': function () {
      this.pushScene()
    }
  },
  computed: {
    ...mapGetters({
      aframeCode: 'aframeCode',
      screenshotDimensions: 'screenshotDimensions',
      color: 'color',
      backgroundImage: 'backgroundImage',
      logo: 'logo'
    }),
    screenshotWidth: function () {
      return this.screenshotDimensions.width
    },
    screenshotHeight: function () {
      return this.screenshotDimensions.height
    },
    backgroundImageSrc: function () {
      return this.backgroundImage.src
    },
    backgroundImageRotation: function () {
      return '0 ' + this.backgroundImage.rotation + ' 0'
    }
  },
  mounted () {
    this.$root.$on('takeScreenshot', this.takeScreenshot)
    console.log(typeof this.logo.image)
  },
  methods: {
    pushScene: function () {
      const sceneId = this.aframeCode
      io3d.scene.getAframeElements(sceneId)
        .then(result => {
          // Add Camera Controls
          this.cameraControlsVisible = true

          // we'll get two elements: plan + camera ( including waypoints )
          // add class for later identification
          result[0].classList.add('io3d-scene')

          // check for previously added elements
          const prevScene = this.$el.querySelector('[class="io3d-scene"]')
          const prevCamera = this.$el.querySelector('[camera]') || this.querySelector('a-camera')

          // create string with correct indentation
          // var newSceneElements = prettifyHtml(result[0].outerHTML, 6)
          // var newCameraElements = prettifyHtml(result[1].outerHTML, 6)
          // console.log('Result', result[1], typeof result, result[1].position)
          // console.log('PrevScene', prevScene, 'PrevCamera', prevCamera, prevCamera.position)
          // console.log('AframeCode3', this.aframeCode, typeof this.aframeCode)
          // console.log('ThisEl', this.$el)

          // replace existing scene elements
          if (prevScene) {
            prevScene.parentNode.removeChild(prevScene)
          }
          this.$el.querySelector('a-scene').appendChild(result[0])

          // replace existing camera elements
          if (prevCamera) {
            prevCamera.parentNode.removeChild(prevCamera)
          }
          this.$el.querySelector('a-scene').appendChild(result[1])

          this.updateWaypoints()
        })
    },
    updateWaypoints: function () {
      this.waypoints = []
      let waypoints = this.$el.querySelectorAll('[tour-waypoint]')
      let firstId = null

      waypoints.forEach((el, i) => {
        console.log(el.getAttribute('tour-waypoint'))
        let newWaypoint = {
          name: el.getAttribute('tour-waypoint'),
          id: el.getAttribute('io3d-uuid')
        }
        this.waypoints.push(newWaypoint)
        if (i === 0) {
          firstId = el.getAttribute('io3d-uuid')
        }
      })
      window.setTimeout(() => {
        this.handleWaypointClick(firstId)
      }, 500)
    },
    handleWaypointClick: function (id) {
      return document.querySelector('[camera]').components['tour'].goTo(id)
    },
    takeScreenshot: function () {
      let screenshotComponent = document.querySelector('a-scene').components.screenshot

      console.log('Taking Screenshot 1', screenshotComponent.data.width, this.screenshotDimensions)
      screenshotComponent.data.width = this.screenshotWidth
      screenshotComponent.data.height = this.screenshotHeight
      let newCanvas = screenshotComponent.getCanvas('perspective')
      let canvasImg = newCanvas.toDataURL('image/png')

      let container = document.getElementById('screenshot-preview')
      let containerImg = document.getElementById('screenshot-img')
      containerImg.src = canvasImg
      console.log('CONTAINER', container)

      html2canvas(container).then(canvas => {
        canvas.toBlob(function (blob) {
          fileSaver.saveAs(blob, 'myScreenshot.png')
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import '../styles/config.less';
  a-scene,
  .scene-container {
    width: 100%;
    height: 100%;
    max-width: 100%;
  }
  .a-enter-vr.embedded {
    display: none;
  }
  .logo {
    position: absolute;
    top: 20px;
    left: 20px;
    right: auto;
  }
  .logo--align-right {
    left: auto;
    right: 20px;
  }
  .logo__img {
    max-width: 100%;
    max-height: 100%;
  }
  .screenshot-preview {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -100;
  }
</style>
