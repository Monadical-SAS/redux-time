import {assert, assertEqual, print, assertSortedObjsInOrder,
        nested_key, assertThrows, immutify, activeAnimations,
        uniqueAnimations, currentAnimations, finalFrameAnimations,
        computeAnimatedState} from './util.js'

import {Become, Animate, Style, Translate, AnimateCSS, Opacity, Rotate,
        computeTheOther, RepeatSequence} from './animations.js'

export const run_unit_tests = () => {

assertEqual(nested_key(0, 2, 2), '/0/0')
assertEqual(nested_key(1, 2, 2), '/0/1')
assertEqual(nested_key(2, 2, 2), '/1/2')
assertEqual(nested_key(3, 2, 2), '/1/3')
assertEqual(nested_key(4, 2, 2), '/0/0')

assertEqual(nested_key(15, 2, 1), '/1')
assertEqual(nested_key(15, 2, 2), '/1/3')
assertEqual(nested_key(15, 2, 3), '/1/3/7')
assertEqual(nested_key(15, 2, 4), '/1/3/7/15')
assertEqual(nested_key(15, 2, 5), '/0/1/3/7/15')
assertEqual(nested_key(15, 2, 6), '/0/0/1/3/7/15')

assertEqual(nested_key(15, 3, 3), '/1/5/15')

///////////////
// Util tests
const sort = (x) => x

assertSortedObjsInOrder([{0:0}, {1:1}, {2:2}], sort, [0,1,2])

const sort2 = (x) => {
    let output = [...x]
    output.reverse()
    return output
}
assertSortedObjsInOrder([{0:0}, {1:1}, {2:2}], sort2, [2,1,0])


const animation_queue = [
    Become({
        path: '/danny_devito',
        state: 0,
        start_time: 0,
    }),
    Animate({
        path: '/danny_devito',
        start_state: 1,
        end_state: 1,
        start_time: 50,
        end_time:  60,
    }),
    Animate({
        path: '/danny_devito',
        start_state: 2,
        end_state: 2,
        start_time: 60,
        end_time:  70,
    }),
    Animate({
        path: '/danny_devito',
        start_state: 3,
        end_state: 3,
        start_time: 65,
        end_time:  75,
    }),
]

// 3 is the last in the list, and is active @ warped_time
let active_q = activeAnimations({
    anim_queue: animation_queue,
    former_time: 64,
    warped_time: 66,
})
assert(active_q.pop().start_state == 3, 'Animation 3 should take precedence')

// 3 is last in the list, but 2 is @ warped_time
active_q = activeAnimations({
    anim_queue: animation_queue,
    former_time: 71,
    warped_time: 60,
})
assert(active_q.pop().start_state == 2, 'Animation 2 should take precedence')

// none of the animations take precedence over the BECOME. they all ended.
active_q = activeAnimations({
    anim_queue: animation_queue,
    former_time: 50,
    warped_time: 76,
})
assert(active_q.pop().start_state == 0, 'Animation 0 should take precedence')

// same thing, but without the become gets Animation 3 in its last frame
active_q = activeAnimations({
    anim_queue: animation_queue.slice(1),
    former_time: 50,
    warped_time: 76,
})
assert(active_q.pop().start_state == 3, 'Animation 3 should take precedence')


///////////////
// ANIMATION UNIQUIFICATION
const anim_queue = [
    {path: '/a/b'},
    {path: '/a/b/c/d'},
    {path: '/a/b/c/d/e'},
    {path: '/a/b/f'},
    {path: '/a/b'},
    {path: '/a/b/x'},
    {path: '/a/b/x/y'},
    {path: '/a/b/x'},
]

const uniq_anims = uniqueAnimations(anim_queue)
assert(
 uniq_anims.length == 2,
 'uniqueAnimations did not remove overwritten child paths'
)
assert(
 uniq_anims[0].path == '/a/b' && uniq_anims[1].path == '/a/b/x',
 'uniqueAnimations removed wrong parent/child paths'
)

///////////////
// test immutify
const immutable_obj = immutify({a: 1, b: 2})
assertThrows(() => {immutable_obj.a = 5})

///////////////
// test computeTheOther on objects
const start_state = {
    a: 0,
    b: 10,
}
const delta_state = {
    a: 10,
    b: -10,
}
const end_state = {
    a: 10,
    b: 0,
}
let [calc_delta, calc_end] = computeTheOther(start_state, undefined, end_state)
assertEqual(calc_delta, delta_state)
assertEqual(calc_end, end_state)

let [calc_delta2, calc_end2] = computeTheOther(start_state, delta_state, undefined)
assertEqual(calc_delta2, delta_state)
assertEqual(calc_end2, end_state)



///////////////
// Test Become
const become1 = Become({
    path: '/abc/def',
    state: 'testme',
})

// end and delta states are always null
assertEqual(become1.end_state, null)
assertEqual(become1.delta_state, null)
// start_time defaults to now()
assert((Date.now() - become1.start_time) < 10)
// duration & end_time default to Infinity
assertEqual(become1.duration, Infinity)
assertEqual(become1.end_time, Infinity)
// state is calculated correctly
assertEqual(
    computeAnimatedState({animations: [become1], warped_time: Date.now() + 1}),
    {abc: {def: 'testme'}}
)

// can define end_time or duration, not both
assertThrows(() => Become({
    path: '/a',
    state: 1,
    start_time: 10,
    end_time: 11,
    duration: 5,
}))

// note: these are invariants across all Animate-types
// cannot go backwards in time
assertThrows(() => Become({path: '/r', state: 1, start_time: 10, end_time: 9}))
// trailing slashes not allowed
assertThrows(() => Become({path: '/p/', state: 1}))


///////////////
// Test Style

// exactly one of (delta_state, end_state) must be defined
assertThrows(() => Style({
    path: '/x',
    start_state: {a: 1},
    delta_state: {a: 1},
    end_state: {a: 2},
}))
assertThrows(() => Style({
    path: '/v',
    start_state: {a: 1},
}))

// all provided states must be of type Object
assertThrows(() => Style({
    path: '/j',
    start_state: {a: 0},
    delta_state: 100,
}))
// start_state and end_state must have the same schema
assertThrows(() => Style({
    path: '/y',
    start_state: {a: 1},
    end_state: {a: 2, b: 3},
}))

// delta_state must not have any keys not present in start_state
assertThrows(() => Style({
    path: '/n',
    start_state: {a: 1, b: 0, c: 5},
    delta_state: {a: 2, b: 3, d: 10},
}))
// merges instead of overwriting
const original_style = Become({
    path: '/qw/b',
    start_time: 0,
    state: 0,
})
const restyle = Style({
    path: '/qw',
    start_time: 0,
    end_time: 1000,
    start_state: {top: 0, left: 0},
    end_state: {top:100, left: -100},
    unit: ''
})

assertEqual(
    computeAnimatedState({
        animations: [original_style, restyle],
        warped_time: 500
    }),
    {qw: {top: 50, left: -50, b: 0}}
)
// it is possible to define a subset of keys in start_state for delta_state
const restyle2 = Style({
    path: '/qw',
    start_time: 100,
    end_time: 200,
    start_state: {top: 0, left: 0},
    delta_state: {top:100},
    unit: ''
})
assertEqual(
    computeAnimatedState({
        animations: [original_style, restyle2],
        warped_time: 0,
    }),
    {qw: {b: 0}}
)
assertEqual(
    computeAnimatedState({
        animations: [original_style, restyle2],
        warped_time: 100,
    }),
    {qw: {top: 0, left: 0, b: 0}}
)

assertEqual(
    computeAnimatedState({
        animations: [original_style, restyle2],
        warped_time: 150,
    }),
    {qw: {top: 50, left: 0, b: 0}}
)
assertEqual(
    computeAnimatedState({
        animations: [original_style, restyle2],
        warped_time: 200,
        former_time: 199,
    }),
    {qw: {top: 100, left: 0, b: 0}}
)

///////////////
// Test AnimateCSS

let css_animation = AnimateCSS({
    path: '/q',
    name: 'flipInX',
})

const default_start = Date.now()
// defaults to starting now, with 1000 duration
assert((default_start - css_animation.start_time) < 5)
assert((default_start + 1000 - css_animation.end_time < 5))

css_animation = AnimateCSS({
    path: '/jj',
    name: 'flipInX',
    start_time: default_start,
    end_time: default_start + 1000,
})

assertEqual(
    computeAnimatedState({
        animations: [css_animation],
        warped_time: default_start + 0
    }),
    {jj: {style: {animation: `flipInX 1000ms linear -${0}ms paused`}}}
)

assertEqual(
    computeAnimatedState({
        animations: [css_animation],
        warped_time: default_start + 500
    }),
    {jj: {style: {animation: `flipInX 1000ms linear -${500}ms paused`}}}
)

assertEqual(
    computeAnimatedState({
        animations: [css_animation],
        warped_time: default_start + 1000
    }),
    {jj: {style: {animation: `flipInX 1000ms linear -${1000}ms paused`}}}
)


///////////////
// Test Translate

// all states must be objects
assertThrows(() => Translate({
    path: '/mandela',
    start_state: 10,
    end_state:  20,
    duration: 500,
}))
// all states must have one of (top, left, bottom, right) as keys
assertThrows(() => Translate({
    path: '/napoleon',
    start_state: {},
    end_state:  {},
    duration: 500,
}))
// only (top, left, bottom, right) are allowed keys
assertThrows(() => Translate({
    path: '/cleopatra',
    start_state: {top: 10, something_else: 20},
    end_state:  {top: 10, something_else: 50},
    duration: 500,
}))
// all states must have the same schema
assertThrows(() => Translate({
    path: '/ghandi',
    start_state: {top: 10, left: 20},
    delta_state:  {top: 10, right: 50},
    duration: 500,
}))
assertThrows(() => Translate({
    path: '/franklin',
    start_state: {top: 10, left: 20},
    end_state:  {top: 10, right: 50},
    duration: 500,
}))
// exactly one of delta_state, end_state must be defined
assertThrows(() => Translate({
    path: '/charlemagne',
    start_state: {top: 10, left: 20},
    delta_state: {top: 10, left: 10},
    end_state:  {top: 20, left: 30},
    duration: 500,
}))
assertThrows(() => Translate({
    path: '/catherine',
    start_state: {top: 10, left: 20},
    duration: 500,
}))

const bounce = RepeatSequence([
    Translate({
        path: '/round_thing',
        start_state: {top: 0, left: 0},
        end_state:  {top: -200, left: 0},
        duration: 500,
    }),
    Translate({
        path: '/round_thing',
        start_state: {top: -200, left: 0},
        end_state: {top: 0, left: 0},
        duration: 500,
    }),
], 10, 0)
const translateObj = (left, top) => {
    return {
        style: {
            transform: `translate(${left}px, ${top}px)`
        }
    }
}
assertEqual(
    computeAnimatedState({animations: bounce, warped_time: 250}),
    {round_thing: translateObj(0, -100)}
)
assertEqual(
    computeAnimatedState({animations: bounce, warped_time: 1250}),
    {round_thing: translateObj(0, -100)}
)
assertEqual(
    computeAnimatedState({animations: bounce, warped_time: 500}),
    {round_thing: translateObj(0, -200)}
)
assertEqual(
    computeAnimatedState({animations: bounce, warped_time: 1500}),
    {round_thing: translateObj(0, -200)}
)

///////////////
// Test Opacity

// all states must be numbers between 0 and 1 inclusive
assertThrows(() => Opacity({
    path: '/soulcalibur',
    start_state: 0,
    end_state:  'giraffe',
    duration: 500,
}))
assertThrows(() => Opacity({
    path: '/diablo',
    start_state: 1.5,
    end_state:  0.25,
    start_time: 0,
    duration: 500,
}))
assertThrows(() => Opacity({
    path: '/halo',
    start_state: 1,
    end_state:  -1,
    start_time: 0,
    duration: 500,
}))

const fade = Opacity({
    path: '/civ',
    start_state: 0.5,
    end_state: 0,
    start_time: 0,
    duration: 500,
})
assertEqual(
    computeAnimatedState({animations: [fade], warped_time: 0}),
    {civ: {style: {opacity: 0.5}}}
)
assertEqual(
    computeAnimatedState({animations: [fade], warped_time: 250}),
    {civ: {style: {opacity: 0.25}}}
)
assertEqual(
    computeAnimatedState({animations: [fade], warped_time: 500, former_time: 499}),
    {civ: {style: {opacity: 0}}}
)


// on all animations:
//     - start_time must be < end_time
//     - paths should never have a trailing slash

// Become
//     - end_state and delta_state are null
//     - start_time is Date.now() as default
//     - duration & end_time are Infinity by default
//     - computeAnimatedState at any time after start_time == start_state
// Style
//     - start and exactly one of (delta_state, end_state) must be defined
//     - all provided states must be Object
//     - end_state must have the same schema as start_state
//     - delta_state must not have any keys not present in start_state
//     - merging works correctly
//     - computeAnimatedState assertions at 0, duration, and somewhere in middle
// AnimateCSS
//     - defaults to starting now, with 1000 duration
//     - computeAnimatedState assertions at 0, duration, and somewhere in middle
// Translate
//     - start and exactly one of (delta_state, end_state) must be defined
//     - all provided states must be Object
//     - all provided states have one more of (top, left, bottom, right) and the same schema
//     - computeAnimatedState assertions at 0, duration, and somewhere in middle
// Opacity
//     - start and exactly one of (delta_state, end_state) must be defined
//     - all provided states must be Number between 0 and 1 (inclusive)
//     - computeAnimatedState assertions at 0, duration, and somewhere in middle
// Rotate
//     - start and exactly one of (delta_state, end_state) must be defined
//     - all provided states must be Number
//     - computeAnimatedState assertions at 0, duration, and somewhere in middle


process.exit(0)
}
