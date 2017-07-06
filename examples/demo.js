import React from 'react'
import ReactDOM from 'react-dom'

import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'

import {AnimationControls} from '../controls.js'
import {animations, AnimationHandler} from '../reducers.js'
import {Become} from '../animations.js'

window.initial_state = {
    test_state: {text: 'Animate Me!', style: {color: 'black'}}
}

window.store = createStore(
    combineReducers({animations}),
)

window.animations = new AnimationHandler(
    window.store,
    window.initial_state,
)

ReactDOM.render(
    <Provider store={window.store}>
        <div style={{height: '100%'}}>
            <AnimationControls/>
        </div>
    </Provider>,
    window.react_mount,
)

window.onload = function() {
    // add example code here


}
