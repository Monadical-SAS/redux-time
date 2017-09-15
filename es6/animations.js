import {
    mod,
    range,
    flattened,
    checkIsValidAnimation,
    checkIsValidSequence,
    EasingFunctions,
    immutify,
} from './util.js'

const tick_func = (
        {start_time, end_time, duration, start_state, end_state, delta_state,
        curve='linear', unit=null}, key) => {

    const curve_func = EasingFunctions[curve]

    return (time_elapsed) => {
        const bounded_time = Math.min(Math.max(time_elapsed, 0), duration)
        const curve = curve_func(bounded_time/duration)
        const new_state = start_state + curve * delta_state
        return unit ? `${new_state}${unit}` : new_state
    }
}

const checked_animation_duration = ({start_time, duration, end_time}) => {
    if ([start_time, end_time, duration].filter(a => typeof(a) == 'number').length < 2) {
        console.log({start_time, end_time, duration})
        throw 'Need at least 2/3 to calculate animation: start_time, end_time, duration'
    }

    if (start_time === undefined)
        start_time = end_time - duration
    if (end_time === undefined)
        end_time = start_time + duration
    if (duration === undefined)
        duration = end_time - start_time

    if (start_time + duration != end_time) {
        console.log({start_time, end_time, duration})
        throw 'Conflicting values, Animation end_time != start_time + duration'
    }
    return {start_time, duration, end_time}
}


const KeyedAnimation = ({
        type, path, key, start_time, end_time, duration, start_state,
        end_state, delta_state, curve, unit}) =>
    Animate({
        type,
        path: `${path}/${key}`,
        key,
        start_time,
        end_time,
        duration,
        start_state: start_state && start_state[key],
        end_state: end_state && end_state[key],
        delta_state: delta_state && delta_state[key],
        curve, unit,
    })

export const Become = ({path, state, start_time,
                        end_time=Infinity, duration=Infinity}) => {
    if (start_time === undefined) start_time = Date.now()

    var {start_time, end_time, duration} = checked_animation_duration(
        {start_time, end_time, duration})
    if (start_time === undefined || path === undefined) {
        console.log({path, state, start_time, end_time, duration})
        throw 'Become animation must have a start_time and path defined.'
    }
    return Animate({
        type: 'BECOME',
        path,
        start_state: state,
        start_time,
        end_time,
        duration,
        tick: (time_elapsed) => {
            return state
        },
    })
}


const checked_animation_delta_state = ({key, start_state, end_state, delta_state}) => {
    // TODO: is it inconceivable that an animation could be defined
    //  with a tick that defines a transition from a
    //  numeric -> non-numeric type?
    // e.g. Become does this
    if (start_state !== undefined
            && end_state === undefined
            && delta_state === undefined) {
        return {}
    }

    if (typeof(start_state) === 'number') {
        if ([start_state, end_state, delta_state].filter(a => typeof(a) == 'number').length < 2) {
            console.log({start_state, end_state, delta_state})
            throw 'Need at least 2/3 to calculate animation: start_state, end_state, delta_state'
        }

        if (start_state === undefined)
            start_state = end_state - delta_state
        if (end_state === undefined)
            end_state = start_state + delta_state
        if (delta_state === undefined)
            delta_state = end_state - start_state

        if (start_state + delta_state != end_state) {
            console.log({start_state, end_state, delta_state})
            throw 'Conflicting values, Animation end_state != start + delta_state'
        }

        return {start_state, end_state, delta_state}
    } else if (typeof(start_state) === 'object') {
        if (end_state === undefined) end_state = {}
        if (delta_state === undefined) delta_state = {}

        if (key !== undefined)
            return checked_animation_delta_state({
                start_state: start_state[key],
                end_state: end_state[key],
                delta_state: delta_state[key]
            })

        console.log({key, start_state, end_state, delta_state})
        if (typeof(start_state) !== 'object'
                || typeof(end_state) !== 'object'
                || typeof(delta_state) !== 'object') {
            throw 'Incompatible types passed as {start_state, end_state, delta_state}, must all be objects or numbers'
        }

        let keys = Object.keys(start_state)
        if (!keys.length) keys = Object.keys(end_state)
        if (!keys.length) keys = Object.keys(delta_state)

        return keys.reduce((acc, key) => {
            //  Recursively check that deltas in state add up
            const delta_states = checked_animation_delta_state({
                start_state: start_state[key],
                end_state: end_state[key],
                delta_state: delta_state[key]
            })
            acc.start_state[key] = delta_states.start_state
            acc.end_state[key] = delta_states.end_state
            acc.delta_state[key] = delta_states.delta_state
            return acc
        }, {start_state: {}, end_state: {}, delta_state: {}})
    } else {
        return {start_state, end_state, delta_state}
    }
}

