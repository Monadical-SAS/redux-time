import {
    mod,
    range,
    flattened,
    checkIsValidAnimation,
    checkIsValidSequence,
    EasingFunctions,
    immutify,
    computeAnimatedState,
    mapObj,
} from './util.js'

import isEqual from 'lodash.isequal'

const fmtWithUnit = (val, unit) => {
    return unit ? `${val}${unit}` : val
}

const tick_func = ({duration, start_state, delta_state, end_state,
                    curve='linear', unit=null}) => {

    const curve_func = EasingFunctions[curve]

    return (time_elapsed) => {
        if (time_elapsed < 0) {
            return start_state
        }
        if (time_elapsed > duration) {
            return end_state
        }
        const curve_value = curve_func(time_elapsed/duration)
        const new_state = start_state + curve_value * delta_state

        return fmtWithUnit(new_state, unit)
    }
}

export const Become = ({path, state, start_time, end_time, duration}) => {
    if (start_time === undefined) start_time = Date.now()

    if (end_time === undefined && duration === undefined) {
        duration = Infinity
        end_time = Infinity
    }

    if (end_time !== Infinity || duration !== Infinity) {
        if (exactlyOneIsUndefined(duration, end_time)) {
            [duration, end_time] = computeTheOther(start_time, duration, end_time)
        } else {
            // console.log({path, state, start_time, end_time, duration})
            throw 'Invalid call to Become: you may define end_time or duration, but not both.'
        }
    }

    return Animate({
        type: 'BECOME',
        path,
        start_state: state,
        delta_state: null,
        end_state: null,
        start_time,
        end_time,
        duration,
        tick: (_) => {
            return state
        },
    })
}

export const computeTheOther = (start, delta, end) => {
    // assumes start and one of (delta, end) are defined.
    // error checking is done before this point is reached

    // console.log({start, delta, end})
    if (typeof(start) === 'object') {
        let new_delta = delta ? {...delta} : {}
        let new_end = end ? {...end} : {}
        if (delta === undefined) {
            Object.keys(start).forEach((key) => {
                let [_delta, _end] = computeTheOther(start[key],
                                                     new_delta[key],
                                                     new_end[key])
                new_delta[key] = _delta
                new_end[key] = _end
            })
        } else {
            const delta_keys = Object.keys(delta)
            Object.keys(start).forEach((key) => {
                if (delta_keys.includes(key)) {
                    let [_delta, _end] = computeTheOther(start[key],
                                                         new_delta[key],
                                                         new_end[key])
                    new_delta[key] = _delta
                    new_end[key] = _end
                } else {
                    new_end[key] = start[key]
                }
            })
        }
        return [new_delta, new_end]
    }
    if (typeof(start) === 'number') {
        if (end === undefined && delta !== undefined) {
            return [delta, start + delta]
        } else if (end !== undefined && delta === undefined) {
            return [end - start, end]
        } else {
            throw `computeTheOther was expecting one of (delta, end) to be defined, but not both`
        }
    }
    throw `computeTheOther got (${start}, ${delta}, ${end}) as args and didn't know what to do`
}

const exactlyOneIsUndefined = (val1, val2) => {
    return ((val1 === undefined || val2 === undefined)
            && !(val1 === undefined && val2 === undefined))
}

const isNumber = (val) => {
    return typeof(val) === 'number'
}

const applyDefaultsAndValidateTimes = (start_time, duration, end_time) => {
    if (start_time === undefined) start_time = Date.now()

    if (duration === undefined && end_time === undefined) {
        duration = 1000; // removing this semi-colon results in a gnarly parse error
        [duration, end_time] = computeTheOther(start_time, duration, end_time)
    } else if (exactlyOneIsUndefined(duration, end_time)) {
        [duration, end_time] = computeTheOther(start_time, duration, end_time)
    } else {
        throw 'only one of (duration, end_time) should be passed in, not both.'
    }

    if (start_time > end_time) {
        throw `start_time (${start_time}) > end_time (${end_time})`
    }
    return [start_time, duration, end_time]
}


const validateAnimation = (animation) => {
    const end_time = animation.end_time
    const end_state = animation.end_state

    const computed_end_state = computeAnimatedState({
        animations:[animation],
        warped_time:_end_time
    })
    if (!isEqual(computed_end_state, end_state)) {
        throw `Invalid Animate: end_state !== computed_end_state for animation:`
            + `\n${JSON.stringify(animation, null, '  ')}:`
            + `${JSON.stringify(computed_end_state, null, '  ')} !==`
            + `${JSON.stringify(end_state, null, '  ')}`
    }
}

