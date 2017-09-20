import {WarpedTime} from 'warped-time'

import {animationsReducer} from './reducers.js'
import {Become} from './animations.js'
import {AnimationControls} from './controls.js'
import {AnimationStateVisualizerComponent,
        AnimationStateVisualizer} from './state-visualizer.js'
import {AnimationTimeline} from "./timeline.js"


const shouldAnimate = (anim_queue, timestamp, speed) => {
    return anim_queue.length && speed

    // timestamp = timestamp === undefined ? this.time.getWarpedTime() : timestamp

    // // if going forward in time, and future animations exist
    // if (this.time.speed > 0) {
    //     return (currentAnimations(animations.queue, timestamp, animations.former_time).length
    //             || futureAnimations(animations.queue, timestamp).length)
    // }
    // else if (this.time.speed < 0) {
    //     return (currentAnimations(animations.queue, timestamp, animations.former_time).length
    //             || pastAnimations(animations.queue, timestamp).length)
    // }
    // return false
}


class AnimationsHandler {
    constructor({store, initial_state, autostart_animating=true, requestFrame=null}) {
        if (requestFrame === null) {
            if (global.DEBUG) console.log('Running animations in browser')
            this.requestFrame = (func) =>
                window.requestAnimationFrame.call(window, func)
        } else {
            if (global.DEBUG) console.log('Running animations with custom requestFrame')
            this.requestFrame = requestFrame
        }

        const speed = store.getState().animations.speed
        this.animating = !autostart_animating
        this.store = store
        this.time = new WarpedTime({speed})
        store.subscribe(::this.handleStateChange)
        if (initial_state) {
            this.initState(initial_state)
        }
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
            if (global.DEBUG) {
                console.log('[i] Starting Animation. Current time:',
                            timestamp,
                            ' Active Animations:',
                            animations.queue)
            }
            this.tick()
        }
    }
    tick(high_res_timestamp) {
        this.animating = true
        // if (shouldAnimate(animations.queue, new_timestamp, this.time.speed)) {
            this.requestFrame(::this.tick)
        // } else {
            // this.animating = false
        // }

        if (high_res_timestamp) {
            this.start_time = this.start_time || this.time.getActualTime()
            high_res_timestamp = this.start_time + high_res_timestamp/1000
        }
        const {animations} = this.store.getState()
        const new_timestamp = this.time.getWarpedTime()

        this.store.dispatch({
            type: 'TICK',
            //TODO: duplicating code from WarpedTime.getWarpedTime
            former_time: animations.warped_time || 0,
            warped_time: new_timestamp,
            speed: animations.speed,
        })
    }
}


const startAnimation = (store, initial_state, autostart_animating=true) => {
    const handler = new AnimationsHandler({
        store,
        initial_state,
        autostart_animating
    })
    return handler.time
}


export {animationsReducer, startAnimation, AnimationsHandler, AnimationControls,
        AnimationStateVisualizer, AnimationStateVisualizerComponent,
        AnimationTimeline}
