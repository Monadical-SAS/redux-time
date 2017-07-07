import {EasingFunctions, mod, range} from './util.js'

const unit_tick = ({start_time, end_time, duration, start_state, end_state, amt, curve='linear', unit=null}, key) => {
    var {start_state, amt, end_state} = checked_animation_amt({start_state, end_state, amt, key})
    var {start_time, end_time, duration} = checked_animation_duration({start_time, end_time, duration})

    const curve_func = EasingFunctions[curve]

    return (delta) => {
        let new_state
        if (delta < 0) {
            new_state = start_state
        } else if (delta >= duration) {
            new_state = end_state
        } else {
            new_state = start_state + curve_func(delta/duration)*amt
        }
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
        throw 'Animation end_time != start_time + duration'
    }
    return {start_time, duration, end_time}
}


const checked_animation_amt = ({key, start_state, end_state, amt}) => {
    if (typeof(start_state) === 'number') {
        if ([start_state, end_state, amt].filter(a => typeof(a) == 'number').length < 2) {
            console.log({start_state, end_state, amt})
            throw 'Need at least 2/3 to calculate animation: start_state, end_state, amt'
        }

        if (start_state === undefined)
            start_state = end_state - amt
        if (end_state === undefined)
            end_state = start_state + amt
        if (amt === undefined)
            amt = end_state - start_state

        if (start_state + amt != end_state) {
            console.log({start_state, end_state, amt})
            throw 'Animation end_state != start + amt'
        }

        return {start_state, end_state, amt}
    } else {
        if (start_state === undefined) start_state = {}
        if (end_state === undefined) end_state = {}
        if (amt === undefined) amt = {}

        if (key !== undefined)
            return checked_animation_amt({start_state: start_state[key], end_state: end_state[key], amt: amt[key]})

        if (typeof(start_state) !== 'object' || typeof(end_state) !== 'object' || typeof(amt) !== 'object') {
            throw 'Incompatible types passed as {start_state, end_state, amt}, must all be dict or numbers'
        }

        let keys = Object.keys(start_state)
        if (!keys.length) keys = Object.keys(end_state)
        if (!keys.length) keys = Object.keys(amt)

        return keys.reduce((acc, key) => {
            const amts = checked_animation_amt({start_state: start_state[key], end_state: end_state[key], amt: amt[key]})
            acc.start_state[key] = amts.start_state
            acc.end_state[key] = amts.end_state
            acc.amt[key] = amts.amt
            return acc
        }, {start_state: {}, end_state: {}, amt: {}})
    }
}

const KeyedAnimation = ({type, path, key, start_time, end_time, duration, start_state, end_state, amt, curve, unit}) => {
    path = `${path}/${key}`
    return Animate({
        type, path, key,
        start_time, end_time, duration,
        start_state: start_state && start_state[key],
        end_state: end_state && end_state[key],
        amt: amt && amt[key],
        curve, unit,
    })
}


export const Become = ({path, state, start_time, end_time=Infinity, duration=Infinity}) => {
    if (start_time === undefined) start_time = (new Date).getTime()

    var {start_time, end_time, duration} = checked_animation_duration({start_time, end_time, duration})
    if (start_time === undefined || path === undefined) {
        console.log({path, state, start_time, end_time, duration})
        throw 'Become animation must have a start_time and path defined.'
    }
    return {
        type: 'BECOME',
        path,
        state,
        start_time,
        end_time,
        duration,
        tick: (delta) => {
            if ((start_time + delta) >= start_time && delta < duration)
                return state
            else
                return undefined
        },
    }
}

export const Animate = ({type, path, start_time, end_time, duration, start_state, end_state, amt, curve='linear', unit=null, tick=null}) => {
    if (start_time === undefined) start_time = (new Date).getTime()

    let animation = {
        type: type ? type : 'ANIMATE',
        path,
        start_time, end_time, duration,
        start_state, end_state, amt,
        curve,
        unit,
        tick,
    }

    if (path === undefined) {
        console.log(animation)
        throw 'Animate animation must have a path defined.'
    }

    try {
        if (typeof(start_state) === 'number' || typeof(end_state) === 'number' || typeof(amt) === 'number') {
            animation = {...animation, ...checked_animation_amt({start_state, end_state, amt})}
        }
        if (typeof(start_time) === 'number' || typeof(end_time) === 'number' || typeof(duration) === 'number') {
            animation = {...animation, ...checked_animation_duration({start_time, end_time, duration})}
        }
        if (!animation.tick) {
            animation.tick = unit_tick(animation)
        }
    } catch(e) {
        console.log('INVALID ANIMATION:', animation)
        throw `Exception while creating animation object ${type}:\n  ${e} ${e.message ? e.message : ''}`
    }

    // console.log(animation.type, animation)
    return animation
}