export const startEndDeltaCheck = (start, end, delta) => {
    if (typeof(start) === 'object') {
        throw "TODO: find an example of where this is used & clean update"

        let keys = Object.keys(start_state)
        if (!keys.length) keys = Object.keys(end_state)
        if (!keys.length) keys = Object.keys(delta_state)

        return keys.reduce((acc, key) => {
            const delta_states = checked_animation_delta_state({
                start_state: start_state[key],
                end_state: end_state[key],
                delta_state: delta_state[key]
            })
            acc.start_state[key] = delta_states.start_state
            acc.end_state[key] = delta_states.end_state
            acc.delta_state[key] = delta_states.delta_state
            return acc
        }, {start_state: {}, end_state: {}, delta_state: {}})

    } else if (typeof(start) === 'number'
                && (delta !== undefined || end !== undefined)) {
        // calculate the missing value
        if (end === undefined && delta !== undefined) {
            return [start, state + delta, delta]
        } else if (end !== undefined && delta === undefined) {
            return [start, end, end - start]
        }
    }
    if (typeof(start) === 'number'
            && typeof(end) === 'number'
            && typeof(delta) === 'number') {
        if (start + delta !== end) {
            throw `start (${start}) + delta (${delta}) !== end (${end})`
        }
    }
    return [start, end, delta]
}

export const Animate = ({
        type, path, start_time, end_time, duration, start_state, end_state,
        delta_state, curve='linear', unit=null, tick=null}) => {

    if (start_time === undefined) start_time = (new Date).getTime()

    let _start_time, _end_time, _duration, _start_state,
        _end_state, _delta_state, _tick, _split_path, _type

    [_start_time,
     _end_time,
     _duration] = startEndDeltaCheck(start_time, end_time, duration)

    [_start_state,
     _end_state,
     _delta_state] = startEndDeltaCheck(start_state, end_state, delta_state)

    _type = type ? type : 'ANIMATE'
    _split_path = path.split('/').slice(1)

    let animation = {
        type: _type,
        split_path: _split_path,
        start_time: _start_time,
        end_time: _end_time,
        duration: _duration,
        start_state: _start_state,
        end_state: _end_state,
        delta_state: _delta_state,

        path: path,
        curve: curve,
        unit: unit,
    }
    _tick = tick || tick_func(animation)
    animation.tick = _tick
    return immutify(animation)
}

export const AnimateCSS = ({
        name, path, start_time, end_time, duration=1000, curve='linear'}) => {
    if (start_time === undefined) start_time = Date.now()

    var {start_time, end_time, duration} = checked_animation_duration({
                                            start_time, end_time, duration})

    const start_state = {
        name,
        duration,
        curve,
        delay: 0,
        playState: 'paused'
    }
    const end_state = {
        name,
        duration,
        curve,
        delay: duration,
        playState: 'paused'
    }
    return Animate({
        type: `CSS_${name ? name.toUpperCase() : 'END'}`,
        path: `${path}/style/animation/${name}`,
        start_time,
        end_time,
        duration,
        curve,
        start_state,
        end_state,
        delta_state: {delay: duration},
        tick: (time_elapsed) => {
            if (time_elapsed <= 0) {
                return start_state
            }
            else if (time_elapsed >= duration) {
                return end_state
            }
            else {
                return {...start_state, delay: time_elapsed}
            }
        },
    })
}

