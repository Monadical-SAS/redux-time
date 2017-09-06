import {Become, TranslateTo, Rotate,
        Scale, Opacity} from './animations.js'

import {assert, print} from './tests.js'

import {computeAnimatedState} from './reducers.js'

const nested_key = (i, d, bf) => {
    // populates a tree uniformly
    // returns /{i mod bf ** d}/{i mod bf ** (d-1)} ... /{i mod bf}
    // where i is the i-th placement
    //       d is the depth of the tree
    //       bf is the branching factor
    const key = (l) => i % (bf ** (d - l))
    return `\${[...Array(d).keys()].map(key).join('/')}`
}

// assert(nested_key(15, 2, 3) == '/1/2')
// assert(nested_key(15, 3, 2) == '/1/1/0')
// assert(nested_key(15, 2, 3) == '/1/2')
// assert(nested_key(15, 3, 2) == '/1/1/0')


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
