import {assert, assertEqual, print, assertSortedObjsInOrder,
        nested_key} from './util.js'

import {Become, Animate} from './animations.js'

import {activeAnimations, uniqueAnimations} from './reducers.js'


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
        id: 0,
        path: '/',
        state: 0,
        start_time: 0,
    }),
    Animate({
        id: 1,
        path: '/',
        start_state: 1,
        end_state: 1,
        start_time: 50,
        end_time:  60,
    }),
    Animate({
        id: 2,
        path: '/',
        start_state: 2,
        end_state: 2,
        start_time: 60,
        end_time:  70,
    }),
    Animate({
        id: 3,
        path: '/',
        start_state: 3,
        end_state: 3,
        start_time: 65,
        end_time:  75,
    }),
]

// finished loses
let active_q = activeAnimations({
    anim_queue: animation_queue,
    former_time: 64,
    warped_time: 66,
})
console.log(active_q)
assert(active_q.pop().id == 2, 'Animation 2 should take precedence')

// finished loses, going backwards as well
active_q = activeAnimations({
    anim_queue: animation_queue,
    former_time: 71,
    warped_time: 69,
})
console.log(active_q)
assert(active_q.pop().id == 3, 'Animation 3 should take precedence')

// finished loses to a BECOME
active_q = activeAnimations({
    anim_queue: animation_queue,
    former_time: 76,
    warped_time: 75,
})
console.log(active_q)
assert(active_q.pop().id == 0, 'Animation 0 should take precedence')




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

}