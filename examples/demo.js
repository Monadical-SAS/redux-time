import React from 'react'
import ReactDOM from 'react-dom'

import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'

import {
    animationsReducer,
    startAnimation,
    AnimationControls,
    AnimationTimeline,
    AnimationStateVisualizer
} from '../node/main.js'

import {AnimationTester} from './test-component.js'



window.initial_state = {
    test_state: {
        text: 'Animate Me!',
        style: {color: 'black'},
    },
}

window.store = createStore(combineReducers({animations: animationsReducer}))
window.time = startAnimation(window.store, window.initial_state)

ReactDOM.render(
    <Provider store={window.store}>
        <div>
            <AnimationTester getTime={window.time.getWarpedTime.bind(window.time)} debug/>
            <AnimationTimeline debug={true} expanded={true}/>
            <AnimationControls debug/>
            <AnimationStateVisualizer path="test_state" debug/>
        </div>
    </Provider>,
    document.getElementById('react'),
)
