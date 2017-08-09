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
    // find all animations which began before current_time, and end after the last_timestamp (crucial to render final frame of animations)
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
    if (current_timestamp === undefined || last_timestamp === undefined) {
        throw 'Both current_timestamp and last_timestamp must be passed to get activeAnimations'
    }
    let anims
    if (last_timestamp < current_timestamp) {
        // when playing forwards, find all animations which began before current_time, and end after the time of the last frame
        anims = sortedAnimations(currentAnimations(anim_queue, current_timestamp, last_timestamp))
    } else if (last_timestamp >= current_timestamp) {
        // when playing in reverse, flip the two times to keep start/end time calculation math the same
        anims = sortedAnimations(currentAnimations(anim_queue, last_timestamp, current_timestamp))
    }

    if (uniqueify)
        anims = uniqueAnimations(anims)

    return anims
}


// window.parentExists = parentExists
// window.currentAnimations = currentAnimations
// window.sortedAnimations = sortedAnimations
// window.uniqueAnimations = uniqueAnimations
// window.activeAnimations = activeAnimations


export const computeAnimatedState = (anim_queue, current_timestamp, last_timestamp=null) => {
    last_timestamp = last_timestamp === null ? current_timestamp : last_timestamp

    const active_animations = activeAnimations(anim_queue, current_timestamp, last_timestamp, false)
    let patches = []

    for (let animation of active_animations) {
        try {
            const delta = current_timestamp - animation.start_time
            patches.push({'split_path': animation.split_path, 'value': animation.tick(delta)})
        } catch(e) {
            console.log(animation.type, 'Animation tick function threw an exception:', e.message, animation)
        }
    }

    return applyPatches({}, patches)
}

// limit anim_queue to max_time_travel length
const trimmedAnimationQueue = (anim_queue, max_time_travel) => {
    if (anim_queue.length > max_time_travel) {
        // console.log(
        //     '%c[i] Trimmed old animations from animations.queue', 'color:orange',
        //     `(queue was longer than ${max_time_travel} items)`
        // )
        const keep_from = anim_queue.length - max_time_travel
        const keep_to = -1

        let new_queue = anim_queue.slice(keep_from, keep_to)

        // always keep first BECOME animation
        if ((keep_from != 0 || new_queue.length == 0) && anim_queue.length) {
            new_queue = [anim_queue[0], ...new_queue]
        }

        return new_queue
    }
    return anim_queue
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
                anim_objs = [action.animation]
            } else if (action.animations && !action.animation) {
                // if animation sequence
                checkIsValidSequence(action.animations)
                anim_objs = action.animations
            } else {
                console.log('%cINVALID ANIMATE ACTION:', action)
                throw 'ANIMATE action must be passed either an animation sequence: [{}, {}, ...] or a single animation: {}'
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
            return {
                ...state,
                speed: action.speed,
                last_timestamp: state.current_timestamp,
            }

        case 'TICK':
            if (action.current_timestamp === undefined || action.last_timestamp === undefined) {
                throw 'TICK action must have a current_timestamp and last_timestamp'
            }
            const animated_state = computeAnimatedState(
                state.queue,
                action.current_timestamp,
                action.last_timestamp,
            )

            return {
                ...state,
                state: animated_state,
                speed: action.speed || state.speed,
                current_timestamp: action.current_timestamp,
                last_timestamp: action.last_timestamp,
            }

        default:
            return state
    }
}
