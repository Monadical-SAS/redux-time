import {
    applyPatches,
    flattenStyles,
    reversed,
    flattened,
    checkIsValidAnimation,
    checkIsValidSequence,
} from './util.js'


export const currentAnimations = ({anim_queue, warped_time}) => {
    return anim_queue.filter(({start_time, end_time}) => {
        const started_already = start_time <= warped_time
        const has_not_ended = end_time > warped_time
        return started_already && has_not_ended
    })
}

export const finalFrameAnimations = ({anim_queue, warped_time, former_time}) => {
    const is_between = (anim) => {
        if (warped_time >= former_time) {
        // traveling forward in time or standing still
            return (former_time <= anim.end_time)
                && (anim.end_time < warped_time)
        } else {
        // traveling backward in time
            return (warped_time < anim.start_time)
                && (anim.start_time <= former_time)
        }
    }

    return anim_queue.filter((anim) => is_between(anim))
}


// these are no longer useful -- they only make sense with unidirectional time
export const pastAnimations = (anim_queue, timestamp) =>
    anim_queue.filter(({start_time, duration}) =>
        (start_time + duration < timestamp))

export const futureAnimations = (anim_queue, timestamp) =>
    anim_queue.filter(({start_time, duration}) => (start_time > timestamp))

// export const sortedAnimations = (anim_queue) => {
//     return [...anim_queue].sort((a, b) => {
//         // sort by end time, if both are the same, sort by start time,
//         //  and properly handle infinity
//         if (a.end_time == b.end_time) {
//             return b.start_time - a.start_time
//         } else {
//             if (a.end_time == Infinity) {
//                 return 1
//             }
//             else if (b.end_time == Infinity) {
//                 return -1
//             }
//             else {
//                 return b.end_time - a.end_time
//             }
//         }
//     })
// }

// 0 /a /b /c       3
// 1 /a /b          2
// 2 /a /b /e /d    4

const parentExists = (paths, path) => {
    let parent = ''
    for (let key of path.split('/').slice(1)) {   // O(path.length)
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

export const activeAnimations = ({anim_queue, warped_time,
                                  former_time, uniqueify}) => {
    if (warped_time === undefined || former_time === undefined) {
        throw 'Both warped_time and former_time must be passed to get activeAnimations'
    }

    let anims = [
        ...finalFrameAnimations({anim_queue, former_time, warped_time}),
        ...currentAnimations({anim_queue, warped_time}),
    ]

    if (uniqueify)
        anims = uniqueAnimations(anims)

    return anims
}

export const computeAnimatedState = (anim_queue, warped_time,
        former_time=null) => {
    former_time = former_time === null ? warped_time : former_time

    const active_animations = activeAnimations({anim_queue,
                                                warped_time,
                                                former_time,
                                                uniqueify: false})
    let patches = []
    // console.log({active_animations})
    for (let animation of active_animations) {
        try {
            const delta = warped_time - animation.start_time
            patches.push({
                split_path: animation.split_path,
                value: animation.tick(delta),
            })
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
        //     '%c[i] Trimmed old animations from animations.queue',
        //     'color:orange',
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
    former_time: 0,
    warped_time: 0,
    // maximum length of the queue before items get trimmed
    max_time_travel: 3000,
    queue: [],
    state: {},
}

export const animations = (state=initial_state, action) => {
    switch (action.type) {
        case 'CLEAR_ANIMATIONS':
            const only_initial_state = state.queue.filter(anim =>
                anim.start_time === 0)
            return {
                ...initial_state,
                warped_time: state.warped_time,
                former_time: state.former_time,
                queue: only_initial_state,
                state: computeAnimatedState(
                    only_initial_state,
                    state.warped_time,
                    state.former_time,
                )
            }

        case 'ANIMATE':
            // Adds animations to the queue
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
                // set to now if start_time is not provided
                start_time: anim.start_time === undefined ?
                    (new Date).getTime()
                  : anim.start_time
            }))
            return {
                ...state,
                queue: [...trimmed_queue, ...new_animation_objs],
            }

        case 'SET_SPEED':
            return {
                ...state,
                speed: action.speed,
                former_time: state.warped_time,
            }

        case 'TICK':
            if (action.warped_time === undefined
                    || action.former_time === undefined) {
                throw 'TICK action must have a warped_time and former_time'
            }
            const animated_state = computeAnimatedState(
                state.queue,
                action.warped_time,
                action.former_time,
            )

            return {
                ...state,
                state: animated_state,
                speed: action.speed || state.speed,
                warped_time: action.warped_time,
                former_time: action.former_time,
            }

        default:
            return state
    }
}
