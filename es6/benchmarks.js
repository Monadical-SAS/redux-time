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
const create_objects = (n, branching_factor, depth) => {
    return range(n).map(i =>
        Become({
            path: nested_key(i, branching_factor, depth),
            state: {
                left: n - i,
                top: i,
            },
            start_time: i,
        })
    )
}

//  move +100x, +100y
const move_objects = (n, branching_factor, depth) => {
    return range(n).map(i =>
        TranslateTo({
            path: nested_key(i, branching_factor, depth),
            start_state: {
                left: n - i,
                top: i,
            },
            end_state: {
                left: n - i + 100,
                top: i + 100,
            },
            start_time: i,
            end_time: 1000 + i,
        })
    )
}

//  rotate 180deg
const rotate_objects = (n, branching_factor, depth) => {
    return range(n).map(i =>
        Rotate({
            path: nested_key(i, branching_factor, depth),
            start_state: 0,
            end_state: 180,
            start_time: i,
            end_time: 1000 + i,
        })
    )
}

//  opacity -> 0%
const opacity_objects = (n, branching_factor, depth) => {
    return range(n).map(i =>
        Rotate({
            path: nested_key(i, branching_factor, depth),
            start_state: 1,
            end_state: 0,
            start_time: i,
            end_time: 1000 + i,
        })
    )
}

const full_anim_queue = (n, branching_factor, depth) => {
    return [
        ...create_objects(n, branching_factor, depth),
        // ...move_objects(n, branching_factor, depth),
        ...rotate_objects(n, branching_factor, depth),
        ...opacity_objects(n, branching_factor, depth),
    ]
}

const do_benchmark = (n, branching_factor, depth, n_frames, print_state) => {
    const full_queue = full_anim_queue(n, branching_factor, depth)
    let animated_state
    if (print_state) console.log({full_queue})
    console.log(`benchmarking ${n} objects over ${n_frames} frames`)
    console.log(`state has: branching_factor ${branching_factor}, depth ${depth}`)
    const start_time = Date.now()
    for (let i = 0; i < n_frames; i++){
        animated_state = computeAnimatedState(full_queue, 500+i)
    }
    console.log(`${Date.now() - start_time} milliseconds`)
    console.log(`${1000/((Date.now() - start_time)/n_frames)} FPS`)
    if (print_state) console.log(animated_state)
}

do_benchmark(5, 5, 5, 50, false)
do_benchmark(50, 5, 5, 50, false)
do_benchmark(500, 5, 5, 50, false)
do_benchmark(5000, 5, 5, 50, false)
