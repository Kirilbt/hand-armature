import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js'
import GSAP from 'gsap'
import {Pane} from 'tweakpane'

// Pane
const pane = new Pane({
  container: document.getElementById('pane'),
})
const tab = pane.addTab({
  pages: [
    {title: 'Hand 🤟'},
    {title: 'Colors 🎨'},
  ],
})
const clench = tab.pages[0].addFolder({
  title: 'Clench',
  expanded: false
});
const spread = tab.pages[0].addFolder({
  title: 'Spread (WIP)',
  expanded: false
});
const PARAMS = {
  bg: 0x4b46b2,
  hand: 0xE7A183,
  shirt: 0x303030,
  vest: 0xE7D55C,
  wrist: 0.1,
  thumb: 0.25,
  index: 0.25,
  middle: 1.1,
  ring: 1.1,
  pinky: 0.25,
  thumbz: -0.15, 
  indexz: -0.3,
  middlez: -0.08,
  ringz: -0.22,
  pinkyz: -0.52
}

// Buttons
const raisedHand = document.querySelector('#raised-hand')
const raisedFinger = document.querySelector('#raised-finger')
const rockOn = document.querySelector('#rock-on')
const peace = document.querySelector('#peace')
const hangLoose = document.querySelector('#hang-loose')
const fu = document.querySelector('#fu')
const vulcanSalute = document.querySelector('#vulcan-salute')

const centerThresholdX = 10
const centerThresholdY = 20

const getRandomPosition = () => {
  const x = Math.random() * (100 - centerThresholdX * 2) + centerThresholdX
  const y = Math.random() * (100 - centerThresholdY * 2) + centerThresholdY
  return { x, y }
}

const getRandomRotation = () => {
  return Math.floor(Math.random() * 91) - 45;
}

const placeButtonRandomly = (button) => {
  const position = getRandomPosition()
  const rotation = getRandomRotation()
  button.style.left = `${position.x}%`
  button.style.top = `${position.y}%`
  button.style.transform = `rotate(${rotation}deg)`
}

placeButtonRandomly(raisedHand)
placeButtonRandomly(raisedFinger)
placeButtonRandomly(rockOn)
placeButtonRandomly(peace)
placeButtonRandomly(hangLoose)
placeButtonRandomly(fu)
placeButtonRandomly(vulcanSalute)

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const bgColor = new THREE.Color(PARAMS.bg)
scene.background = bgColor

tab.pages[1].addInput(PARAMS, 'bg', {
  view: 'color',
  picker: 'inline',
  expanded: false,
}).on('change', (ev) => {
  scene.background = new THREE.Color(ev.value)
  document.body.style.backgroundColor = ev.value;
})

/**
 * Model
 */
const gltfLoader = new GLTFLoader()

gltfLoader.load(
  'hand.glb',
  (gltf) =>
  {
    scene.add(gltf.scene.children[0])
    
    setMaterials()
    setBones()
  }
)

// Materials
const handMaterial = new THREE.MeshToonMaterial()
const shirtMaterial = new THREE.MeshToonMaterial()
const vestMaterial = new THREE.MeshToonMaterial()

const setMaterials = () => {
  const textureLoader = new THREE.TextureLoader()
  const gradientTexture = textureLoader.load('3.jpg')
  gradientTexture.minFilter = THREE.NearestFilter
  gradientTexture.magFilter = THREE.NearestFilter
  gradientTexture.generateMipmaps = false

  handMaterial.color = new THREE.Color(PARAMS.hand)
  handMaterial.gradientMap = gradientTexture
  handMaterial.roughness = 0.7
  handMaterial.emissive = new THREE.Color(PARAMS.hand)
  handMaterial.emissiveIntensity = 0.2
  scene.getObjectByName('Hand').material = handMaterial

  shirtMaterial.color = new THREE.Color(PARAMS.shirt)
  shirtMaterial.gradientMap = gradientTexture
  scene.getObjectByName('Shirt').material = shirtMaterial

  vestMaterial.color = new THREE.Color(PARAMS.vest)
  vestMaterial.gradientMap = gradientTexture
  scene.getObjectByName('Vest').material = vestMaterial

  // Pane
  tab.pages[1].addInput(PARAMS, 'hand', {
    view: 'color',
    picker: 'inline',
    expanded: false,
  }).on('change', (ev) => {
    handMaterial.color = new THREE.Color(ev.value)
    handMaterial.emissive = new THREE.Color(PARAMS.hand)
  })
  tab.pages[1].addInput(PARAMS, 'shirt', {
    view: 'color',
    picker: 'inline',
    expanded: false,
  }).on('change', (ev) => {
    shirtMaterial.color = new THREE.Color(ev.value)
  })
  tab.pages[1].addInput(PARAMS, 'vest', {
    view: 'color',
    picker: 'inline',
    expanded: false,
  }).on('change', (ev) => {
    vestMaterial.color = new THREE.Color(ev.value)
  })
}

