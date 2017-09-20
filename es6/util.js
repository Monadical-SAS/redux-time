import extend from 'extend'
import isEqual from 'lodash.isequal'

export const immutify = (obj) =>
    Object.keys(obj).reduce((new_obj, key) => {
        const val = obj[key]
        if (typeof(val) === 'function') {
            val.inspect = val.toString
        }
        Object.defineProperty(new_obj, key, {
            enumerable: true,
            configurable: false,
            writable: false,
            value: val,
        })
        return new_obj
    }, {})

export const print = (msg) => {
    process ? process.stdout.write(msg) : console.log(msg)
}

export const assert = (val, error_msg='') => {
    if (!val) {
        const call_stack = (new Error).stack
        print(`[X] AssertionError: ${error_msg} (${val})`)
        print(call_stack)
        process.exit(1)
    } else {
        process ? process.stdout.write('.') : console.log('.')
    }
}

export const assertThrows = (func) => {
    try {
        func()
        assert(false, `${func.toString()} should have thrown an error`)
    } catch (err) {
        assert(true)
    }
}

export const assertEqual = (val1, val2) => {
    assert(
        isEqual(val1, val2),
        `${JSON.stringify(val1)} !== ${JSON.stringify(val2)}`
    )
}

export const findMissingKey = (obj1, obj2, both_ways=true) => {
    for (let key of Object.keys(obj1)) {
        if (!Object.keys(obj2).includes(key)) {
            return key
        }
    }
    if (both_ways) {
        for (let key of Object.keys(obj2)) {
            if (!Object.keys(obj1).includes(key)) {
                return key
            }
        }
    }
    return null
}

export const assertSortedObjsInOrder = (arr, sort_function, expected_order) => {
    const arr_with_keys = arr.map((obj, idx)=> {
        return {
            ...obj,
            idx: idx
        }
    })
    const sorted_objs = sort_function(arr_with_keys)
    const sorted_order = sorted_objs.map((obj) => obj.idx)
    expected_order.forEach((expected_idx, idx) => {
        assertEqual(expected_idx, sorted_order[idx])
    })
}

export const checkIsValidAnimation = (animation) => {
    if (Array.isArray(animation)) {
        console.log('%cINVALID ANIMATION:', 'color:red', animation)
        console.log('Got an array instead of a single animation object, did you double-nest somthing by forgetting to use ...?')
        throw 'Animation must be passed in as a single Animation object!'
    }
    if (!(animation.type && animation.path)) {
        console.log('%cINVALID ANIMATION:', 'color:red', animation)
        console.log('Got unrecognized animation object missing a type or path.')
        throw 'Animation must be passed in as a single Animation object!'
    }
}

export const checkIsValidSequence = (animations) => {
    if (!Array.isArray(animations)) {
        console.log('%cINVALID ANIMATION:', 'color:red', animations)
        console.log('Got something other than an array.')
        throw 'Sequence must be passed in as an array of Animation objects!'
    }
    if (animations.length && Array.isArray(animations[0])) {
        console.log('%cINVALID ANIMATION:', 'color:red', animations)
        console.log('Got double-nested animation array instead of just an array of objects.')
        throw 'Sequence must be passed in as an array of Animation objects!'
    }
    for (let animation of animations) {
        checkIsValidAnimation(animation)
    }
    return true
}

