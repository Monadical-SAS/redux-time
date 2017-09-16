import {
    mod,
    range,
    flattened,
    checkIsValidAnimation,
    checkIsValidSequence,
    EasingFunctions,
    immutify,
} from './util.js'

import {computeAnimatedState} from './reducers.js'

import isEqual from 'lodash.isequal'

const tick_func = ({duration, start_state, delta_state,
                    curve='linear', unit=null}) => {

    const curve_func = EasingFunctions[curve]

    return (time_elapsed) => {
        const bounded_time = Math.min(Math.max(time_elapsed, 0), duration)
        const curve = curve_func(bounded_time/duration)
        const new_state = start_state + curve * delta_state

        return add_unit(new_state, unit)
    }
}

const add_unit = (val, unit) => {
    return unit ? `${val}${unit}` : val
}

export const Become = ({path, state, start_time,
                        end_time=Infinity, duration=Infinity}) => {
    if (start_time === undefined) start_time = Date.now()

    if (exactlyOneIsUndefined(duration, end_time)) {
        let [duration,
             end_time] = calculateTheOther(start_time, duration, end_time)
    }
    if (start_time === undefined || path === undefined) {
        console.log({path, state, start_time, end_time, duration})
        throw 'Become animation must have a start_time and path defined.'
    }
    return Animate({
        type: 'BECOME',
        path,
        start_state: state,
        end_state: state,
        start_time,
        end_time,
        duration,
        tick: (time_elapsed) => {
            return state
        },
    })
}

export const calculateTheOther = (start, delta, end) => {
    // if (typeof(start) === 'object') {
    //     throw "TODO: find an example of where this is used & clean update"

    //     let keys = Object.keys(start_state)
    //     if (!keys.length) keys = Object.keys(end_state)
    //     if (!keys.length) keys = Object.keys(delta_state)

    //     return keys.reduce((acc, key) => {
    //         const delta_states = checked_animation_delta_state({
    //             start_state: start_state[key],
    //             end_state: end_state[key],
    //             delta_state: delta_state[key]
    //         })
    //         acc.start_state[key] = delta_states.start_state
    //         acc.end_state[key] = delta_states.end_state
    //         acc.delta_state[key] = delta_states.delta_state
    //         return acc
    //     }, {start_state: {}, end_state: {}, delta_state: {}})

    // } else
    if (typeof(start) === 'number'
                && (delta !== undefined || end !== undefined)) {
        // calculate the missing value
        if (end === undefined && delta !== undefined) {
            return [delta, start + delta]
        } else if (end !== undefined && delta === undefined) {
            return [end - start, end]
        }
    }
    if (typeof(start) === 'number'
            && typeof(end) === 'number'
            && typeof(delta) === 'number') {
        if (start + delta !== end) {
            throw `start (${start}) + delta (${delta}) !== end (${end})`
        }
    }
    return [delta, end]
}

const exactlyOneIsUndefined = (val1, val2) => {
    return ((val1 === undefined || val2 === undefined)
            && !(val1 === undefined && val2 === undefined))
}

const isNumber = (val) => {
    return typeof(val) === 'number'
}

const validateAnimation = (animation) => {
    const end_time = animation.end_time
    const end_state = animation.end_state

    const computed_end_state = computeAnimatedState([animation], _end_time)
    if (!isEqual(computed_end_state, end_state)) {
        throw `Invalid Animate: end_state !== computed_end_state for animation:`
            + `\n${JSON.stringify(animation, null, '  ')}:`
            + `${JSON.stringify(computed_end_state, null, '  ')} !==`
            + `${JSON.stringify(end_state, null, '  ')}`
    }
}

export const Animate = ({
        type, path, start_time, end_time, duration, start_state, end_state,
        delta_state, merge=false, curve='linear', unit=null, tick=null,
        error_checking=true}) => {

    let _start_time, _end_time, _duration,
        _end_state, _delta_state, _tick, _split_path, _type

    _start_time = (start_time === undefined) ? Date.now() : start_time

    if (exactlyOneIsUndefined(delta_state, end_state)) {
        [_delta_state,
         _end_state] = calculateTheOther(start_state, delta_state, end_state)
    } else {
        [_delta_state, _end_state] = [delta_state, end_state]
    }
    if (exactlyOneIsUndefined(duration, end_time)) {
        [_duration,
         _end_time] = calculateTheOther(_start_time, duration, end_time)
    } else {
        [_duration, _end_time] = [duration, end_time]
    }

    _type = type ? type : 'ANIMATE'
    _split_path = path.split('/').slice(1)

    let animation = {
        type: _type,
        split_path: _split_path,
        start_time: _start_time,
        end_time: _end_time,
        duration: _duration,
        end_state: _end_state,
        delta_state: _delta_state,

        start_state: start_state,
        path: path,
        curve: curve,
        unit: unit,
        merge: merge,
    }
    _tick = tick || tick_func(animation)
    animation.tick = _tick

    if (error_checking) {
    }

    return immutify(animation)
}

export const AnimateCSS = ({
        name, path, start_time, end_time, duration=1000, curve='linear'}) => {
    if (start_time === undefined) start_time = Date.now()

    if (exactlyOneIsUndefined(duration, end_time)) {
        let [duration,
             end_time] = calculateTheOther(start_time, duration, end_time)
    }
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

    // this is CSS Transform(translate(x, y))

    if (start_time === undefined) start_time = (new Date).getTime()
    if (start_state === undefined) start_state = {top: 0, left: 0}

    start_state.forEach((key) => {
        if (exactlyOneIsUndefined(delta_state[key], end_state[key])) {
            let [delta, end] = calculateTheOther(start_state[key],
                                                 delta_state[key],
                                                 end_state[key])
            delta_state[key] = delta
            end_state[key] = end
        }
    })

    path = `${path}/style/transform/translate`
    const type = 'TRANSLATE'

    const animation = {type, path, start_time, end_time, duration,
                       start_state, end_state, delta_state, curve, unit}

    const left_tick = tick_func({
        duration,
        curve,
        unit,
        start_state: start_state['left'],
        delta_state: delta_state['left'],
    })
    const top_tick = tick_func({
        duration,
        curve,
        unit,
        start_state: start_state['top'],
        delta_state: delta_state['top'],
    })

    animation.tick = (time_elapsed) => ({
        left: left_tick(time_elapsed),
        top: top_tick(time_elapsed),
    })
    return Animate(animation)
}

export const Style = ({
        path, start_time, end_time, duration=1000, start_state, end_state,
        delta_state, curve='linear', unit='px'}) => {
    if (start_time === undefined) start_time = (new Date).getTime()

    if (exactlyOneIsUndefined(duration, end_time)) {
        let [duration,
             end_time] = calculateTheOther(start_time, duration, end_time)
    }

    if (exactlyOneIsUndefined(delta_state, end_state)) {
        let delta_state = delta_state || {}
        let end_state = end_state || {}
        Object.keys(start_state).forEach((key) => {
            let [delta, end] = calculateTheOther(start_state[key],
                                                 delta_state[key],
                                                 end_state[key])
            delta_state[key] = delta
            end_state[key] = end
        })
    }

    return Animate({
        path,
        start_time,
        duration,
        end_time,
        start_state,
        delta_state,
        end_state,
        curve,
        unit,
        merge: true,
    })
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
