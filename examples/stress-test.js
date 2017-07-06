import React from 'react'
import ReactDOM from 'react-dom'
import {Button} from 'react-bootstrap'

import {createStore, combineReducers} from 'redux'
import {Provider, connect} from 'react-redux'

import {animations, startAnimation} from '../reducers.js'
import {Become, RepeatSequence, Translate} from '../animations.js'
import {AnimationControls} from '../controls.js'
import {AnimationStateVisualizer} from '../state-visualizer.js'
import {range} from '../util.js'

import {ExpandableSection} from '../section.js'

const SOURCE = "https://github.com/Monadical-SAS/redux-time/blob/master/warped-time/examples/stress-test.js"

window.initial_state = {balls: {}}

window.store = createStore(combineReducers({animations}))
const getWarpedTime = startAnimation(window.store, window.initial_state)

const StessTesterComponent = ({balls, addBalls, fps, getTime}) => {
    const keys = Object.keys(balls)
    const len = keys.length
    return <ExpandableSection name="Stress Tester" source={SOURCE} expanded>
        <Button onClick={() => addBalls(getTime())}>Add 100 Balls</Button> &nbsp;
        {len} balls animating @ {fps} FPS  🖥
        <br/><br/>

        <div style={{height: 620, width: '100%', padding: 20, position: 'relative', borderRadius: 10, margin: 'auto', backgroundColor: '#ddd'}}>
            {keys.map(idx =>
                <div style={balls[idx].style}></div>)}
            {!len ? 'Click "Add 100 Balls" to start stress-testing.' : ''}
            {fps < 20 ?
                <div style={{position: 'absolute', left: '5%', zIndex: 20, width: '90%', backgroundColor: 'red', padding: 20}}>
                    Further optimization is needed to render more than ~{len} elements.
                </div> : ''}
        </div>
    </ExpandableSection>
}

const ball_style = {
    position: 'absolute',
    backgroundColor: 'red',
    top: '50%',
    left: '50%',
    width: 20,
    height: 20,
    borderRadius: 10,
    zIndex: 10,
}

let num_balls = 0

const ADD_BALLS_ANIMATION = (start_time, num) => {
    const width = window.innerWidth
    let new_anims = []
    range(num).map(idx => {
        num_balls += 1
        new_anims = [
            ...new_anims,
            Become({
                path: `/balls/${num_balls}/style`,
                start_time,
                state: {
                    ...ball_style,
                    top: Math.random() * 600,
                    left: Math.random() * width,
                },
            }),
            ...RepeatSequence([Translate({
                path: `/balls/${num_balls}`,
                start_time,
                start_state: {top: 0, left: 0},
                end_state: {top: 0, left: Math.random() * width - width/2},
                duration: 10000,
            })], 6),
        ]
    })
    return new_anims
}

const mapStateToProps = ({animations}) => ({
    balls: animations.state.balls,
    fps: Math.round(1000/(animations.current_timestamp - animations.last_timestamp)),
})
const mapDispatchToProps = (dispatch) => ({
    addBalls: (start_time) => {
        dispatch({type: 'ADD_ANIMATION', animation: ADD_BALLS_ANIMATION(start_time, 100)})
    },
})

const StessTester = connect(mapStateToProps, mapDispatchToProps)(StessTesterComponent)


ReactDOM.render(
    <Provider store={window.store}>
        <div>
            <StessTester getTime={getWarpedTime}/>
            <AnimationControls debug expanded/>
            <AnimationStateVisualizer debug/>
        </div>
    </Provider>,
    document.getElementById('react'),
)

window.onmousemove = (e) => {
    window.mouseY = e.pageY
    window.mouseX = e.pageX
}
