import React from 'react'
import ReactDOM from 'react-dom'
import {Button} from 'react-bootstrap'


import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'


import {AnimationControls} from './controls.js'
import {animations, AnimationHandler} from './reducers.js'
import {Become} from './animations.js'


window.store = createStore(
    combineReducers({animations}),
)

window.animations = new AnimationHandler(window.store)

window.store.dispatch({type: 'ADD_ANIMATION', animation: Become({
    path: '/test_state',
    state: {text: 'Animate Me!', style: {color: 'black'}},
    start_time: 0,
})})


ReactDOM.render(
    <Provider store={window.store}>
        <div style={{height: '100%'}}>
            <AnimationControls/>
        </div>
    </Provider>,
    window.react_mount,
)
