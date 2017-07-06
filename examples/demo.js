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
        <div style={{height: '100%', textAlign: 'center'}}>
            <h1>
                Redux-Time Demo<br/>
            </h1>
            <h4>
                <small>Redux-Time is an animation library that computes your state tree as a function of time.</small><br/><br/>
                Github:&nbsp;
                <a href="https://github.com/Monadical-SAS/redux-time/">Redux-Time</a>&nbsp;|&nbsp;
                <a href="https://github.com/Monadical-SAS/redux-time/blob/master/examples/demo.js">View Source</a><br/>
            </h4>
            <hr/>
            <div>
                Press the buttons below the orange box to queue up animations.
                <br/>
                Then, drag the time slider to watch the animations progress forwards and backwards.<br/>
                <br/>
                1st State, 2nd State, Green, Red are all instant state changes.  Move and Rotate are JS animations.  Pulse and Blink are CSS keyframe animations.
            </div><hr/>
            <AnimationTester/>
            <hr/>
            <AnimationControls/>
            <hr/>
            <AnimationStateVisualizer path="test_state"/>
            <hr/>
            <a href="https://monadical.com">Monadical</a>
            <br/>
            <small>Want to hack on cool React/Redux animations or Ethereum poker? Come <a href="https://monadical.com/apply">work with us</a>!</small>
        </div>
    </Provider>,
    window.react_mount,
)
