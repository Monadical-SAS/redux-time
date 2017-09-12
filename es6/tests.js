import {createStore, combineReducers, applyMiddleware} from 'redux'

import {animations, AnimationHandler, currentAnimations, futureAnimations,
        pastAnimations, uniqueAnimations, isParent} from './reducers.js'

import {Become, AnimateCSS, Animate, Repeat, Translate,
        Opacity, Rotate} from './animations.js'

import {assert, print, assertSortedObjsInOrder} from './util.js'

const sort = (x) => x

assertSortedObjsInOrder([{0:0}, {1:1}, {2:2}], sort, [0,1,2])

const sort2 = (x) => {
    let output = [...x]
    output.reverse()
    return output
}
assertSortedObjsInOrder([{0:0}, {1:1}, {2:2}], sort2, [2,1,0])


// const initial_state = {
//     test: {text: 'initial_state'}
// }

// const test = (state=initial_state.test, action) => {
//     switch(action.type) {
//         default:
//             return state
//     }
// }

// const store = createStore(
//     combineReducers({test, animations}),
//     initial_state,
// )
// assert(store.getState().animations.current_time == 0,                       'Initial current_time should be 0.')


// // ANIMATION HANDLER SETUP
// const handler = new AnimationHandler(store)
// const {animatedStore} = handler

// assert(
//        (animatedStore.getState().test.text == store.getState().test.text)
//     && (animatedStore.getState().test.text == initial_state.test.text),     'Initial state is wrong')


// // WARPED TIME SETUP
// assert(store.getState().animations.speed == 1,                              'Initial animation speed should be 1.')
// assert(store.getState().animations.current_time == 0,                       'current_time before first TICK should be 0.')
// store.dispatch({type: 'TICK', timestamp: handler.time.getWarpedTime()})
// assert(store.getState().animations.current_time > 0,                        'current_time after first TICK should be >0.')

// store.dispatch({type: 'SET_ANIMATION_SPEED', speed: 2})
// assert(store.getState().animations.speed == 2,                            'Animation speed was not set after SET_ANIMATION_SPEED.')


// // INITIAL STATE SETUP
// assert(
//        (animatedStore.getState().test.text == store.getState().test.text)
//     && (animatedStore.getState().test.text == initial_state.test.text),
//     'Initial state is wrong')

// assert(store.getState().animations.queue.length == 0,                       'Initial animation queue should be empty.')
// assert(JSON.stringify(store.getState().animations.state) == '{}',           'Initial animation state should be empty.')

// const start_time = handler.time.getWarpedTime()


// // ADDING STATE CHANGES
// store.dispatch({type: 'ANIMATE', animation: Become({path: '/test/text', state: '2nd state', start_time})})
// assert(store.getState().animations.queue.length == 1,                       'Animation was not added to queue.')


// // RUNNING STATE CHANGES
// store.dispatch({type: 'TICK', timestamp: start_time + 1})
// assert(animatedStore.getState().test.text == '2nd state',                   '2nd State was not set after Become.')
// store.dispatch({type: 'TICK', timestamp: start_time + 2})
// assert(animatedStore.getState().test.text == '2nd state',                   '2nd State was not consistent after Become.')


// // OVERLAPPING STATE CHANGES
// store.dispatch({type: 'ANIMATE', animation: Become({path: '/test/text', state: '3rd state', start_time: start_time + 3})})
// assert(store.getState().animations.queue.length == 2,                       'Animation was not added to queue.')

// store.dispatch({type: 'TICK', timestamp: start_time + 4})
// assert(animatedStore.getState().test.text == '3rd state',                   '3rd State was not reset after Become.')
// store.dispatch({type: 'TICK', timestamp: start_time + 5})
// assert(animatedStore.getState().test.text == '3rd state',                   '3rd State was not consistent after Become.')


// // ANIMATED STATE CHANGES
// store.dispatch({type: 'ANIMATE', animation: Animate({path: '/test/text', start_state: 0, end_state: 100, start_time: start_time + 6, duration: 1000})})
// assert(store.getState().animations.queue.length == 3,                       'Animation was not added to queue.')
// store.dispatch({type: 'TICK', timestamp: start_time + 7})
// assert(animatedStore.getState().test.text > 0,                              '3rd State was not reset after Become.')
// store.dispatch({type: 'TICK', timestamp: start_time + 900})
// assert(animatedStore.getState().test.text < 100,                            'Animation moved too fast.')
// store.dispatch({type: 'TICK', timestamp: start_time + 1007})
// assert(animatedStore.getState().test.text == '3rd state',                   'State was not reset after animation finished.')


