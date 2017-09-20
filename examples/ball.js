import React from 'react'
import ReactDOM from 'react-dom'

import {createStore, combineReducers} from 'redux'
import {Provider, connect} from 'react-redux'

import {ExpandableSection} from 'monadical-react-components'

import {
    animationsReducer,
    startAnimation,
    AnimationControls,
    AnimationStateVisualizer,
    AnimationTimeline,
} from '../node/main.js'

import {Become, Animate, Translate, RepeatSequence} from '../node/animations.js'



const SOURCE = "https://github.com/Monadical-SAS/redux-time/blob/master/examples/ball.js"

const initial_ball_state = {following: false}
const ballReducer = (state=initial_ball_state, action) => {
    // console.log({state, action})
    switch (action.type) {
        case 'BALL_SET_FOLLOWING':{
            return {following: action.following}
        }
        default:{
            return state
        }
    }
}

const initial_animation_state = {
    ball: {
        style: {
            position: 'relative',
            top: '0%',
            left: '45%',
            backgroundColor: 'red',
            width: 100,
            height: 100,
            borderRadius: 50,
            zIndex: 1000,
        }
    }
}
window.store = createStore(combineReducers({
    animations: animationsReducer,
    ball: ballReducer,
}))
window.time = startAnimation(window.store, initial_animation_state)

const BOUNCE_ANIMATIONS = (start_time) =>
    RepeatSequence([
        // high bounce
        Translate({
            path: '/ball',
            start_state: {top: 0, left: 0},
            end_state:  {top: -200, left: 0},
            duration: 500,
            curve: 'easeOutQuad',
            // start_time: window.time.getWarpedTime(),         //  optional, defaults to now
            // unit: 'px',                                      //  optional, defaults to px
        }),
        Translate({
            path: '/ball',
            start_state: {top: -200, left: 0},
            end_state: {top: 0, left: 0},
            duration: 500,
            curve: 'easeInQuad',
        }),

        // medium bounce
        Translate({
            path: '/ball',
            start_state: {top: 0, left: 0},
            end_state:  {top: -100, left: 0},
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

        // low bounce
        Translate({
            path: '/ball',
            start_state: {top: 0, left: 0},
            end_state:  {top: -50, left: 0},
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
    ], 3, start_time)

const FOLLOW_ANIMATIONS = () => {
    return [
        Become({
            path: '/ball/style/position',
            state: 'fixed',
        }),
        Animate({
            path: '/ball/style/top',
            duration: Infinity,
            tick: () => window.mouseY - 50
        }),
        Animate({
            path: '/ball/style/left',
            duration: Infinity,
            tick: () => window.mouseX - 50
        }),
    ]
}

const STOP_FOLLOWING_ANIMATIONS = () => {
    return [
        Become({
            path: '/ball/style',
            state: initial_animation_state.ball.style,
        })
    ]
}


const BallComponent = ({ball, following, animateBallBounce, animateBallFollow, getTime}) => {
    return <ExpandableSection name="Ball" source={SOURCE} expanded>
        <div
            className="ball"
            style={ball.style}
            onClick={() => animateBallBounce(getTime())}
            onContextMenu={(e) => animateBallFollow(following, e)}>
        </div>
    </ExpandableSection>
}

const mapStateToProps = ({animations, ball}) => {
    return {
        ball: animations.state.ball,
        following: ball.following,
    }
}

const mapDispatchToProps = (dispatch, props) => ({
    animateBallBounce: (start_time) => {
        console.log(BOUNCE_ANIMATIONS(start_time))
        dispatch({type: 'ANIMATE', animations: BOUNCE_ANIMATIONS(start_time)})
    },
    animateBallFollow: (following, e) => {
        e.preventDefault()
        console.log(FOLLOW_ANIMATIONS())
        // console.log({e, following})
        if (following) {
            dispatch({type: 'ANIMATE', animations: STOP_FOLLOWING_ANIMATIONS()})
        } else {
            dispatch({type: 'ANIMATE', animations: FOLLOW_ANIMATIONS()})
        }
        dispatch({type: 'BALL_SET_FOLLOWING', following: !following})
    },
})

const Ball = connect(mapStateToProps, mapDispatchToProps)(BallComponent)


ReactDOM.render(
    <Provider store={window.store}>
        <div>
            <Ball getTime={window.time.getWarpedTime.bind(window.time)} expanded/>
            <AnimationTimeline debug={true} expanded={true}/>
            <AnimationControls debug={true} expanded={true}/>
            <AnimationStateVisualizer debug={true} expanded={false}/>
        </div>
    </Provider>,
    document.getElementById('react'),
)

window.onmousemove = (e) => {
    window.mouseY = e.pageY
    window.mouseX = e.pageX
}
