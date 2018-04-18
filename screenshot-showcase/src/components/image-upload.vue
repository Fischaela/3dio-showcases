<template>
  <div class="editor__box-upload" :id="uploadId">
    click to upload or drop a file<br><br>
    <img class="editor__box-img" :style="{'width': imgWidth + 'px'}" :src="imgUrl">
  </div>
</template>

<script>
  export default {
    name: 'image-upload',
    props: ['imgUrl', 'imgWidth', 'uploadId'],
    data () {
      return {
        initialPos: null,
        initialScreenPos: null
      }
    },
    mounted: function () {
      io3d.utils.ui.fileDrop({
        elementId: this.uploadId,
        upload: true,
        dragOverCssClass: 'file-drop-box-dragover',
        onInput: (files) => {
          this.$emit('upload', { url: files[0].url, target: this.uploadId })
        }
      })
    }
  }
</script>
