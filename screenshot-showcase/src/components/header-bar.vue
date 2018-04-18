<template>
  <header>
    <div class="header__logo"></div>
    <h1><span class="header__title">3d.io Screenshots</span><span class="header__version">beta</span></h1>
  </header>
</template>

<script>

export default {
  name: 'header-bar'
}
</script>

<style lang="less">
  @import '../styles/config.less';
  @exportBtnHeight: 45px;

  header {
    width: 100%;
    height: @headerSmall;
    background: #fff;
    padding: 10px 0 10px 15px;
    text-align: left;
    border-bottom: 1px solid @grey-6;
    h1 {
      margin: 0;
      font-size: 22px;
      line-height: 34px;
      height: 34px;
      display: inline-block;
      vertical-align: top;
    }
  }
  .header {
    &__logo {
      width: 32px;
      height: 34px;
      background: 0 -5px no-repeat;
      background-image: url('../assets/3dio-app-creator.svg');
      background-size: 40px;
      display: inline-block;
      margin-right: 10px;
    }
  }
</style>