export const EasingFunctions = {
    // no easing, no acceleration
    linear: (t) => (t),
    // accelerating from zero velocity
    easeInQuad: (t) => (t*t),
    // decelerating to zero velocity
    easeOutQuad: (t) => (t*(2-t)),
    // acceleration until halfway, then deceleration
    easeInOutQuad: (t) => (t<.5 ? 2*t*t : -1+(4-2*t)*t),
    // accelerating from zero velocity
    easeInCubic: (t) => (t*t*t),
    // decelerating to zero velocity
    easeOutCubic: (t) => ((--t)*t*t+1),
    // acceleration until halfway, then deceleration
    easeInOutCubic: (t) => (t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1),
    // accelerating from zero velocity
    easeInQuart: (t) => (t*t*t*t),
    // decelerating to zero velocity
    easeOutQuart: (t) => (1-(--t)*t*t*t),
    // acceleration until halfway, then deceleration
    easeInOutQuart: (t) => (t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t),
    // accelerating from zero velocity
    easeInQuint: (t) => (t*t*t*t*t),
    // decelerating to zero velocity
    easeOutQuint: (t) => (1+(--t)*t*t*t*t),
    // acceleration until halfway, then deceleration
    easeInOutQuint: (t) => (t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t),
}

export const mod = (num, delta_state) => ((num%delta_state)+delta_state)%delta_state

export const range = (num) => [...Array(num).keys()]

export const deepCopy = (obj) => extend(true, {}, obj)  // TODO: remove jquery

export const flipObj = (obj) =>
    Object.keys(obj).reduce((acc, key) => {
        const val = obj[key]
        acc[val] = key
        return acc
    }, {})

// equivalent to {key: func(key, val) for key, val in obj.items()}
export const mapObj = (obj, func) => {
    return Object.keys(obj).reduce((acc, key) => {
        acc[key] = func(key, obj[key])
        return acc
    }, {})
}

export function *reversed(iterator) {
    for (let idx=iterator.length-1; idx >= 0; idx--) {
        yield iterator[idx]
    }
}

export const flattened = (array) => [].concat.apply([], array)

export const setIntersection = (set1, set2) => [...set1].filter(x => set2.has(x))
export const setDifference = (set1, set2) => [...set1].filter(x => !set2.has(x))

const base_types = ['string', 'number', 'boolean', 'symbol', 'function']
export function isBaseType(item, array_is_basetype=true) {
    // false if item is a dict, true for everything else
    if (item === null || item === undefined) {
        return true
    } else if (base_types.indexOf(typeof(item)) != -1) {
        return true
    } else if (array_is_basetype && Array.isArray(item)) {
        return true
    }
    return false
}

export function deepMerge(obj1, obj2, merge_vals=true) {
    if (isBaseType(obj1) || isBaseType(obj2)) {
        return obj2
    } else {
        const obj1_keys = new Set(Object.keys(obj1))
        const obj2_keys = new Set(Object.keys(obj2))
        const both_keys = setIntersection(obj1_keys, obj2_keys)
        const only_obj1 = setDifference(obj1_keys, obj2_keys)
        const only_obj2 = setDifference(obj2_keys, obj1_keys)

        const new_obj = {}

        // merge any values that are in both dicts
        if (merge_vals) {
            both_keys.reduce((new_obj, key) => {
                new_obj[key] = deepMerge(obj1[key], obj2[key])
                return new_obj
            }, new_obj)
        }

        // add values only in obj1
        only_obj1.reduce((new_obj, key) => {
            new_obj[key] = obj1[key]
            return new_obj
        }, new_obj)

        // add values only in obj2
        only_obj2.reduce((new_obj, key) => {
            new_obj[key] = obj2[key]
            return new_obj
        }, new_obj)

        return new_obj
    }
}

// uniformly populates a tree of size (branching_factor, depth)
//  used in benchmarks. see unit tests for examples
export const nested_key = (i, bf, d, l=null) => {
    // populates a tree uniformly. see tests below for examples
    if (l === 0) {
        return ''
    } else if (!l) {
        const cropped_i = i % bf ** d
        return nested_key(cropped_i, bf, d, d)
    } else {
        return `${nested_key(Math.floor(i / bf), bf, d, l - 1)}/${i}`
    }
}

