import React from 'react'
import ReactDOM from 'react-dom'

import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'

import {AnimationControls} from '../controls.js'
import {AnimationStateVisualizer} from '../state-visualizer.js'
import {AnimationTester} from './test-component.js'

import {animations, AnimationHandler} from '../reducers.js'


window.initial_state = {
    test_state: {
        text: 'Animate Me!',
        style: {color: 'black'},
    },
}

window.store = createStore(combineReducers({animations}))
window.animations = new AnimationHandler(window.store, window.initial_state)

ReactDOM.render(
    <Provider store={window.store}>
        <div>
            <AnimationTester debug/>
            <hr/>
            <AnimationControls debug/>
            <hr/>
            <AnimationStateVisualizer path="test_state" debug/>
        </div>
    </Provider>,
    document.getElementById('react'),
)
