import {WarpedTime} from './warped-time/main.js'

import {applyPatches, reversed, stackTrace} from './util.js'


export const pastAnimations = (anim_queue, timestamp) =>
    anim_queue.filter(({start_time, duration}) => (start_time + duration < timestamp))

export const currentAnimations = (anim_queue, from_timestamp, to_timestamp) =>
    anim_queue.filter(({start_time, duration}) => (
        (start_time <= from_timestamp) && (start_time + duration >= to_timestamp)
    ))

export const futureAnimations = (anim_queue, timestamp) =>
    anim_queue.filter(({start_time, duration}) => (start_time > timestamp))

export const sortedAnimations = (anim_queue) => {
    return [...anim_queue].sort((a, b) => {
        // sort by end time, if both are the same, sort by start time, properly handle infinity
        if (a.end_time == b.end_time) {
            return a.start_time - b.start_time
        } else {
            if (a.end_time == Infinity) {
                return -1
            }
            else if (b.end_time == Infinity) {
                return 1
            }
            else {
                return a.end_time - b.end_time
            }
        }
    })
}

// 0 /a /b /c       3
// 1 /a /b          2
// 2 /a /b /e /d    4

const parentExists = (paths, path) => {
    let parent = ''
    for (let key of path.split('/').slice(1)) {             // O(path.length)
        parent = `${parent}/${key}`
        if (paths.has(parent)) {
            return true
        }
    }
    return false
}

export const uniqueAnimations = (anim_queue) => {
    const paths = new Set()
    const uniq_anims = []

    for (let anim of reversed(anim_queue)) {    // O(anim_que.length)
        if (!parentExists(paths, anim.path)) {
            uniq_anims.push(anim)
            paths.add(anim.path)
        }
    }

    return uniq_anims.reverse()
}

export const activeAnimations = (anim_queue, current_timestamp, last_timestamp) =>
    uniqueAnimations(sortedAnimations(currentAnimations(anim_queue, current_timestamp, last_timestamp)))

export const shouldAnimate = (anim_queue, timestamp, speed) => {
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

// window.parentExists = parentExists
// window.currentAnimations = currentAnimations
// window.sortedAnimations = sortedAnimations
// window.uniqueAnimations = uniqueAnimations
// window.activeAnimations = activeAnimations
// window.shouldAnimate = shouldAnimate


const transforms = {
    translate:  ({top, left}) =>            `translate(${left}, ${top})`,
    rotate:     (rotation) =>               `rotate(${rotation})`,
    scale:      (scale) =>                  `scale(${scale})`,
    // TODO: add more css transform types
}


export const flattenStyles = (state) => {
    // converts {style: {transform: {translate: {left: '0px', top: '10px'}, rotate: '10deg'}}}
    //      =>  {style: {transform: 'translate(0px, 10px) rotate(10deg)'}}

    // this converts the styles stored as dicts in the state tree, to the strings
    // that react components expect as style values
    if (state === undefined || state === null || (Array.isArray(state) && !state.style)) {
        // don't mess with values that don't have a style key
        return state
    }
    else if (state && state.transform) {
        // flatten transform styles from a dict to a string
        const css_funcs = Object.keys(state.transform).map(key =>
            transforms[key](state.transform[key]))

        return {
            ...state,
            transform: css_funcs.join(' '),
        }
    }
    else if (typeof(state) === 'object') {
        // recurse down if value is a dictionary
        return Object.keys(state).reduce((acc, key) => {
            acc[key] = flattenStyles(state[key])
            return acc
        }, {})
    }
    return state
}

export const computeAnimatedState = (anim_queue, current_timestamp, last_timestamp=null) => {
    last_timestamp = last_timestamp === null ? current_timestamp : last_timestamp

    const active_animations = activeAnimations(anim_queue, current_timestamp, last_timestamp)
    let patches = []

    for (let animation of active_animations) {
        try {
            const delta = current_timestamp - animation.start_time
            patches.push({'path': animation.path, 'value': animation.tick(delta)})
        } catch(e) {
            console.log(animation.type, 'Animation tick function threw an exception:', e.message, animation)
        }
    }

    return flattenStyles(applyPatches({}, patches))
}

const trimmedAnimationQueue = (anim_queue, max_time_travel) => {
    const keep_from = anim_queue.length - max_time_travel
    const keep_to = -1

    let new_queue = anim_queue.slice(keep_from, keep_to)

    // always keep first BECOME animation
    if ((keep_from != 0 || new_queue.length == 0) && anim_queue.length) {
        new_queue = [anim_queue[0], ...new_queue]
    }

    return new_queue
}


export const initial_state = {
    speed: 1,
    last_timestamp: 0,
    current_timestamp: 0,
    max_time_travel: 300,   // maximum length of the queue before items get trimmed
    queue: [],
    state: {},
}

export const animations = (state=initial_state, action) => {
    switch (action.type) {
        case 'ADD_ANIMATION':
            let queue = state.queue
            if (queue.length > state.max_time_travel) {
                // console.log(
                //     '%c[i] Trimmed old animations from animations.queue', 'color:orange',
                //     `(queue was longer than ${state.max_time_travel} items)`
                // )
                queue = trimmedAnimationQueue(queue, state.max_time_travel)
            }

            if (Array.isArray(action.animation))
                return {...state, queue: [...queue, ...action.animation]}
            else
                return {...state, queue: [...queue, action.animation]}

        case 'SET_ANIMATION_SPEED':
            return {...state, speed: action.speed, last_timestamp: state.current_timestamp}

        case 'TICK':
            const anim_state = computeAnimatedState(
                state.queue,
                action.current_timestamp,
                action.last_timestamp,
            )

            return {
                ...state,
                state: anim_state,
                speed: action.speed || state.speed,
                current_timestamp: action.current_timestamp,
                last_timestamp: action.last_timestamp,
            }

        default:
            return state
    }
}


export class AnimationHandler {
    constructor(store) {
        this.time = new WarpedTime()
        this.time.setSpeed(store.getState().animations.speed)
        this.store = store
        this.animating = false
        this.start_time = 0
        store.subscribe(::this.handleStateChange)
    }
    handleStateChange() {
        // console.log('RUNNING ANIMATION DISPATCHER')
        const {animations} = this.store.getState()
        this.time.setSpeed(animations.speed)
        const timestamp = this.time.getWarpedTime()

        if (!this.animating && shouldAnimate(animations.queue, timestamp, this.time.speed)) {
            console.log('Starting Animation.')
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
        if (shouldAnimate(animations.queue, new_timestamp, this.time.speed)) {
            if (window && window.requestAnimationFrame) {
                window.requestAnimationFrame(::this.tick)
            } else {
                alert('This should never be reached in the browser.')
                setTimeout(::this.tick, (Math.random() * 100) % 50)
            }
        } else {
            this.animating = false
        }
    }
}

