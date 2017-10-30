// import {createStore, combineReducers} from 'redux'

// // import {
// //     Scene, PerspectiveCamera, WebGLRenderer,
// //     BoxGeometry, MeshBasicMaterial, Mesh, Vector3
// // } from 'three'

// import {
//     animationsReducer,
//     startAnimation,
// } from '../node/main.js'
// import {Become, Animate, Sequence} from '../node/animations.js'


// // init threejs scene
// const canvas = document.getElementById('canvas')
// const {width, height} = canvas.getBoundingClientRect()

// const scene = new Scene()
// const camera = new PerspectiveCamera(75, width/height, 0.1, 1000)
// const renderer = new WebGLRenderer()

// renderer.setSize(width, height)
// canvas.appendChild(renderer.domElement)


// // init scene objects
// camera.position.z = 5
// camera.position.set(0, 0, 5);
// camera.lookAt(new Vector3(0, 0, 0));
// const geometry = new BoxGeometry(1, 1, 1)
// const material = new MeshBasicMaterial({color: 0x00ff00})
// const cube = new Mesh(geometry, material)
// scene.add(cube)

// // init redux-time
// global.initial_state = {cube, camera}
// global.store = createStore(combineReducers({animations: animationsReducer}))
// global.time = startAnimation(global.store, global.initial_state)


// // render function
// let last = null
// const renderThreejs = () => {
//     const {state} = global.store.getState().animations
//     if (state !== last) {
//         last = state
//         renderer.render(scene, camera)
//     }
// }
// store.subscribe(renderThreejs)


// // animations

// const FOLLOW_ANIMATIONS = () => {
//     return [
//         Animate({
//             path: '/cube/rotation/x',
//             start_state: 0,
//             end_state: 30,
//             duration: 10000,
//         }),
//         Animate({
//             path: '/cube/rotation/y',
//             start_state: 0,
//             end_state: 30,
//             duration: 10000,
//         }),
//         Animate({
//             path: '/cube/position/x',
//             duration: Infinity,
//             tick: () => window.mouseX/100,
//         }),
//         Animate({
//             path: '/cube/position/y',
//             duration: Infinity,
//             tick: () => -window.mouseY/100,
//         }),
//         Animate({
//             path: '/camera/rotation/x',
//             duration: Infinity,
//             tick: () => window.cameraX/10,
//         }),
//         Animate({
//             path: '/camera/rotation/y',
//             duration: Infinity,
//             tick: () => window.cameraY/10,
//         }),
//     ]
// }

// window.mouseX = 0
// window.mouseY = 0
// window.cameraX = 0
// window.cameraY = 0

// window.onmousemove = (e) => {
//     const dims = canvas.getBoundingClientRect()
//     window.mouseY = e.pageY - dims.y - (dims.height/2)
//     window.mouseX = e.pageX - dims.x - (dims.width/2)
// }

// window.onkeydown = (e) => {
//     const codes = {37: 'left', 38: 'up', 39: 'right', 40: 'down'}
//     if (codes[e.keyCode] == 'left') {
//         window.cameraY += 1
//     }
//     if (codes[e.keyCode] == 'right') {
//         window.cameraY -= 1
//     }
//     if (codes[e.keyCode] == 'up') {
//         window.cameraX += 1
//     }
//     if (codes[e.keyCode] == 'down') {
//         window.cameraX -= 1
//     }
// }


// store.getState().animations.state.cube.rotation.x = 1

// store.dispatch({type: 'ANIMATE', animations: FOLLOW_ANIMATIONS()})
