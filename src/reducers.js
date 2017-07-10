import {
    applyPatches,
    flattenStyles,
    reversed,
    flattened,
    checkIsValidAnimation,
    checkIsValidSequence,
} from './util.js'


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

export const activeAnimations = (anim_queue, current_timestamp, last_timestamp, uniqueify=true) => {
    const anims = sortedAnimations(currentAnimations(anim_queue, current_timestamp, last_timestamp))
    if (uniqueify)
        return uniqueAnimations(anims)
    return anims
}


// window.parentExists = parentExists
// window.currentAnimations = currentAnimations
// window.sortedAnimations = sortedAnimations
// window.uniqueAnimations = uniqueAnimations
// window.activeAnimations = activeAnimations


const css_transform_str = {
    scale:          (scale) =>                  `scale(${scale})`,
    perspective:    (px) =>                     `perspective(${px})`,
    translate:      ({left, top}) =>            `translate(${left}, ${top})`,
    translate3d:    ({x, y, z}) =>              `translate3d(${x}, ${y}, ${z})`,
    rotate:         (rotation) =>               `rotate(${rotation})`,
    rotate3d:       ({x, y, z}) =>              `rotate3d(${x}, ${y}, ${z})`,
    skew:           ({x, y}) =>                 `skew(${x}, ${y})`,
    scale3d:        ({x, y, z}) =>              `scale3d(${x}, ${y}, ${z})`,
    // TODO: add more css transform types?
}

const css_animation_str = ({name, duration, curve, delay, playState}) =>
    `${name} ${duration}ms ${curve} -${delay}ms ${playState}`


export const flattenStyles = (state) => {
    // this converts the styles stored as dicts in the state tree, to the strings
    // that react components expect as CSS style values

    if (state === undefined || state === null || (Array.isArray(state) && !state.style)) {  // TODO: make this also recurse into arrays since vals may have .style
        // don't mess with values that don't have a style key
        return state
    }
    if (state && state.animation) {
        // flatten animations from a dict to a string
        // converts {style: {animations: {blinker: {name: blinker, duration: 1000, curve: 'linear', delay: 767}, ...}}}
        //      =>  {style: {animation: blinker 1000ms linear -767ms paused, ...}}
        const css_animation_funcs = Object.keys(state.animation)
            .filter(key => state.animation[key])
            .map(key =>
                css_animation_str(state.animation[key]))

        state = {
            ...state,
            animation: css_animation_funcs.join(', '),
        }
    }
    if (state && state.transform) {
        // flatten transforms from a dict to a string
        // converts {style: {transform: {translate: {left: '0px', top: '10px'}, rotate: '10deg'}}}
        //      =>  {style: {transform: 'translate(0px, 10px) rotate(10deg)'}}
        const css_transform_funcs = Object.keys(state.transform)
            .map(key =>
                css_transform_str[key](state.transform[key]))

        state = {
            ...state,
            transform: css_transform_funcs.join(' '),
        }
    }
    if (typeof(state) === 'object' && !(state.animations || state.transform)) {
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
    max_time_travel: 3000,   // maximum length of the queue before items get trimmed
    queue: [],
    state: {},
}

export const animations = (state=initial_state, action) => {
    switch (action.type) {
        case 'CLEAR_ANIMATIONS':
            const only_initial_state = state.queue.filter(anim => anim.start_time === 0)
            return {
                ...initial_state,
                current_timestamp: state.current_timestamp,
                last_timestamp: state.last_timestamp,
                queue: only_initial_state,
                state: computeAnimatedState(
                    only_initial_state,
                    state.current_timestamp,
                    state.last_timestamp,
                )
            }

        case 'ANIMATE':
            let anim_objs
            // validate new animations are correctly typed
            if (action.animation && !action.animations) {
                // if single animation
                checkIsValidAnimation(action.animation)
                anim_objs = action.animation
            } else if (action.animations && !action.animation) {
                // if animation sequence
                checkIsValidSequence(action.animations)
                anim_objs = flattened(action.animations)
            } else {
                console.log('%cINVALID ANIMATE ACTION:', action)
                throw 'ANIMATE action must be passed either animations: [[{}, {}, ...], [...], ...] or animation: [{}, {}, ...]'
            }
            // trim queue to max_time_travel length
            const trimmed_queue = trimmedAnimationQueue(
                state.queue,
                state.max_time_travel,
            )
            // add any missing fields
            const new_animation_objs = anim_objs.map(anim => ({
                ...anim,
                split_path: anim.path.split('/').slice(1),   // .split is expensive to do later, saves CPU on each TICK
                start_time: anim.start_time === undefined ?  // set to now if start_time is not provided
                    (new Date).getTime()
                  : anim.start_time
            }))
            return {
                ...state,
                queue: [...trimmed_queue, ...new_animation_objs],
            }

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
