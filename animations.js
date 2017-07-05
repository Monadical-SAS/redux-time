import {EasingFunctions} from './util.js'


export const getCenter = ({width, height, top=0, left=0}) => ({
    left: left + width / 2,
    top:  top + height / 2,
})

export const queryAll = (selector) =>
    document.querySelectorAll(selector)


export const getDimensions = (elem) => {
    if (typeof(elem) === 'string') {
        elem = queryAll(elem)[0]
    } else if (elem.jquery) {
        elem = elem[0]
    }
    if (!elem) {
        debugger
    }
    if (!elem.getBoundingClientRect) {
        throw `Invalid Element: You must pass a DOM element, css selector, or jQuery element: ${elem}`
    }
    return elem.getBoundingClientRect()
}

export const getElementOffset = (elem) => {
    const {top, left} = getDimensions(elem)
    return {top, left}
}

export const getElementSize = (elem) => {
    const {width, height} = getDimensions(elem)
    return {width, height}
}

export const getElementCenter = (elem) => {
    const {top, left, width, height} = getDimensions(elem)
    return getCenter({top, left, width, height})
}


const mod = (num, amt) => ((num%amt)+amt)%amt


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
    if ([start_time, end_time, duration].filter(a => typeof(a) !== 'number').length > 1) {
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
        if ([start_state, end_state, amt].filter(a => typeof(a) !== 'number').length > 1) {
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
            console.log({start_state, end_state, amt})
            throw 'Incompatible types passed as {start_state, end_state, and amt}, must all be dict or numbers'
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


export const Become = ({path, state, start_time=null, end_time=Infinity, duration=Infinity}) => {
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
        if (start_state || end_state || amt) {
            animation = {...animation, ...checked_animation_amt({start_state, end_state, amt})}
        }
        if (start_time || end_time || duration) {
            animation = {...animation, ...checked_animation_duration({start_time, end_time, duration})}
        }
        if (!animation.tick) {
            animation.tick = unit_tick(animation)
        }
    } catch(e) {
        console.log('INVALID ANIMATION:', animation)
        throw `Exception while creating animation object ${type}: ${e.message}`
    }

    // console.log(animation.type, animation)
    return animation
}

export const AnimateCSS = ({name, path, start_time, end_time, duration=1000, curve='linear'}) => {
    var {start_time, end_time, duration} = checked_animation_duration({start_time, end_time, duration})

    if (name === null) {
        // stop any currently running animations
        return [
            Become({path: `${path}/style/animation`, state: null, start_time, end_time, duration}),
            Become({path: `${path}/style/animationPlayState`, state: null, start_time, end_time, duration}),
            Become({path: `${path}/style/animationDelay`, state: '-0ms', start_time, end_time, duration}),   // -0ms instead of null, otherwise animation stops at current frame instead of resetting
        ]
    }

    const css_str = `${name} ${duration}ms ${curve}`  // ${repeat === Infinity ? 'infinite' : repeat}

    return [
        Become({path: `${path}/style/animation`,          state: css_str,  start_time, end_time, duration}),
        Become({path: `${path}/style/animationPlayState`, state: 'paused', start_time, end_time, duration}),
        Animate({
            type: `CSS_${name ? name.toUpperCase() : 'END'}`,
            path: `${path}/style/animationDelay`,
            start_time,
            end_time,
            duration,
            curve,
            amt: {},
            tick: (delta) => {
                if (delta <= 0) {
                    return '-0ms'
                }
                else if (delta >= duration) {
                    return `-${duration}ms`
                }
                else {
                    return `-${delta}ms`
                }
            },
        }),
    ]
}


export const Translate = ({path, start_time, end_time, duration=1000, start_state, end_state, amt, curve='linear', unit='px'}) => {
    path = `${path}/style/transform/translate`
    const type = 'TRANSLATE'

    const animation = {type, path, start_time, end_time, duration, start_state, end_state, amt, curve, unit}

    const left_tick = unit_tick(animation, 'left')  //  TODO: change left => /left to keep state selectors consistent
    const top_tick =  unit_tick(animation, 'top')

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

export const Repeat = (animation, repeat=Infinity) => {
    if (!Array.isArray(animation)) {
        animation = [animation]
    }
    return animation.map(anim => {
        const {tick, start_time, duration} = anim
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
