module.exports = {
  cameraControls:
`    <div class="camera-controls">
      <div id="waypoints" class="waypoints">
        <button class="btn-waypoint" onclick="document.querySelector('[camera]').components['tour'].goTo('Overview')">Overview</button>
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
    </div>`,
  logo:
`<div id="custom-logo">
      <a href="https://3d.io" target="_blank">
        <img src="https://archilogic-com.github.io/ui-style-guide/3d-io-logo/3d-io-logo-small.svg">
      </a>
    </div>`
}
