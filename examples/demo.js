import React from 'react'
import ReactDOM from 'react-dom'

import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'

import {AnimationControls} from 'monadical-react-components/build/redux-time-controls'
import {AnimationStateVisualizer} from 'monadical-react-components/build/redux-time-visualizer'
import {AnimationTimeline} from 'monadical-react-components/build/redux-time-timeline'

import {animationsReducer, startAnimation} from '../build/main.js'
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
            <AnimationControls time={window.time} debug/>
            <AnimationStateVisualizer path="test_state" expanded={false} debug/>
        </div>
    </Provider>,
    document.getElementById('react'),
)
