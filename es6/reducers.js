import {
    applyPatches,
    flattenStyles,
    reversed,
    flattened,
    checkIsValidAnimation,
    checkIsValidSequence,
    computeAnimatedState,
} from './util.js'


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

export const animationsReducer = (state=initial_state, action) => {
    switch (action.type) {
        case 'CLEAR_ANIMATIONS':
            const only_initial_state = state.queue.filter(anim =>
                anim.start_time === 0)
            return {
                ...initial_state,
                warped_time: state.warped_time,
                former_time: state.former_time,
                queue: only_initial_state,
                state: computeAnimatedState({
                    animations: only_initial_state,
                    warped_time: state.warped_time,
                    former_time: state.former_time,
                })
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
            return {
                ...state,
                queue: [...trimmed_queue, ...anim_objs],
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
            const animated_state = computeAnimatedState({
                animations: state.queue,
                warped_time: action.warped_time,
                former_time: action.former_time,
            })

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
