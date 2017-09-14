import React from 'react'
import ReactDOM from 'react-dom'

import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'

import {
    animations,
    startAnimation,
    AnimationControls,
    AnimationStateVisualizer
} from '../../node/main.js'

import {Timeline} from './component.js'



window.initial_state = {
    test_state: {
        text: 'Animate Me!',
        style: {color: 'black'},
    },
}

window.store = createStore(combineReducers({animations}))
window.time = startAnimation(window.store, window.initial_state)

ReactDOM.render(
    <Provider store={window.store}>
        <div>
            <Timeline/>
        </div>
    </Provider>,
    document.getElementById('react'),
)


const seq = [
    Animate({
        path: '/test/text',
        start_state: 5,
        amt: 10,
        start_time: 35,
        end_time: 99,
    }),
    Become({
        path: '/test/text',
        start_time: 45,
        state: 3,
    }),
    Animate({
        path: '/test/text',
        start_state: 600,
        amt: 100,
        start_time: 60,
        end_time: 70,
    }),
    Animate({
        path: '/test/text',
        start_state: 80,
        amt: 100,
        start_time: 55,
        end_time: 60,
    }),
    Become({
        path: '/test/text',
        start_time: 70,
        state: 4,
    }),
]

seq.map((animation => window.store.dispatch({type: 'ANIMATE', animation})))