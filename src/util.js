export const checkIsValidAnimation = (animation) => {
    if (!Array.isArray(animation)) {
        console.log('%cINVALID ANIMATION:', 'color:red', animation)
        console.log('Got something other than an array.')
        throw 'Animation must be passed in as an array of Animation objects!'
    }
    if (animation.length && Array.isArray(animation[0])) {
        console.log('%cINVALID ANIMATION:', 'color:red', animation)
        console.log('Got double-nested animation array instead of just an array of objects.')
        throw 'Animation must be passed in as an array of Animation objects!'
    }
    if (animation.length && !animation[0].path) {
        console.log('%cINVALID ANIMATION :', 'color:red', animation)
        console.log('Animations object is missing a path, is it a real animation?')
        throw 'Animation must be passed in as an array of Animation objects!'
    }
}

export const checkIsValidSequence = (animations) => {
    if (!Array.isArray(animations)) {
        console.log('%cINVALID ANIMATION SEQUENCE:', 'color:red', animations)
        console.log('Got something other than an array.')
        throw 'Animation sequence must be passed in as an array of Animation object arrays!'
    }
    if (animations.length && !Array.isArray(animations[0])) {
        console.log('%cINVALID ANIMATION SEQUENCE:', 'color:red', animations)
        console.log('Got an array of objects instead of an array of arrays.')
        throw 'Animation sequence must be passed in as an array of Animation object arrays!'
    }
    if (animations.length && animations[0].length && Array.isArray(animations[0][0])) {
        console.log('%cINVALID ANIMATION SEQUENCE:', 'color:red', animations)
        console.log('Got triple-nested animations array instead of double-nested.')
        throw 'Animation sequence must be passed in as an array of Animation object arrays!'
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

export const mod = (num, amt) => ((num%amt)+amt)%amt

export const range = (num) => [...Array(num).keys()]

export const deepCopy = (obj) => {
    return $.extend(true, {}, obj)  // TODO: remove jquery
}

export const flipObj = (obj) =>
    Object.keys(obj).reduce((acc, key) => {
        const val = obj[key]
        acc[val] = key
        return acc
    }, {})

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

export function select(obj, selector) {
    // ({a: {b: 2}}, '/a/b') => 2                   Get obj at specified addr (works with array indicies)
    if (selector === '/') return obj
    if (selector[0] !== '/') throw `Invalid selector! ${selector}`
    for (let key of selector.split('/').slice(1)) {
        obj = obj[key]
    }
    return obj
}

export function patch(obj, selector, new_val, merge=false, mkpath=false, deepcopy=true) {
    // ({a: {b: 2}}, '/a/b', 4) => {a: {b: 4}}      Set obj at specified addr (works with array indicies)
    if (selector === '/') return new_val
    if (!selector || selector[0] !== '/') throw `Invalid selector! ${selector}`
    const keys = selector.split('/').slice(1)
    const last_key = keys.pop()
    if (last_key == '') {
        console.log({obj, selector, new_val, merge, mkpath})
        throw 'Patch paths must not have trailing slashes!'
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
    return deepcopy ? $.extend(true, {}, obj) : obj
}


export function applyPatches(obj, patches) {
    let output = {}
    // debugger
    for (let patch of patches) {
        if (patch.path[0] !== '/') throw `Invalid path found! ${patch.path}`

        // deepcopy to prevent later patches from mutating previous object values
        let patch_val = patch.value
        if (patch_val !== null && typeof(patch_val) === 'object') {
            patch_val = $.extend(true, {}, patch_val)
        }

        const keys = patch.path.split('/').slice(1)
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
    return output
}