export const AnimateCSS = ({name, path, start_time, end_time, duration=1000, curve='linear'}) => {
    if (start_time === undefined) start_time = (new Date).getTime()

    var {start_time, end_time, duration} = checked_animation_duration({start_time, end_time, duration})

    const start_state = {name, duration, curve, delay: 0, playState: 'paused'}
    const end_state = {name, duration, curve, delay: duration, playState: 'paused'}

    return Animate({
        type: `CSS_${name ? name.toUpperCase() : 'END'}`,
        path: `${path}/style/animation/${name}`,
        start_time,
        end_time,
        duration,
        curve,
        start_state,
        end_state,
        amt: {delay: duration},
        tick: (delta) => {
            if (delta <= 0) {
                return start_state
            }
            else if (delta >= duration) {
                return end_state
            }
            else {
                return {name, duration, curve, delay: delta, playState: 'paused'}
            }
        },
    })
}

export const Translate = ({path, start_time, end_time, duration=1000, start_state, end_state, amt, curve='linear', unit='px'}) => {
    if (start_time === undefined) start_time = (new Date).getTime()
    if (start_state === undefined) start_state = {top: 0, left: 0}
    path = `${path}/style/transform/translate`
    const type = 'TRANSLATE'

    const animation = {type, path, start_time, end_time, duration, start_state, end_state, amt, curve, unit}

    const left_tick = unit_tick(animation, 'left', 0)  //  TODO: change left => /left to keep state selectors consistent
    const top_tick =  unit_tick(animation, 'top', 0)

    animation.tick = (delta) => ({
        left: left_tick(delta),
        top: top_tick(delta),
    })
    return Animate(animation)
}

export const TranslateTo = ({path, start_time, end_time, duration=1000, start_state, end_state, amt, curve='linear', unit='px'}) => {
    path = `${path}/style`
    const anims = []
    if (start_state.left || end_state.left || amt.left) {
        anims.push(KeyedAnimation({
            type: 'TRANSLATE_TO_LEFT',
            path,
            key: 'left',
            start_time, end_time, duration,
            start_state, end_state, amt,
            curve, unit,
        }))
    }
    if (start_state.top || end_state.top || amt.top) {
        anims.push(KeyedAnimation({
            type: 'TRANSLATE_TO_TOP',
            path,
            key: 'top',
            start_time, end_time, duration,
            start_state, end_state, amt,
            curve, unit,
        }))
    }
    return anims
}

export const Opacity = ({path, start_time, end_time, duration, start_state, end_state, amt, curve='linear', unit=null}) => {
    path = `${path}/style/opacity`
    const type = 'OPACITY'
    return Animate({type, path, start_time, end_time, duration, start_state, end_state, amt, curve, unit})
}

export const Rotate = ({path, start_time, end_time, duration, start_state, end_state, amt, curve='linear', unit='deg'}) => {
    path = `${path}/style/transform/rotate`
    const type = 'ROTATE'
    return Animate({type, path, start_time, end_time, duration, start_state, end_state, amt, curve, unit})
}

// repeat a single animation (which may be composed of several objects)
export const Repeat = (animations, repeat=Infinity) => {
    if (!Array.isArray(animations)) {
        animations = [animations]
    }
    return animations.map(anim => {
        let {tick, start_time, duration} = anim
        if (start_time === undefined) start_time = (new Date).getTime()
        const repeated_tick = (delta) => tick(mod(delta, duration))
        return {
            ...anim,
            repeat,
            duration: duration * repeat,
            end_time: start_time + duration*repeat,
            tick: repeated_tick,
        }
    })
}

// make each animation in a sequence start after the last one ends
export const Sequential = (animations, start_time) => {
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
    return seq
}

// repeat a sequential list of animations
export const RepeatSequence = (animations, repeat, start_time) => {
    if (!Array.isArray(animations)) animations = [animations]
    const repeated = range(repeat).reduce((acc, val) => {
        return acc = [...acc, ...animations]
    }, [])
    return Sequential(repeated, start_time)
}