export function select(obj, selector) {
    // ({a: {b: 2}}, '/a/b') => 2                   Get obj at specified addr (works with array indicies)
    let keys
    if (typeof(selector) === 'string') {
        if (selector === '/') return obj
        if (selector[0] !== '/') throw `Invalid selector! ${selector}`
        keys = selector.split('/').slice(1)
    } else if (Array.isArray(selector)) {
        keys = selector
    } else {
        throw `Invalid selector, must be string /path or array of keys! ${selector}`
    }
    for (let key of keys) {
        obj = obj[key]
    }
    return obj
}

export function patch(obj, selector, new_val, merge=false, mkpath=false, deepcopy=true) {
    // ({a: {b: 2}}, '/a/b', 4) => {a: {b: 4}}      Set obj at specified addr (works with array indicies)
    let keys
    if (typeof(selector) === 'string') {
        if (selector === '/') return new_val
        if (!selector || selector[0] !== '/') throw `Invalid selector! ${selector}`
        keys = selector.split('/').slice(1)
    } else if (Array.isArray(selector)) {
        keys = [...selector]
    } else {
        throw `Invalid selector, must be string /path or array of keys! ${selector}`
    }
    const last_key = keys.pop()
    if (last_key == '') {
        console.log({obj, selector, new_val, merge, mkpath})
        throw 'Patch paths must not have trailing slashes or empty keys!'
    }
    let parent = obj
    for (let key of keys) {
        // create path if any point is missing
        if ((mkpath && (parent[key] === undefined || parent[key] === null)) || isBaseType(parent[key], false)) {
            parent[key] = {}
        }
        parent = parent[key]
    }
    if (merge) {
        parent[last_key] = deepMerge(parent[last_key], new_val)
    } else {
        parent[last_key] = new_val
    }
    return deepcopy ? extend(true, {}, obj) : obj
}


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

const flattenTransform = (transform) => {
    // WARNING: optimized code, do not convert to map() without profiling
    // flatten transforms from a dict to a string
    // converts {style: {transform: {translate: {left: '0px', top: '10px'}, rotate: '10deg'}}}
    //      =>  {style: {transform: 'translate(0px, 10px) rotate(10deg)'}}

    let css_transform_funcs = []
    for (let key of Object.keys(transform)) {
        if (transform[key] === null) continue
        const order = transform[key].order
        if (typeof(order) === 'number') {
            // deterministic ordering via order: key
            css_transform_funcs[order] = css_transform_str[key](transform[key])
        } else {
            css_transform_funcs.push(css_transform_str[key](transform[key]))
        }
    }

    return css_transform_funcs.filter(Boolean).join(' ')
}

const flattenAnimation = (animation) => {
    // WARNING: optimized code, do not convert to map() without profiling
    // flatten animations from a dict to a string
    // converts {style: {animations: {blinker: {name: blinker, duration: 1000, curve: 'linear', delay: 767}, ...}}}
    //      =>  {style: {animation: blinker 1000ms linear -767ms paused, ...}}

    let css_animation_funcs = []
    for (let key of Object.keys(animation)) {
        if (animation[key] === null) continue
        const order = animation[key].order
        if (typeof(order) === 'number') {
            // deterministic ordering via order: key
            css_animation_funcs[order] = css_animation_str(animation[key])
        } else {
            css_animation_funcs.push(css_animation_str(animation[key]))
        }

    }

    return css_animation_funcs.filter(Boolean).join(', ')
}

const flattenIfNotFlattened = (state, path, flatten_func) => {
    const state_slice = select(state, path)
    if (!state_slice) {
        // State no longer exists because it was overwritten by a later patch
        return
    }
    if (typeof(state_slice) !== 'string') {
        patch(state, path, flatten_func(state_slice), false, false, false)
    }
}

