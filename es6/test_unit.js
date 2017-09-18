import {assert, assertEqual, print, assertSortedObjsInOrder,
        nested_key, assertThrows, immutify, activeAnimations,
        uniqueAnimations, currentAnimations, finalFrameAnimations,
        computeAnimatedState} from './util.js'

import {Become, Animate, Style, Translate,
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
        path: '/',
        state: 0,
        start_time: 0,
    }),
    Animate({
        path: '/',
        start_state: 1,
        end_state: 1,
        start_time: 50,
        end_time:  60,
    }),
    Animate({
        path: '/',
        start_state: 2,
        end_state: 2,
        start_time: 60,
        end_time:  70,
    }),
    Animate({
        path: '/',
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

// test immutify
const immutable_obj = immutify({a: 1, b: 2})
assertThrows(() => {immutable_obj.a = 5})

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

// Test Style merges instead of overwriting
const original_style = Become({
    path: '/a/b',
    start_time: 0,
    state: 0,
})
const restyle = Style({
    path: '/a',
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
    {a: {top: 50, left: -50, b: 0}}
)

// Test translate
const bounce = RepeatSequence([
    Translate({
        path: '/ball',
        start_state: {top: 0, left: 0},
        end_state:  {top: -200, left: 0},
        duration: 500,
    }),
    Translate({
        path: '/ball',
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
    {ball: translateObj(0, -100)}
)
assertEqual(
    computeAnimatedState({animations: bounce, warped_time: 1250}),
    {ball: translateObj(0, -100)}
)
assertEqual(
    computeAnimatedState({animations: bounce, warped_time: 500}),
    {ball: translateObj(0, -200)}
)
assertEqual(
    computeAnimatedState({animations: bounce, warped_time: 1500}),
    {ball: translateObj(0, -200)}
)

process.exit(0)
}