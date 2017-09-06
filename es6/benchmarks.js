import {Become, TranslateTo, Rotate,
        Scale, Opacity} from './animations.js'

import {assert, assertEqual, print, range} from './util.js'

import {computeAnimatedState} from './reducers.js'


let nested_key = (i, bf, d, l=null) => {
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

//  create objects
const create_objects = (n, depth, branching_factor) => {
    [...Array(n).keys()].map(i => {
        Become({
            path: nested_key(i, depth, branching_factor),
            state: {
                x: n - i,
                y: i,
            },
            start_time: i,
            end_time: 1000 + i,
        })
    })
}

//  move +100x, +100y
const move_objects = (n, depth, branching_factor) => {
    [...Array(n).keys()].map(i => {
        TranslateTo({
            path: nested_key(i, depth, branching_factor),
            start_state: {
                x: n - i,
                y: i,
            },
            end_state: {
                x: n - i + 100,
                y: i + 100,
            },
            start_time: i,
            end_time: 1000 + i,
        })
    })
}

//  rotate 180deg
const rotate_objects = (n, depth, branching_factor) => {
    [...Array(n).keys()].map(i => {
        Rotate({
            path: nested_key(i, depth, branching_factor),
            start_state: 0,
            end_state: 180,
            start_time: i,
            end_time: 1000 + i,
        })
    })
}

//  opacity -> 0%
const opacity_objects = (n, depth, branching_factor) => {
    [...Array(n).keys()].map(i => {
        Rotate({
            path: nested_key(i, depth, branching_factor),
            start_state: 1,
            end_state: 0,
            start_time: i,
            end_time: 1000 + i,
        })
    })
}

const full_anim_queue = (n, depth, branching_factor) => {
    [
        ...create_objects(n, depth, branching_factor),
        ...move_objects(n, depth, branching_factor),
        ...rotate_objects(n, depth, branching_factor),
        ...opacity_objects(n, depth, branching_factor),
    ]
}

const do_benchmark = (n, depth, branching_factor, n_frames, print_state) => {
    const full_queue = full_anim_queue(n, depth, branching_factor)
    let animated_state
    print(`benchmarking ${n} objects over ${n_frames} frames`)
    print(`depth ${d}, branching_factor ${bf}`)
    const start_time = Date.now()
    for (let i = 0; i < n_frames; i++){
        animated_state = computeAnimatedState(full_queue, 500+i)
    }
    print(`${Date.now() - start_time} milliseconds`)
    if (print_state) print(animated_state)
}

print('huh')
do_benchmark(5000, 4, 5, 50, true)