export const flattenStyles = (state, paths_to_flatten) => {
    // WARNING: optimized code, profile before changing anything
    // this converts the styles stored as dicts in the state tree, to the strings
    // that react components expect as CSS style values
    for (let path of paths_to_flatten) {
        const transform_idx = path.lastIndexOf('transform')
        if (transform_idx != -1) {
            const path_to_transform = path.slice(0, transform_idx + 1)
            flattenIfNotFlattened(state, path_to_transform, flattenTransform)
            continue
        }
        const animation_idx = path.lastIndexOf('animation')
        if (animation_idx != -1) {
            const path_to_animation = path.slice(0, animation_idx + 1)
            flattenIfNotFlattened(state, path_to_animation, flattenAnimation)
            continue
        }
    }

    return state
}

const shouldFlatten = (split_path) => {
    // WARNING: optimized code, profile before changing anything
    //  check to see if a given path introduces some CSS state that needs
    //  to be converted from an object to a css string, e.g.
    //  {style: transform: translate: {top: 0, left: 0}}
    const style_key = split_path.lastIndexOf('style')
    return (style_key != -1
            && (split_path[style_key + 1] == 'transform'
                || split_path[style_key + 1] == 'animation'))
}

export function applyPatches(obj, patches, flatten_styles=true) {
    // WARNING: optimized code, profile before changing anything
    const output = {}
    const paths_to_flatten = []

    // O(n) application of patches onto a single object
    for (let patch of patches) {
        // deepcopy to prevent later patches from mutating previous object values
        let patch_val = patch.value
        if (patch_val !== null && typeof(patch_val) === 'object') {
            // unfortunately this is not very optimizable since dont know
            // the structure beforehand. Do not use JSON.stringify+parse because
            // Date, function, and Infinity objects dont get safely converted.
            // jQuery is significantly faster than lodash cloneDeep
            patch_val = extend(true, {}, patch_val)
        }
        const keys = [...patch.split_path]

        if (flatten_styles && shouldFlatten(keys)) paths_to_flatten.push(keys)

        const final_key = keys.pop()
        // get to the end of the list of paths
        let parent = output
        for (let key of keys) {
            if (parent[key] === undefined || parent[key] === null || isBaseType(parent[key], false)) {
                parent[key] = {}
            }
            parent = parent[key]
        }
        parent[final_key] = patch_val
    }
    if (flatten_styles)
        return flattenStyles(output, paths_to_flatten)
    return output
}


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
                && (anim.end_time <= warped_time)
        } else {
        // traveling backward in time
            return (warped_time <= anim.start_time)
                && (anim.start_time <= former_time)
        }
    }

    return anim_queue.filter((anim) => is_between(anim))
}


export const pastAnimations = ({anim_queue, warped_time}) => {
    return anim_queue.filter(({start_time, duration}) =>
        (start_time + duration < warped_time))
}

export const futureAnimations = ({anim_queue, warped_time}) => {
    return anim_queue.filter(({start_time, duration}) => (start_time > warped_time))
}


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

const patchesFromAnimation = (animation, warped_time) => {
    // console.log('patchesFromAnimation')
    // console.log({animation, warped_time})
    const patches = []
    const delta = warped_time - animation.start_time
    if (animation.merge) {
        const values = animation.tick(delta)
        Object.keys(animation.start_state).forEach((key) => {
            patches.push({
                split_path: [...animation.split_path, key],
                value: values[key],
            })
        })
    } else {
        patches.push({
            split_path: animation.split_path,
            value: animation.tick(delta),
        })
    }
    return patches
}

export const computeAnimatedState = ({
        animations, warped_time, former_time=null}) => {
    former_time = former_time === null ? warped_time : former_time

    const active_animations = activeAnimations({anim_queue: animations,
                                                warped_time,
                                                former_time,
                                                uniqueify: false})
    let patches = []
    // console.log({active_animations})
    for (let animation of active_animations) {
        try {
            patches = [...patches, ...patchesFromAnimation(animation, warped_time)]
        } catch(e) {
            console.log(animation.type, 'Animation tick function threw an exception:', e.stack, animation)
        }
    }
    return applyPatches({}, patches)
}
