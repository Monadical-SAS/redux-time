import {WarpedTime} from 'warped-time'

import {animations} from './reducers.js'
import {Become} from './animations.js'
import {AnimationControls} from './controls.js'
import {AnimationStateVisualizerComponent, AnimationStateVisualizer} from './state-visualizer.js'


const shouldAnimate = (anim_queue, timestamp, speed) => {
    return anim_queue.length && speed

    // timestamp = timestamp === undefined ? this.time.getWarpedTime() : timestamp

    // // if going forward in time, and future animations exist
    // if (this.time.speed > 0) {
    //     return (currentAnimations(animations.queue, timestamp, animations.last_timestamp).length
    //             || futureAnimations(animations.queue, timestamp).length)
    // }
    // else if (this.time.speed < 0) {
    //     return (currentAnimations(animations.queue, timestamp, animations.last_timestamp).length
    //             || pastAnimations(animations.queue, timestamp).length)
    // }
    // return false
}


class AnimationHandler {
    constructor(store, initial_state) {
        const speed = store.getState().animations.speed
        this.animating = false
        this.store = store
        this.time = new WarpedTime(null, speed)
        store.subscribe(::this.handleStateChange)
        if (initial_state) {
            this.initState(initial_state)
        }
        this.rAF = global.requestAnimationFrame || ((func) => setTimeout(func, 20))
    }
    initState(initial_state) {
        const animations = Object.keys(initial_state).map(key =>
            Become({
                path: `/${key}`,
                state: initial_state[key],
                start_time: 0,
            }))
        this.store.dispatch({type: 'ANIMATE', animations})
    }
    handleStateChange() {
        // console.log('RUNNING ANIMATION DISPATCHER')
        const {animations} = this.store.getState()
        this.time.setSpeed(animations.speed)
        const timestamp = this.time.getWarpedTime()
        if (!this.animating && shouldAnimate(animations.queue, timestamp, this.time.speed)) {
            console.log('[i] Starting Animation. Current time:', timestamp, ' Active Animations:', animations)
            this.tick()
        }
    }
    tick(high_res_timestamp) {
        this.animating = true
        if (high_res_timestamp) {
            this.start_time = this.start_time || this.time.getActualTime()
            high_res_timestamp = this.start_time + high_res_timestamp/1000
        }

        const {animations} = this.store.getState()
        const new_timestamp = this.time.getWarpedTime()

        this.store.dispatch({
            type: 'TICK',
            last_timestamp: animations.current_timestamp || 0,
            current_timestamp: new_timestamp,
            speed: animations.speed,
        })
        // if (shouldAnimate(animations.queue, new_timestamp, this.time.speed)) {
            // if (window && window.requestAnimationFrame) {
                this.rAF(::this.tick)
            // } else {
                // alert('This should never be reached in the browser.')
                // setTimeout(::this.tick, (Math.random() * 100) % 50)
            // }
        // } else {
            // this.animating = false
        // }
    }
}


const startAnimation = (store, initial_state) => {
    const handler = new AnimationHandler(store, initial_state)
    return handler.time
}


export {animations, startAnimation, AnimationHandler, AnimationControls, AnimationStateVisualizer, AnimationStateVisualizerComponent}
