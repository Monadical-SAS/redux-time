import React from 'react'
import ReactDOM from 'react-dom'

import {createStore, combineReducers} from 'redux'
import {Provider, connect} from 'react-redux'

import {animations, AnimationHandler} from '../reducers.js'
import {Translate, Repeat} from '../animations.js'

window.initial_state = {
    ball: {style: {
        position: 'absolute',
        top: '45%',
        left: '45%',
        backgroundColor: 'red',
        width: 100,
        height: 100,
        borderRadius: 50,
    }}
}

window.store = createStore(combineReducers({animations}))
window.animations = new AnimationHandler(window.store, window.initial_state)


const DemoComponent = ({ball, queue, onClickBall}) =>
    <div>
        <h1 style={{textAlign: 'center'}}>Ball Animation Demo</h1>

        <pre style={{width: '50%', float: 'right'}}>
            State:<br/>
            {JSON.stringify(ball, null, 4)}
        </pre>
        <pre>
            Animation Queue:<br/>
            {JSON.stringify(queue, null, 4)}
        </pre>

        <div className="ball" style={ball.style} onClick={onClickBall}></div>
    </div>

const mapStateToProps = ({animations}) => ({ball: animations.state.ball, queue: animations.queue})
const mapDispatchToProps = (dispatch) => ({
    onClickBall: () => {
        // bounce the ball
        const start_time = (new Date).getTime()
        dispatch({type: 'ADD_ANIMATION', animation: [
            Translate({
                path: '/ball',
                start_state: {top: 0, left: 0},
                end_state:  {top: -200, left: 0},
                start_time: start_time,
                duration: 1000,
                unit: 'px',
                curve: 'easeOutQuad',
            }),
            Translate({
                path: '/ball',
                start_state: {top: -200, left: 0},
                end_state: {top: 0, left: 0},
                start_time: start_time + 1000,
                duration: 1000,
                unit: 'px',
                curve: 'easeInQuad',
            }),
        ]})
    },
})

const BallDemo = connect(mapStateToProps, mapDispatchToProps)(DemoComponent)

ReactDOM.render(
    <Provider store={window.store}>
        <BallDemo/>
    </Provider>,
    window.react_mount,
)
