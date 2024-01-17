import * as THREE from 'three'
import Scene from './Scene'
// @ts-ignore
import {FlyControls} from './FlyControls.js'
import Stats from 'three/examples/jsm/libs/stats.module'

const width = window.innerWidth
const height = window.innerHeight-1

const renderer = new THREE.WebGLRenderer({
	canvas: document.getElementById('app') as HTMLCanvasElement,
  antialias: true
})
renderer.setSize(width, height)

window.addEventListener("resize", () => {
  const _width = window.innerWidth
  const _height = window.innerHeight-1
  renderer.setSize(_width, _height)
});

var camera = new THREE.PerspectiveCamera(60, width/height, 0.1, 100)
camera.position.set(0, 10, 0)
//camera.lookAt(0, 0, 0)

const scene = new Scene() // script Scene
scene.initialize()

scene.fog = new THREE.Fog(0xB9C1C2 , 20, 50);

renderer.render(scene, camera)

const flyControls  = new FlyControls(camera, renderer.domElement)
flyControls.movementSpeed = 5
flyControls.rollSpeed = 0.5
flyControls.autoForward = false
flyControls.dragToLook = true

const stats = Stats()
document.body.appendChild(stats.dom)

function tick(){

  //camera.position.x+=0.01
  flyControls.update(0.05)
  stats.update()

  scene.update(camera.position)
  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}

tick()

export { camera }


