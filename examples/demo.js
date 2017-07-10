import React from 'react'
import ReactDOM from 'react-dom'

import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'

import {
    animations,
    startAnimation,
    AnimationControls,
    AnimationStateVisualizer
} from '../src/main.js'

import {AnimationTester} from './test-component.js'



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
            <AnimationTester getTime={window.time.getWarpedTime.bind(window.time)} debug/>
            <AnimationControls debug/>
            <AnimationStateVisualizer path="test_state" debug/>
        </div>
    </Provider>,
    document.getElementById('react'),
)
