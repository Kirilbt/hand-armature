import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import {Pane} from 'tweakpane'

// Canvas
const canvas = document.querySelector('canvas.webgl')

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
const PARAMS = {
  bg: 0x6B6AB3,
  hand: 0xE7A183,
  shirt: 0x303030,
  vest: 0xE7D55C,
  wrist: 0.1,
  thumb: 0.25,
  index: 0.25,
  middle: 1.1,
  ring: 1.1,
  pinky: 0.25
}

tab.pages[1].addInput(PARAMS, 'bg', {
  view: 'color',
  picker: 'inline',
  expanded: false,
}).on('change', (ev) => {
  scene.background.set(ev.value)
})

// Scene
const scene = new THREE.Scene()
const bgColor = new THREE.Color(PARAMS.bg)
scene.background = bgColor

/**
 * Models
 */
const gltfLoader = new GLTFLoader()

gltfLoader.load(
  'hand.glb',
  (gltf) =>
  {
    scene.add(gltf.scene.children[0])
    
    updateMaterials()
    updateBones()
  }
)

const updateMaterials = () => {
  scene.traverse((child) => {
    if(child instanceof THREE.Mesh) {
      // Shadows
      child.castShadow = true
      child.receiveShadow = true
    }
  })

  const handMaterial = new THREE.MeshStandardMaterial()
  handMaterial.color = new THREE.Color(0xE7A183)
  handMaterial.roughness = 0.7
  handMaterial.emissive = new THREE.Color(0xff0000)
  handMaterial.emissiveIntensity = 0.2
  scene.getObjectByName('Hand').material = handMaterial

  const shirtMaterial = new THREE.MeshStandardMaterial()
  shirtMaterial.color = new THREE.Color(0x303030)
  scene.getObjectByName('Shirt').material = shirtMaterial

  const vestMaterial = new THREE.MeshStandardMaterial()
  vestMaterial.color = new THREE.Color(0xE7D55C)
  scene.getObjectByName('Vest').material = vestMaterial


  // Pane
  tab.pages[1].addInput(PARAMS, 'hand', {
    view: 'color',
    picker: 'inline',
    expanded: false,
  }).on('change', (ev) => {
    handMaterial.color = new THREE.Color(ev.value)
    handMaterial.emissiveIntensity = 0
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

const updateBones = () => {
  const wrist = scene.getObjectByName('Hand').skeleton.bones[0]
  const wrist1 = scene.getObjectByName('Hand').skeleton.bones[1]
  const wrist2 = scene.getObjectByName('Hand').skeleton.bones[2]
  const wrist3 = scene.getObjectByName('Hand').skeleton.bones[6]
  const wrist4 = scene.getObjectByName('Hand').skeleton.bones[10]
  const wrist5 = scene.getObjectByName('Hand').skeleton.bones[14]
  const wrist6 = scene.getObjectByName('Hand').skeleton.bones[18]
  wrist.rotation.x = PARAMS.wrist
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

  // console.log(scene.getObjectByName('Hand').skeleton)

  // PANE
  tab.pages[0].addInput(PARAMS, 'wrist',
  {min: -0.4, max: 0.4, step: 0.01}
  )
  .on('change', (ev) => {
    wrist.rotation.x = (ev.value)
    wrist1.rotation.x = (ev.value)
    wrist2.rotation.x = (ev.value)
    wrist3.rotation.x = (ev.value)
    wrist4.rotation.x = (ev.value)
    wrist5.rotation.x = (ev.value)
    wrist6.rotation.x = (ev.value)
  })


  tab.pages[0].addInput(PARAMS, 'thumb',
  {min: 0, max: 0.9, step: 0.01}
  )
  .on('change', (ev) => {
    thumb1.rotation.x = (ev.value)
    thumb2.rotation.x = (ev.value)
    thumb3.rotation.x = (ev.value)
  })

  tab.pages[0].addInput(PARAMS, 'index',
  {min: 0, max: 1.1, step: 0.01}
  )
  .on('change', (ev) => {
    index1.rotation.x = (ev.value)
    index2.rotation.x = (ev.value)
    index3.rotation.x = (ev.value)
  })

  tab.pages[0].addInput(PARAMS, 'middle',
  {min: 0, max: 1.1, step: 0.01}
  )
  .on('change', (ev) => {
    middle1.rotation.x = (ev.value)
    middle2.rotation.x = (ev.value)
    middle3.rotation.x = (ev.value)
  })

  tab.pages[0].addInput(PARAMS, 'ring',
  {min: 0, max: 1.1, step: 0.01}
  )
  .on('change', (ev) => {
    ring1.rotation.x = (ev.value)
    ring2.rotation.x = (ev.value)
    ring3.rotation.x = (ev.value)
  })

  tab.pages[0].addInput(PARAMS, 'pinky',
  {min: 0, max: 1.1, step: 0.01}
  )
  .on('change', (ev) => {
    pinky1.rotation.x = (ev.value)
    pinky2.rotation.x = (ev.value)
    pinky3.rotation.x = (ev.value)
  })
}

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(512, 512)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.shadow.radius = 10
directionalLight.shadow.blurSamples = 100
directionalLight.position.set(-5, 5, 5)
directionalLight.scale.set(0.5, 0.5, 0.5)
scene.add(directionalLight)

const directionalLightRight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLightRight.castShadow = true
directionalLightRight.shadow.mapSize.set(512, 512)
directionalLightRight.shadow.camera.far = 15
directionalLightRight.shadow.camera.left = - 7
directionalLightRight.shadow.camera.top = 7
directionalLightRight.shadow.camera.right = 7
directionalLightRight.shadow.camera.bottom = - 7
directionalLight.shadow.radius = 10
directionalLight.shadow.blurSamples = 100
directionalLightRight.position.set(5, 5, 5)
directionalLightRight.scale.set(0.5, 0.5, 0.5)
scene.add(directionalLightRight)

const backSpotLight = new THREE.SpotLight(0xffffff)
backSpotLight.position.set(5, 2, -5)
scene.add(backSpotLight)

// const helper = new THREE.SpotLightHelper( backSpotLight, 5 )
// scene.add( helper )
// const camerahelper = new THREE.CameraHelper( directionalLight.shadow.camera )
// scene.add( camerahelper )

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
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */

// Base camera
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
  canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

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
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()