export const Translate = ({
        path, start_time, end_time, duration=1000, start_state, end_state,
        delta_state, curve='linear', unit='px'}) => {
    if (start_time === undefined) start_time = (new Date).getTime()
    if (start_state === undefined) start_state = {top: 0, left: 0}
    path = `${path}/style/transform/translate`
    const type = 'TRANSLATE'

    const animation = {type, path, start_time, end_time, duration,
                       start_state, end_state, delta_state, curve, unit}
    //  TODO: change left => /left to keep state selectors consistent
    const left_tick = tick_func(animation, 'left', 0)
    const top_tick =  tick_func(animation, 'top', 0)

    animation.tick = (time_elapsed) => ({
        left: left_tick(time_elapsed),
        top: top_tick(time_elapsed),
    })
    return Animate(animation)
}

export const TranslateTo = ({
        path, start_time, end_time, duration=1000, start_state, end_state,
        delta_state, curve='linear', unit='px'}) => {
    let anims = []
    const has_left = (start_state || end_state || delta_state).left !== undefined
    const has_top = (start_state || end_state || delta_state).top !== undefined
    if (has_left) {
        anims = [
            KeyedAnimation({
                type: 'TRANSLATE_TO_LEFT',
                path: `${path}/style`,
                key: 'left',
                start_time, end_time, duration,
                start_state, end_state, delta_state,
                curve, unit,
            })
        ]
    }
    if (has_top) {
        anims = [
            ...anims,
            KeyedAnimation({
                type: 'TRANSLATE_TO_TOP',
                path: `${path}/style`,
                key: 'top',
                start_time, end_time, duration,
                start_state, end_state, delta_state,
                curve, unit,
            })
        ]
    }
    if (!has_left && !has_top)
        throw 'TranslateTo start_state and end_state must have {left or top}'
    return anims
}

export const Opacity = ({
        path, start_time, end_time, duration, start_state, end_state, delta_state,
        curve='linear', unit=null}) =>
    Animate({
        type: 'OPACITY',
        path: `${path}/style/opacity`,
        start_time,
        end_time,
        duration,
        start_state,
        end_state,
        delta_state,
        curve,
        unit,
    })

export const Rotate = ({
        path, start_time, end_time, duration, start_state, end_state, delta_state,
        curve='linear', unit='deg'}) =>
    Animate({
        type: 'ROTATE',
        path: `${path}/style/transform/rotate`,
        start_time,
        end_time,
        duration,
        start_state,
        end_state,
        delta_state,
        curve,
        unit,
    })

// repeat a single animation (which may be composed of several objects)
export const Repeat = (animation, repeat=Infinity) => {
    checkIsValidAnimation(animation)
    let {tick, start_time, duration} = animation
    if (start_time === undefined) start_time = (new Date).getTime()
    const repeated_tick = (time_elapsed) => tick(mod(time_elapsed, duration))
    return {
        ...animation,
        repeat,
        duration: duration * repeat,
        end_time: start_time + duration*repeat,
        tick: repeated_tick,
    }
}

// reverse a single animation (which may be composed of several objects)
export const Reverse = (animation) => {
    checkIsValidAnimation(animation)
    let {tick, start_time, duration} = animation
    if (start_time === undefined) start_time = (new Date).getTime()
    return {
        ...animation,
        start_time: end_time,
        end_time: start_time,
        tick: (time_elapsed) => tick(duration - time_elapsed),
    }
}

// reverse a sequence of animations
// export const ReverseSequence = (animations) => {
    // TODO
// }

// make each animation in a sequence start after the last one ends
export const Sequential = (animations, start_time) => {
    checkIsValidSequence(animations)
    if (start_time === undefined) start_time = (new Date).getTime()
    const seq = []
    let last_end = start_time
    for (let animation of animations) {
        seq.push({
            ...animation,
            start_time: last_end,
            end_time: last_end + animation.duration,
        })
        last_end = animation.duration == Infinity ?
            last_end + 1
          : last_end + animation.duration
    }
    checkIsValidSequence(seq)
    return seq
}

// repeat a sequential list of animations
export const RepeatSequence = (animations, repeat, start_time) => {
    checkIsValidSequence(animations)

    const repeated = range(repeat).reduce((acc, val) => {
        return acc = [...acc, ...animations]
    }, [])
    return Sequential(repeated, start_time)
}
