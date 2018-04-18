<template>
  <div class="app__container">
    <div id="aframe-wrapper" class="app__wrapper">
      <div id="aframe-view" class="app__view">
        <aframe-scene></aframe-scene>
      </div>
    </div>
  </div>
</template>

<script>
import AframeScene from './aframe-scene'

export default {
  name: 'aframe-view',
  components: {
    'aframe-scene': AframeScene
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import '../styles/config.less';
  .app {
    &__container {
      height: 100%;
      overflow: hidden;
      width: 100%;
      max-width: 100%;
      position: relative;
      &.embed {
        height: 100vh;
      }
    }
    &__view {
      height: 100%;
      width: 100%;
    }
    &__wrapper {
      width: 100%;
      height: 100%;
    }
  }
</style>