// // OVERLAPPING ANIMATED STATE CHANGES
// store.dispatch({type: 'ANIMATE', animation: Become({path: '/test/text', state: 0, start_time: start_time + 2000})})
// store.dispatch({type: 'ANIMATE', animation: Animate({path: '/test/text', start_state: 0, amt: 100, start_time: start_time + 2100, duration: 1000})})
// store.dispatch({type: 'ANIMATE', animation: Animate({path: '/test/text', start_state: 200, amt: 100, start_time: start_time + 2200, duration: 2000})})
// store.dispatch({type: 'ANIMATE', animation: Animate({path: '/test/text', start_state: 400, amt: 100, start_time: start_time + 2300, duration: 1000})})
// store.dispatch({type: 'TICK', timestamp: start_time + 2050})
// assert(animatedStore.getState().test.text == 0,                             'State 0 was not applied after Become.')
// store.dispatch({type: 'TICK', timestamp: start_time + 2150})
// assert(animatedStore.getState().test.text > 0,                              '0-100 overlapping animation was not applied.')
// store.dispatch({type: 'TICK', timestamp: start_time + 2250})
// assert(animatedStore.getState().test.text > 200,                            '200-300 overlapping animation was not applied.')
// store.dispatch({type: 'TICK', timestamp: start_time + 2350})
// assert(animatedStore.getState().test.text > 400,                            '400-500 overlapping animation was not applied.')
// store.dispatch({type: 'TICK', timestamp: start_time + 3500})
// assert(animatedStore.getState().test.text < 300,                            '400-500 overlapping animation was not unapplied after it finished.')
// store.dispatch({type: 'TICK', timestamp: start_time + 4500})
// assert(animatedStore.getState().test.text == 0,                             'State did not revert to 0 after all animations finished.')


// // REPEATED ANIMATIONS
// store.dispatch({type: 'ANIMATE', animation: Repeat(Animate({path: '/test/text', start_state: 600, amt: 100, start_time: start_time + 5000, duration: 200}), 5)})
// store.dispatch({type: 'TICK', timestamp: start_time + 5050})
// assert(animatedStore.getState().test.text > 600,                             'State 600-700 was not animated.')
// store.dispatch({type: 'TICK', timestamp: start_time + 5500})
// assert(animatedStore.getState().test.text > 600,                             'State 600-700 did not repeat.')
// store.dispatch({type: 'TICK', timestamp: start_time + 6050})
// assert(animatedStore.getState().test.text == 0,                              'State did not revert to 0 after repeated animation.')


// // RUNLOOP MECHANICS
// store.dispatch({type: 'ANIMATE', animation: Animate({path: '/test/text', start_state: 600, amt: 100, start_time: start_time + 8000, duration: 200})})
// let queue = store.getState().animations.queue

// assert(currentAnimations(queue, start_time + 7000).length > 0,               'currentAnimations was empty despite queued infinite animations.')
// assert(futureAnimations(queue, start_time + 7000).length > 0,                'futureAnimations was empty despite queued future animations.')
// assert(pastAnimations(queue, start_time + 7000).length > 0,                  'pastAnimations was empty despite queued finished animations.')
// assert(uniqueAnimations(queue, start_time + 7000).length > 0,                'uniqueAnimations was empty despite multiple unique animations.')
// assert(handler.shouldAnimate(start_time + 7000),                             'shouldAnimate returned false when queue contained items.')
// assert(handler.animating,                                                    'animation runloop was not running despite queued animations.')


// // FULL INTEGRATION TEST

// store.dispatch({type: 'CLEAR_ANIMATIONS'})
// assert(store.getState().animations.queue.length == 0,                        'Animation queue failed to clear after CLEAR_ANIMATIONS.')
// assert(JSON.stringify(store.getState().animations.state) == '{}',            'Animation state failed to clear after CLEAR_ANIMATIONS.')

// const seq = [
//     Become({path: '/test/text', start_time: start_time + 9000, state: 'integration test'}),
//     Translate({path: '/test', start_time: start_time + 9000, duration: 1000, start_state: {top: 100, left: 100}, end_state: {top: 200, left: 200}}),
//     Opacity({path: '/test', start_time: start_time + 9000, duration: 1000, start_state: 0, end_state: 1}),
//     Rotate({path: '/test', start_time: start_time + 9000, duration: 1000, start_state: 0, end_state: 360}),
//     Become({path: '/test/text', start_time: start_time + 10000, state: null}),
// ]
// seq.map((animation => store.dispatch({type: 'ANIMATE', animation})))
// queue = store.getState().animations.queue

// assert(currentAnimations(queue, start_time + 9001).length == seq.length - 1,        'Queue was not the right length after adding several animations.')
// assert(uniqueAnimations(currentAnimations(queue, start_time + 20000)).length == 1,  'Unique current queue was not the right length after animations finished.')


// store.dispatch({type: 'TICK', timestamp: start_time + 9001})
// assert(animatedStore.getState().test.style.transform.indexOf('translate(') != -1,   'Translate animation failed to change style left state.')
// assert(animatedStore.getState().test.style.opacity > 0,                             'Opacity animation failed to change style opacity state.')
// assert(animatedStore.getState().test.style.transform.indexOf('rotate(') != -1,      'Rotate animation failed to change style rotation state.')
// store.dispatch({type: 'TICK', timestamp: start_time + 10001})
// assert(!animatedStore.getState().test.style,                                        'Animations left some dirty style state after completing.')



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


console.log('')
process.exit(0)