const setBones = () => {
  const wrist = scene.getObjectByName('Hand').skeleton.bones[0]
  const wrist1 = scene.getObjectByName('Hand').skeleton.bones[1]
  const wrist2 = scene.getObjectByName('Hand').skeleton.bones[2]
  const wrist3 = scene.getObjectByName('Hand').skeleton.bones[6]
  const wrist4 = scene.getObjectByName('Hand').skeleton.bones[10]
  const wrist5 = scene.getObjectByName('Hand').skeleton.bones[14]
  const wrist6 = scene.getObjectByName('Hand').skeleton.bones[18]
  wrist1.rotation.x = PARAMS.wrist
  wrist2.rotation.x = PARAMS.wrist
  wrist3.rotation.x = PARAMS.wrist
  wrist4.rotation.x = PARAMS.wrist
  wrist5.rotation.x = PARAMS.wrist
  wrist6.rotation.x = PARAMS.wrist

  const thumb1 = scene.getObjectByName('Hand').skeleton.bones[3]
  const thumb2 = scene.getObjectByName('Hand').skeleton.bones[4]
  const thumb3 = scene.getObjectByName('Hand').skeleton.bones[5]
  thumb1.rotation.x = PARAMS.thumb
  thumb2.rotation.x = PARAMS.thumb
  thumb3.rotation.x = PARAMS.thumb
  thumb1.rotation.z = PARAMS.thumbz
  thumb2.rotation.z = PARAMS.thumbz
  thumb3.rotation.z = PARAMS.thumbz

  const index1 = scene.getObjectByName('Hand').skeleton.bones[7]
  const index2 = scene.getObjectByName('Hand').skeleton.bones[8]
  const index3 = scene.getObjectByName('Hand').skeleton.bones[9]
  index1.rotation.x = PARAMS.index
  index2.rotation.x = PARAMS.index
  index3.rotation.x = PARAMS.index

  const middle1 = scene.getObjectByName('Hand').skeleton.bones[11]
  const middle2 = scene.getObjectByName('Hand').skeleton.bones[12]
  const middle3 = scene.getObjectByName('Hand').skeleton.bones[13]
  middle1.rotation.x = PARAMS.middle
  middle2.rotation.x = PARAMS.middle
  middle3.rotation.x = PARAMS.middle

  const ring1 = scene.getObjectByName('Hand').skeleton.bones[15]
  const ring2 = scene.getObjectByName('Hand').skeleton.bones[16]
  const ring3 = scene.getObjectByName('Hand').skeleton.bones[17]
  ring1.rotation.x = PARAMS.ring
  ring2.rotation.x = PARAMS.ring
  ring3.rotation.x = PARAMS.ring

  const pinky1 = scene.getObjectByName('Hand').skeleton.bones[19]
  const pinky2 = scene.getObjectByName('Hand').skeleton.bones[20]
  const pinky3 = scene.getObjectByName('Hand').skeleton.bones[21]
  pinky1.rotation.x = PARAMS.pinky
  pinky2.rotation.x = PARAMS.pinky
  pinky3.rotation.x = PARAMS.pinky

  // PANE
  // Wrist
  clench.addInput(PARAMS, 'wrist', {min: -0.4, max: 0.4, step: 0.01})
  .on('change', (ev) => {
    wrist.rotation.x = (ev.value)
    wrist1.rotation.x = (ev.value)
    wrist2.rotation.x = (ev.value)
    wrist3.rotation.x = (ev.value)
    wrist4.rotation.x = (ev.value)
    wrist5.rotation.x = (ev.value)
    wrist6.rotation.x = (ev.value)
  })

  // Thumb
  clench.addInput(PARAMS, 'thumb', {min: 0, max: 0.9, step: 0.01})
  .on('change', (ev) => {
    thumb1.rotation.x = (ev.value)
    thumb2.rotation.x = (ev.value)
    thumb3.rotation.x = (ev.value)
  })

  spread.addInput(PARAMS, 'thumbz', {min: -0.4, max: 0.3, step: 0.01})
  .on('change', (ev) => {
    thumb1.rotation.z = (ev.value)
    thumb2.rotation.z = (ev.value)
    thumb3.rotation.z = (ev.value)
  })

  // Index
  clench.addInput(PARAMS, 'index', {min: 0, max: 1.1, step: 0.01})
  .on('change', (ev) => {
    index1.rotation.x = (ev.value)
    index2.rotation.x = (ev.value)
    index3.rotation.x = (ev.value)
  })

  spread.addInput(PARAMS, 'indexz', {min: -0.5, max: 0, step: 0.01})
  .on('change', (ev) => {
    index1.rotation.z = (ev.value)
  })

  // Middle
  clench.addInput(PARAMS, 'middle',
  {min: 0, max: 1.25, step: 0.01}
  )
  .on('change', (ev) => {
    middle1.rotation.x = (ev.value)
    middle2.rotation.x = (ev.value)
    middle3.rotation.x = (ev.value)
  })

  spread.addInput(PARAMS, 'middlez', {min: -0.35, max: 0.25, step: 0.01})
  .on('change', (ev) => {
    middle1.rotation.z = (ev.value)
  })

  // Ring
  clench.addInput(PARAMS, 'ring', {min: 0, max: 1.25, step: 0.01})
  .on('change', (ev) => {
    ring1.rotation.x = (ev.value)
    ring2.rotation.x = (ev.value)
    ring3.rotation.x = (ev.value)
  })

  spread.addInput(PARAMS, 'ringz', {min: -0.4, max: 0.2, step: 0.01})
  .on('change', (ev) => {
    wrist5.position.x + (ev.value) * 0.1
    wrist5.position.y - (ev.value) * 0.1
    ring1.rotation.z = -(ev.value)
  })

  // Pinky
  clench.addInput(PARAMS, 'pinky', {min: 0, max: 1.15, step: 0.01})
  .on('change', (ev) => {
    pinky1.rotation.x = (ev.value)
    pinky2.rotation.x = (ev.value)
    pinky3.rotation.x = (ev.value)
  })

  spread.addInput(PARAMS, 'pinkyz', {min: -0.52, max: -0.25, step: 0.01})
  .on('change', (ev) => {
    wrist6.position.x + (ev.value) * 0.1
    pinky1.rotation.z = -(ev.value)
  })

  /**
   * Poses
   */

  const wristRotation = [wrist.rotation, wrist1.rotation, wrist2.rotation, wrist3.rotation, wrist4.rotation, wrist5.rotation, wrist6.rotation]
  const thumbRotation = [thumb1.rotation, thumb2.rotation, thumb3.rotation]
  const indexRotation = [index1.rotation, index2.rotation, index3.rotation]
  const middleRotation = [middle1.rotation, middle2.rotation, middle3.rotation]
  const ringRotation = [ring1.rotation, ring2.rotation, ring3.rotation]
  const pinkyRotation = [pinky1.rotation, pinky2.rotation, pinky3.rotation]

  raisedHand.addEventListener('click', () => {
    const tlRaisedHand = GSAP.timeline()
    let bgColor = new THREE.Color(0xbcbcbc)
    let handColor = new THREE.Color(0xc5c5c5)
    let shirtColor = new THREE.Color(0x666666)
    let vestColor = new THREE.Color(0x191919)

    tlRaisedHand
      .to(PARAMS, {
        duration: 0,
        bg: 0xbcbcbc, hand: 0xc5c5c5, shirt: 0x666666, vest: 0x191919,
        wrist: 0,
        thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0,
        thumbz: -0.15, indexz: -0.30, middlez: -0.08, ringz: -0.22, pinkyz: -0.52,
       }, 'same')
      .to(wristRotation, { duration: 0.5, x: 0 }, 'same')
      .to(thumbRotation, { duration: 0.5, x: 0 }, 'same')
      .to(indexRotation, { duration: 0.5, x: 0 }, 'same')
      .to(middleRotation, { duration: 0.5, x: 0 }, 'same')
      .to(ringRotation, { duration: 0.5, x: 0 }, 'same')
      .to(pinkyRotation, { duration: 0.5, x: 0 }, 'same')
      .to(thumbRotation, { duration: 0.5, z: -0.15 }, 'same')
      .to(indexRotation[0], { duration: 0.5, z: -0.30 }, 'same')
      .to(middleRotation[0], { duration: 0.5, z: -0.08 }, 'same')
      .to(ringRotation[0], { duration: 0.5, z: 0.22 }, 'same')
      .to(pinkyRotation[0], { duration: 0.5, z: 0.52 }, 'same')
      .to(scene.background, { duration: 0.5, r: bgColor.r, g: bgColor.g, b: bgColor.b  }, 'same')
      .to(handMaterial.color, { duration: 0.5, r: handColor.r, g: handColor.g, b: handColor.b  }, 'same')
      .to(handMaterial.emissive, { duration: 0.5, r: handColor.r, g: handColor.g, b: handColor.b  }, 'same')
      .to(shirtMaterial.color, { duration: 0.5, r: shirtColor.r, g: shirtColor.g, b: shirtColor.b  }, 'same')
      .to(vestMaterial.color, { duration: 0.5, r: vestColor.r, g: vestColor.g, b: vestColor.b  }, 'same')
      .call(() => {
        pane.refresh()
      })
      .play()
  })

  raisedFinger.addEventListener('click', () => {
    const tlRaisedFinger = GSAP.timeline()
    let bgColor = new THREE.Color(0xaf5f54)
    let handColor = new THREE.Color(0xe7a183)
    let shirtColor = new THREE.Color(0xc7d2eb)
    let vestColor = new THREE.Color(0x274479)

    tlRaisedFinger
      .to(PARAMS, {
        duration: 0,
        bg: 0xaf5f54, hand: 0xe7a183, shirt: 0xc7d2eb, vest: 0x274479,
        wrist: 0,
        thumb: 0.9, index: 0, middle: 1.25, ring: 1.25, pinky: 1.15,
        thumbz: -0.15, indexz: -0.30, middlez: -0.08, ringz: -0.22, pinkyz: -0.52,
      }, 'same')
      .to(wristRotation, { duration: 0.5, x: 0 }, 'same')
      .to(thumbRotation, { duration: 0.5, x: 0.9 }, 'same')
      .to(indexRotation, { duration: 0.5, x: 0 }, 'same')
      .to(middleRotation, { duration: 0.5, x: 1.25 }, 'same')
      .to(ringRotation, { duration: 0.5, x: 1.25 }, 'same')
      .to(pinkyRotation, { duration: 0.5, x: 1.15 }, 'same')
      .to(thumbRotation, { duration: 0.5, z: -0.15 }, 'same')
      .to(indexRotation[0], { duration: 0.5, z: -0.30 }, 'same')
      .to(middleRotation[0], { duration: 0.5, z: -0.08 }, 'same')
      .to(ringRotation[0], { duration: 0.5, z: 0.22 }, 'same')
      .to(pinkyRotation[0], { duration: 0.5, z: 0.52 }, 'same')
      .to(scene.background, { duration: 0.5, r: bgColor.r, g: bgColor.g, b: bgColor.b  }, 'same')
      .to(handMaterial.color, { duration: 0.5, r: handColor.r, g: handColor.g, b: handColor.b  }, 'same')
      .to(handMaterial.emissive, { duration: 0.5, r: handColor.r, g: handColor.g, b: handColor.b  }, 'same')
      .to(shirtMaterial.color, { duration: 0.5, r: shirtColor.r, g: shirtColor.g, b: shirtColor.b  }, 'same')
      .to(vestMaterial.color, { duration: 0.5, r: vestColor.r, g: vestColor.g, b: vestColor.b  }, 'same')
      .call(() => {
        pane.refresh()
      })
      .play()
  })

  rockOn.addEventListener('click', () => {
    const tlRockOn = GSAP.timeline()
    let bgColor = new THREE.Color(0x4b46b2)
    let handColor = new THREE.Color(0xe7a183)
    let shirtColor = new THREE.Color(0x303030)
    let vestColor = new THREE.Color(0xe7d55c)

    tlRockOn
      .to(PARAMS, {
        duration: 0,
        bg: 0x4b46b2, hand: 0xe7a183, shirt: 0x303030, vest: 0xe7d55c,
        wrist: 0.1,
        thumb: 0.25, index: 0.25, middle: 1.1, ring: 1.1, pinky: 0.25,
        thumbz: -0.15, indexz: -0.30, middlez: -0.08, ringz: -0.22, pinkyz: -0.52,
      }, 'same')
      .to(wristRotation, { duration: 0.5, x: 0.1 }, 'same')
      .to(thumbRotation, { duration: 0.5, x: 0.25 }, 'same')
      .to(indexRotation, { duration: 0.5, x: 0.25 }, 'same')
      .to(middleRotation, { duration: 0.5, x: 1.1 }, 'same')
      .to(ringRotation, { duration: 0.5, x: 1.1 }, 'same')
      .to(pinkyRotation, { duration: 0.5, x: 0.25 }, 'same')
      .to(thumbRotation, { duration: 0.5, z: -0.15 }, 'same')
      .to(indexRotation[0], { duration: 0.5, z: -0.30 }, 'same')
      .to(middleRotation[0], { duration: 0.5, z: -0.08 }, 'same')
      .to(ringRotation[0], { duration: 0.5, z: 0.22 }, 'same')
      .to(pinkyRotation[0], { duration: 0.5, z: 0.52 }, 'same')
      .to(scene.background, { duration: 0.5, r: bgColor.r, g: bgColor.g, b: bgColor.b  }, 'same')
      .to(handMaterial.color, { duration: 0.5, r: handColor.r, g: handColor.g, b: handColor.b  }, 'same')
      .to(handMaterial.emissive, { duration: 0.5, r: handColor.r, g: handColor.g, b: handColor.b  }, 'same')
      .to(shirtMaterial.color, { duration: 0.5, r: shirtColor.r, g: shirtColor.g, b: shirtColor.b  }, 'same')
      .to(vestMaterial.color, { duration: 0.5, r: vestColor.r, g: vestColor.g, b: vestColor.b  }, 'same')
      .call(() => {
        pane.refresh()
      })
      .play()
  })

  peace.addEventListener('click', () => {
    const tlPeace = GSAP.timeline()
    let bgColor = new THREE.Color(0xe2ceab)
    let handColor = new THREE.Color(0x624122)
    let shirtColor = new THREE.Color(0xccb4a2)
    let vestColor = new THREE.Color(0xbf6f30)

    tlPeace
      .to(PARAMS, {
        duration: 0,
        bg: 0xe2ceab, hand: 0x624122, shirt: 0xccb4a2, vest: 0xbf6f30,
        wrist: 0,
        thumb: 0.9, index: 0, middle: 0, ring: 1.25, pinky: 1.15,
        thumbz: -0.15, indexz: -0.03, middlez: -0.23, ringz: -0.22, pinkyz: -0.52,
       }, 'same')
      .to(wristRotation, { duration: 0.5, x: 0 }, 'same')
      .to(thumbRotation, { duration: 0.5, x: 0.9 }, 'same')
      .to(indexRotation, { duration: 0.5, x: 0 }, 'same')
      .to(middleRotation, { duration: 0.5, x: 0 }, 'same')
      .to(ringRotation, { duration: 0.5, x: 1.25 }, 'same')
      .to(pinkyRotation, { duration: 0.5, x: 1.15 }, 'same')
      .to(thumbRotation, { duration: 0.5, z: -0.15 }, 'same')
      .to(indexRotation[0], { duration: 0.5, z: -0.03 }, 'same')
      .to(middleRotation[0], { duration: 0.5, z: -0.23 }, 'same')
      .to(ringRotation[0], { duration: 0.5, z: 0.22 }, 'same')
      .to(pinkyRotation[0], { duration: 0.5, z: 0.52 }, 'same')
      .to(scene.background, { duration: 0.5, r: bgColor.r, g: bgColor.g, b: bgColor.b  }, 'same')
      .to(handMaterial.color, { duration: 0.5, r: handColor.r, g: handColor.g, b: handColor.b  }, 'same')
      .to(handMaterial.emissive, { duration: 0.5, r: handColor.r, g: handColor.g, b: handColor.b  }, 'same')
      .to(shirtMaterial.color, { duration: 0.5, r: shirtColor.r, g: shirtColor.g, b: shirtColor.b  }, 'same')
      .to(vestMaterial.color, { duration: 0.5, r: vestColor.r, g: vestColor.g, b: vestColor.b  }, 'same')
      .call(() => {
        pane.refresh()
      })
      .play()
  })

  hangLoose.addEventListener('click', () => {
    const tlHangLoose = GSAP.timeline()
    let bgColor = new THREE.Color(0x1389d8)
    let handColor = new THREE.Color(0xb69621)
    let shirtColor = new THREE.Color(0xbbdae8)
    let vestColor = new THREE.Color(0xbf3131)

    tlHangLoose
      .to(PARAMS, {
        duration: 0,
        bg: 0x1389d8, hand: 0xb69621, shirt: 0xbbdae8, vest: 0xbf3131,
        wrist: 0,
        thumb: 0, index: 1.1, middle: 1.25, ring: 1.25, pinky: 0,
        thumbz: -0.04, indexz: -0.30, middlez: -0.08, ringz: -0.22, pinkyz: -0.25,
      }, 'same')
      .to(wristRotation, { duration: 0.5, x: 0 }, 'same')
      .to(thumbRotation, { duration: 0.5, x: 0 }, 'same')
      .to(indexRotation, { duration: 0.5, x: 1.1 }, 'same')
      .to(middleRotation, { duration: 0.5, x: 1.25 }, 'same')
      .to(ringRotation, { duration: 0.5, x: 1.25 }, 'same')
      .to(pinkyRotation, { duration: 0.5, x: 0 }, 'same')
      .to(thumbRotation, { duration: 0.5, z: -0.04 }, 'same')
      .to(indexRotation[0], { duration: 0.5, z: -0.30 }, 'same')
      .to(middleRotation[0], { duration: 0.5, z: -0.08 }, 'same')
      .to(ringRotation[0], { duration: 0.5, z: 0.22 }, 'same')
      .to(pinkyRotation[0], { duration: 0.5, z: 0.25 }, 'same')
      .to(scene.background, { duration: 0.5, r: bgColor.r, g: bgColor.g, b: bgColor.b  }, 'same')
      .to(handMaterial.color, { duration: 0.5, r: handColor.r, g: handColor.g, b: handColor.b  }, 'same')
      .to(handMaterial.emissive, { duration: 0.5, r: handColor.r, g: handColor.g, b: handColor.b  }, 'same')
      .to(shirtMaterial.color, { duration: 0.5, r: shirtColor.r, g: shirtColor.g, b: shirtColor.b  }, 'same')
      .to(vestMaterial.color, { duration: 0.5, r: vestColor.r, g: vestColor.g, b: vestColor.b  }, 'same')
      .call(() => {
        pane.refresh()
      })
      .play()
  })

  fu.addEventListener('click', () => {
    const tlFu = GSAP.timeline()
    let bgColor = new THREE.Color(0x156259)
    let handColor = new THREE.Color(0xc1b7e5)
    let shirtColor = new THREE.Color(0x568f46)
    let vestColor = new THREE.Color(0x822bc2)

    tlFu
      .to(PARAMS, {
        duration: 0,
        bg: 0x156259, hand: 0xc1b7e5, shirt: 0x568f46, vest: 0x822bc2,
        wrist: 0,
        thumb: 0.9, index: 1.1, middle: 0, ring: 1.25, pinky: 1.15,
        thumbz: -0.15, indexz: -0.30, middlez: -0.08, ringz: -0.22, pinkyz: -0.52,
      }, 'same')
      .to(wristRotation, { duration: 0.5, x: 0 }, 'same')
      .to(thumbRotation, { duration: 0.5, x: 0.9 }, 'same')
      .to(indexRotation, { duration: 0.5, x: 1.1 }, 'same')
      .to(middleRotation, { duration: 0.5, x: 0 }, 'same')
      .to(ringRotation, { duration: 0.5, x: 1.25 }, 'same')
      .to(pinkyRotation, { duration: 0.5, x: 1.15 }, 'same')
      .to(thumbRotation, { duration: 0.5, z: -0.15 }, 'same')
      .to(indexRotation[0], { duration: 0.5, z: -0.30 }, 'same')
      .to(middleRotation[0], { duration: 0.5, z: -0.08 }, 'same')
      .to(ringRotation[0], { duration: 0.5, z: 0.22 }, 'same')
      .to(pinkyRotation[0], { duration: 0.5, z: 0.52 }, 'same')
      .to(document.body, { duration: 0.5, backgroundColor: bgColor  }, 'same')
      .to(scene.background, { duration: 0.5, r: bgColor.r, g: bgColor.g, b: bgColor.b  }, 'same')
      .to(handMaterial.color, { duration: 0.5, r: handColor.r, g: handColor.g, b: handColor.b  }, 'same')
      .to(handMaterial.emissive, { duration: 0.5, r: handColor.r, g: handColor.g, b: handColor.b  }, 'same')
      .to(shirtMaterial.color, { duration: 0.5, r: shirtColor.r, g: shirtColor.g, b: shirtColor.b  }, 'same')
      .to(vestMaterial.color, { duration: 0.5, r: vestColor.r, g: vestColor.g, b: vestColor.b  }, 'same')
      .call(() => {
        pane.refresh()
      })
      .play()
  })

  vulcanSalute.addEventListener('click', () => {
    const tlVulcanSalute = GSAP.timeline()
    let bgColor = new THREE.Color(0x000000)
    let handColor = new THREE.Color(0x1c7f56)
    let shirtColor = new THREE.Color(0x922323)
    let vestColor = new THREE.Color(0xb1c8c2)

    tlVulcanSalute
      .to(PARAMS, {
        duration: 0,
        bg: 0x000000, hand: 0x1c7f56, shirt: 0x922323, vest: 0xb1c8c2,
        wrist: 0,
        thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0,
        thumbz: 0.08, indexz: -0.05, middlez: 0.22, ringz: 0.04, pinkyz: -0.34,
       }, 'same')
      .to(wristRotation, { duration: 0.5, x: 0 }, 'same')
      .to(thumbRotation, { duration: 0.5, x: 0 }, 'same')
      .to(indexRotation, { duration: 0.5, x: 0 }, 'same')
      .to(middleRotation, { duration: 0.5, x: 0 }, 'same')
      .to(ringRotation, { duration: 0.5, x: 0 }, 'same')
      .to(pinkyRotation, { duration: 0.5, x: 0 }, 'same')
      .to(thumbRotation, { duration: 0.5, z: 0.08 }, 'same')
      .to(indexRotation[0], { duration: 0.5, z: -0.05 }, 'same')
      .to(middleRotation[0], { duration: 0.5, z: 0.22 }, 'same')
      .to(ringRotation[0], { duration: 0.5, z: -0.04 }, 'same')
      .to(pinkyRotation[0], { duration: 0.5, z: 0.34 }, 'same')
      .to(scene.background, { duration: 0.5, r: bgColor.r, g: bgColor.g, b: bgColor.b  }, 'same')
      .to(handMaterial.color, { duration: 0.5, r: handColor.r, g: handColor.g, b: handColor.b  }, 'same')
      .to(handMaterial.emissive, { duration: 0.5, r: handColor.r, g: handColor.g, b: handColor.b  }, 'same')
      .to(shirtMaterial.color, { duration: 0.5, r: shirtColor.r, g: shirtColor.g, b: shirtColor.b  }, 'same')
      .to(vestMaterial.color, { duration: 0.5, r: vestColor.r, g: vestColor.g, b: vestColor.b  }, 'same')
      .call(() => {
        pane.refresh()
      })
      .play()
  })
}

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
directionalLight.position.set(-5, 5, 5)
directionalLight.scale.set(0.5, 0.5, 0.5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () =>
{
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  outlineEffect.setSize(sizes.width, sizes.height)
  outlineEffect.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 5)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0, 0)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI / 2
controls.minDistance = 3
controls.maxDistance = 10

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const outlineEffect = new OutlineEffect(renderer, {
  defaultThickness: 0.0035,
  defaultColor: [ 0, 0, 0 ],
  defaultAlpha: 0.8,
  defaultKeepAlive: true
})

/**
 * Capture
 */
const saveImage = document.querySelector('#screenshot')

saveImage.addEventListener('click', () => {
  outlineEffect.render(scene, camera)
  canvas.toBlob((blob) => {
    saveBlob(blob, `screencapture-${canvas.width}x${canvas.height}.png`)
  })
})

const saveBlob = (function() {
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.style.display = 'none'
  return function saveData(blob, fileName) {
     const url = window.URL.createObjectURL(blob)
     a.href = url
     a.download = fileName
     a.click()
  }
}())

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    controls.update()

    // Render
    outlineEffect.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
