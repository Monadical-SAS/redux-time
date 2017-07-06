import React from 'react'
import ReactDOM from 'react-dom'

import {createStore, combineReducers} from 'redux'
import {Provider, connect} from 'react-redux'

import {animations, AnimationHandler} from '../reducers.js'
import {Translate, RepeatSequence} from '../animations.js'
import {AnimationStateVisualizer} from '../state-visualizer.js'

window.initial_state = {
    ball: {
        style: {
            position: 'relative',
            top: '0%',
            left: '45%',
            backgroundColor: 'red',
            width: 100,
            height: 100,
            borderRadius: 50,
        },
    }
}
window.store = createStore(combineReducers({animations}))
window.animations = new AnimationHandler(window.store, window.initial_state)

const BOUNCE_ANIMATION = () =>
    RepeatSequence([
        Translate({
            path: '/ball',
            amt:  {top: -200, left: 0},
            duration: 500,
            curve: 'easeOutQuad',
        }),
        Translate({
            path: '/ball',
            start_state: {top: -200, left: 0},
            end_state: {top: 0, left: 0},
            duration: 500,
            curve: 'easeInQuad',
        }),
        Translate({
            path: '/ball',
            amt:  {top: -100, left: 0},
            duration: 250,
            curve: 'easeOutQuad',
        }),
        Translate({
            path: '/ball',
            start_state: {top: -100, left: 0},
            end_state: {top: 0, left: 0},
            duration: 250,
            curve: 'easeInQuad',
        }),
        Translate({
            path: '/ball',
            amt:  {top: -50, left: 0},
            duration: 125,
            curve: 'easeOutQuad',
        }),
        Translate({
            path: '/ball',
            start_state: {top: -50, left: 0},
            end_state: {top: 0, left: 0},
            duration: 125,
            curve: 'easeInQuad',
        }),
    ], 3)



const BallComponent = ({ball, queue, animateBallBounce}) =>
    <div className="ball" style={ball.style} onClick={animateBallBounce}></div>

const mapStateToProps = ({animations}) => ({ball: animations.state.ball})
const mapDispatchToProps = (dispatch) => ({
    animateBallBounce: () => {
        dispatch({type: 'ADD_ANIMATION', animation: BOUNCE_ANIMATION()})
    },
})

const Ball = connect(mapStateToProps, mapDispatchToProps)(BallComponent)

ReactDOM.render(
    <Provider store={window.store}>
        <div>
            <small style={{opacity: 0.2, float: 'right', marginTop: -10, marginRight: 5}}>examples/ball.js</small><br/>
            <Ball/>
            <hr/>
            <AnimationStateVisualizer debug/>
        </div>
    </Provider>,
    document.getElementById('react'),
)
