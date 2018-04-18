module.exports = {
  scene: {
    name: 'Import Archilogic scene',
    isOpen: true,
    color: 'ocean',
    ctrl: {
      'scn-inpt': {
        // label: 'model resource id',
        type: 'input',
        placeholder: 'enter a scene id or url',
        error: false,
        val: null,
        method: 'pushScene'
      }
    }
  },
  logo: {
    name: 'Custom logo',
    isOpen: true,
    ctrl: {
      'lg-ckbx': {
        label: 'Show Logo',
        id: 'show-logo',
        type: 'checkbox',
        val: true,
        method: 'switchLogo'
      },
      'lg-inpt': {
        condition: 'elements.logo.ctrl.lg-ckbx.val',
        type: 'input',
        placeholder: 'enter a url',
        val: 'https://raw.githubusercontent.com/archilogic-com/3dio-js/HEAD/3dio-logo.png',
        method: 'pushLogo'
      },
      'lg-text': {
        condition: 'elements.logo.ctrl.lg-ckbx.val',
        text: 'Use ideally a png with transparency - not wider than 200px',
        type: 'text'
      },
      'lg-upload': {
        condition: 'elements.logo.ctrl.lg-ckbx.val',
        type: 'upload',
        width: 'elements.logo.ctrl.lg-width.val',
        src: 'elements.logo.ctrl.lg-inpt.val'
      },
      'lg-img': {
        condition: 'elements.logo.ctrl.lg-ckbx.val',
        type: 'image',
        width: 'elements.logo.ctrl.lg-width.val',
        src: 'elements.logo.ctrl.lg-inpt.val'
      },
      'lg-width': {
        condition: 'elements.logo.ctrl.lg-ckbx.val',
        label: 'Size',
        type: 'slider',
        range: [50, 250],
        val: 80,
        method: 'pushLogo'
      },
      'lg-align': {
        condition: 'elements.logo.ctrl.lg-ckbx.val',
        label: 'Align right',
        type: 'checkbox',
        val: false,
        method: 'alignLogo'
      }
    }
  },
  sky: {
    name: 'Background',
    isOpen: true,
    ctrl: {
      'bkgrnd-ckbx-clr': {
        label: 'Use color',
        id: 'bkgrnd-color',
        type: 'checkbox',
        method: 'pushColor',
        val: false
      },
      'bkgrnd-clr': {
        condition: 'elements.sky.ctrl.bkgrnd-ckbx-clr.val',
        type: 'color',
        val: {
          hex: '#FFFFFF'
        },
        method: 'pushColor'
      },
      'bkgrnd-ckbx-img': {
        label: 'Use Image',
        id: 'bkgrnd-img',
        type: 'checkbox',
        method: 'pushSkyImg',
        val: true
      },
      'bkgrnd-text': {
        condition: 'elements.sky.ctrl.bkgrnd-ckbx-img.val',
        text: 'Best use an <a href="https://www.google.ch/search?biw=1803&bih=804&q=equirectangular+image" target="_blank">equirectangluar image</a> - not wider than 4096px',
        type: 'text'
      },
      'bkgrnd-upload': {
        condition: 'elements.sky.ctrl.bkgrnd-ckbx-img.val',
        type: 'upload',
        src: 'elements.sky.ctrl.bkgrnd-inpt.val'
      },
      'bkgrnd-rot': {
        condition: 'elements.sky.ctrl.bkgrnd-ckbx-img.val',
        label: 'Rotation',
        type: 'slider',
        range: [0, 360],
        val: 290,
        method: 'pushSkyImg'
      },
      'bkgrnd-inpt': {
        condition: 'elements.sky.ctrl.bkgrnd-ckbx-img.val',
        type: 'input',
        placeholder: 'enter your file key',
        val: 'https://storage.3d.io/535e624259ee6b0200000484/2017-08-08_15-19-35_C6qRcB/empire_low.jpg',
        method: 'pushSkyImg'
      }
    }
  },
  screenshot: {
    name: 'Screenshot',
    isOpen: true,
    ctrl: {
      'screenshot-width': {
        label: 'Width',
        id: 'screenshot-width',
        type: 'input',
        method: 'changeScreenshotDimensions',
        val: 1024
      },
      'screenshot-height': {
        label: 'Height',
        id: 'screenshot-height',
        type: 'input',
        method: 'changeScreenshotDimensions',
        val: 768
      },
      'screenshot-btn': {
        label: 'Take Screenshot',
        id: 'screenshot-btn',
        type: 'button',
        method: 'takeScreenshot'
      }
    }
  }
}
