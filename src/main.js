import {WarpedTime} from 'warped-time'

import {animations} from './reducers.js'
import {Become} from './animations.js'
import {AnimationControls} from './controls.js'
import {AnimationStateVisualizerComponent, AnimationStateVisualizer} from './state-visualizer.js'


var window = window || global


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
        this.time = new WarpedTime()
        this.time.setSpeed(store.getState().animations.speed)
        this.store = store
        this.animating = false
        this.start_time = 0
        store.subscribe(::this.handleStateChange)
        this.initState(initial_state || {})
    }
    initState(initial_state) {
        Object.keys(initial_state).map(key => {
            this.store.dispatch({type: 'ADD_ANIMATION', animation: Become({
                path: `/${key}`,
                state: initial_state[key],
                start_time: 0,
            })})
        })
    }
    handleStateChange() {
        // console.log('RUNNING ANIMATION DISPATCHER')
        const {animations} = this.store.getState()
        this.time.setSpeed(animations.speed)
        const timestamp = this.time.getWarpedTime()

        if (!this.animating && shouldAnimate(animations.queue, timestamp, this.time.speed)) {
            // console.log('Starting Animation.')
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
            speed: this.time.speed,
        })
        // if (shouldAnimate(animations.queue, new_timestamp, this.time.speed)) {
            // if (window && window.requestAnimationFrame) {
                window.requestAnimationFrame(::this.tick)
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