export const Animate = ({
        type, path, start_time, end_time, duration, start_state, end_state,
        delta_state, merge=false, curve='linear', unit=null, tick=null}) => {

    const throw_msg = (msg) => `Invalid call to Animate w/path ${path}: ${msg}`

    let _start_time, _end_time, _duration,
        _end_state, _delta_state, _tick, _split_path, _type

    _start_time = (start_time === undefined) ? Date.now() : start_time
    if (exactlyOneIsUndefined(duration, end_time)) {
        [_duration, _end_time] = computeTheOther(_start_time, duration, end_time)
    } else {
        [_duration, _end_time] = [duration, end_time]
    }

    if (exactlyOneIsUndefined(delta_state, end_state)) {
        [_delta_state, _end_state] = computeTheOther(start_state, delta_state, end_state)
    } else {
        [_delta_state, _end_state] = [delta_state, end_state]
    }

    if (_start_time > _end_time) {
        throw throw_msg(`start_time (${start_time}) > end_time (${end_time}).`)
    }

    _split_path = path.split('/').slice(1)

    if (_split_path.slice(-1) == '') {
        throw throw_msg('path has a trailing slash')
    }

    let animation = {
        type: type || 'ANIMATE',
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

    return immutify(animation)
}

export const Style = ({
        path, start_time, end_time, duration, start_state, end_state,
        delta_state, curve='linear', unit='px'}) => {

    try {
        [start_time,
         duration,
         end_time] = applyDefaultsAndValidateTimes(start_time, duration, end_time)

        if (typeof(start_state) !== 'object') {
            throw `expected an object for start_state but got ${start_state}`
        }
        if (exactlyOneIsUndefined(delta_state, end_state)) {
            if (typeof(delta_state) === 'object'){
                Object.keys(delta_state).forEach((key) => {
                    if (!Object.keys(start_state).includes(key)) {
                        throw `found key ${key} in delta_state but not start_state`
                    }
                })
            } else if (typeof(end_state) === 'object') {
                Object.keys(end_state).forEach((key) => {
                    if (!Object.keys(start_state).includes(key)) {
                        throw `found key ${key} in end_state but not start_state`
                    }
                })
                Object.keys(start_state).forEach((key) => {
                    if (!Object.keys(end_state).includes(key)) {
                        throw `found key ${key} in start_state but not end_state`
                    }
                })
            } else {
                let msg = `expected one of (delta_state, end_state) as object, `
                        + `but got (${delta_state}, ${end_state})`
                throw msg
            }
            [delta_state, end_state] = computeTheOther(start_state, delta_state, end_state)
        } else {
            let msg = `expected one of (delta_state, end_state) as object, `
                    + `but got (${delta_state}, ${end_state})`
            throw msg
        }

    } catch (err) {
        throw `Invalid call to Style w/path '${path}': ${err}`
    }


    const tick_funcs = mapObj(delta_state, (key) => {
        return tick_func({
            duration,
            start_state: start_state[key],
            delta_state: delta_state[key],
            end_state: end_state[key],
            curve,
            unit
        })
    })
    const delta_keys = Object.keys(delta_state)
    const tick = (time_elapsed) => {
        return mapObj(start_state, (key) => {
            if (delta_keys.includes(key)) {
                return tick_funcs[key](time_elapsed)
            }
            return start_state[key]
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
        tick,
        merge: true,
    })
}

export const AnimateCSS = ({
        name, path, start_time, end_time, duration, curve='linear'}) => {

    try {
        [start_time,
         duration,
         end_time] = applyDefaultsAndValidateTimes(start_time, duration, end_time)
    } catch (err) {
        throw `Invalid call to AnimateCSS w/path '${path}': ${err}`
    }

    const start_state = {
        name,
        duration,
        curve,
        delay: 0,
        playState: 'paused'
    }
    const end_state = {
        ...start_state,
        delay: duration,
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
        path, start_time, end_time, duration, start_state, end_state,
        delta_state, curve='linear', unit='px'}) => {

    try {
        [start_time,
         duration,
         end_time] = applyDefaultsAndValidateTimes(start_time, duration, end_time)
    } catch (err) {
        throw `Invalid call to Translate w/path '${path}': ${err}`
    }

    // this is CSS Transform(translate(x, y))
    if (start_state === undefined) start_state = {top: 0, left: 0}

    if (exactlyOneIsUndefined(delta_state, end_state)) {
        [delta_state, end_state] = computeTheOther(start_state, delta_state, end_state)
    }

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
        end_state: end_state['left']
    })
    const top_tick = tick_func({
        duration,
        curve,
        unit,
        start_state: start_state['top'],
        delta_state: delta_state['top'],
        end_state: end_state['top']
    })

    animation.tick = (time_elapsed) => ({
        left: left_tick(time_elapsed),
        top: top_tick(time_elapsed),
    })
    return Animate(animation)
}

export const Opacity = ({
        path, start_time, end_time, duration, start_state, end_state, delta_state,
        curve='linear', unit=null}) =>{
    try {
        [start_time,
         duration,
         end_time] = applyDefaultsAndValidateTimes(start_time, duration, end_time)
    } catch (err) {
        throw `Invalid call to AnimateCSS w/path '${path}': ${err}`
    }

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
}

export const Rotate = ({
        path, start_time, end_time, duration, start_state, end_state, delta_state,
        curve='linear', unit='deg'}) => {
    try {
        [start_time,
         duration,
         end_time] = applyDefaultsAndValidateTimes(start_time, duration, end_time)
    } catch (err) {
        throw `Invalid call to AnimateCSS w/path '${path}': ${err}`
    }

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
}

// repeat a single animation (which may be composed of several objects)
export const Repeat = (animation, repeat=Infinity) => {
    checkIsValidAnimation(animation)
    let {tick, start_time, duration} = animation
    if (start_time === undefined) start_time = Date.now()
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
    if (start_time === undefined) start_time = Date.now()
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
    if (start_time === undefined) start_time = Date.now()
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
