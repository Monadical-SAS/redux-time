import React from 'react'
import {Button} from 'react-bootstrap'

import {connect} from 'react-redux'

import {Become, Repeat, Animate, Translate, AnimateCSS} from '../animations.js'

const base_style = {
    width: 200,
    margin: 'auto',
    overflow: 'hidden',
    border: '1px dashed red',
    backgroundColor: 'orange',
}

const AnimationTesterComponent = ({text, style, animateFirstState, animateSecondState, animateGreen, animateRed, animateMove, animateRotate, animatePulse, animateBlink, animateBlinkStop, clearAnimations, debug}) =>
    <div style={{position: 'relative'}}>
        {debug ? <small style={{opacity: 0.2, position: 'absolute', top: -15, right: 5}}>examples/test-component.js</small>: null}
        <pre style={{...base_style, ...style}}>
            <br/>
            {text}
            <br/><br/>
        </pre><br/>
        <Button title="Instant state change" onClick={animateFirstState}>1st state</Button>
        <Button title="Instant state change" onClick={animateSecondState}>2nd state</Button>
        <Button title="Instant state change" onClick={animateGreen}>Green</Button>
        <Button title="Instant state change" onClick={animateRed}>Red</Button>
        <Button title="Instant state change" onClick={animateMove}>Move</Button>
        <Button title="Javascript animation" onClick={animateRotate}>Rotate 3x</Button>
        <Button title="Javascript animation" onClick={animatePulse}>Pulse</Button>
        <Button title="CSS keyframe animation" onClick={animateBlink}>Blink Forever</Button>
        <Button title="CSS keyframe animation" onClick={animateBlinkStop}>Stop Blinking</Button>
        <Button onClick={clearAnimations}>Reset</Button>
    </div>


const mapStateToProps = ({animations}) => ({
    text: animations.state.test_state.text,
    style: animations.state.test_state.style,
})

const mapDispatchToProps = (dispatch) => ({
    clearAnimations: () => {
        dispatch({type: 'CLEAR_ANIMATIONS'})
    },
    animateFirstState: () => {
        dispatch({type: 'ADD_ANIMATION', animation: Become({
            path: '/test_state/text',
            state: '1st state',
        })})
    },
    animateSecondState: () => {
        dispatch({type: 'ADD_ANIMATION', animation: Become({
            path: '/test_state/text',
            state: '2nd state',
        })})
    },
    animateGreen: () => {
        dispatch({type: 'ADD_ANIMATION', animation: Become({
            path: '/test_state/style/color',
            state: 'green',
        })})
    },
    animateRed: () => {
        dispatch({type: 'ADD_ANIMATION', animation: Become({
            path: '/test_state/style/color',
            state: 'red',
        })})
    },
    animateMove: () => {
        dispatch({type: 'ADD_ANIMATION', animation: Translate({
            path: '/test_state',
            start_state: {top: 0, left: 0},
            end_state: {top: 100, left: 100},
            duration: 3000,
            unit: 'px',
        })})
    },
    animateRotate: () => {
        dispatch({type: 'ADD_ANIMATION', animation: Repeat(Animate({
            path: '/test_state/style/transform/rotate',
            start_state: 0,
            end_state: 360,
            duration: 3000,
            curve: 'linear',
            unit: 'deg',
        }), 3)})
    },
    animatePulse: () => {
        dispatch({type: 'ADD_ANIMATION', animation: AnimateCSS({
            path: '/test_state',
            name: 'pulse',
            duration: 2000,
        })})
    },
    animateBlink: () => {
        dispatch({type: 'ADD_ANIMATION', animation: Repeat(AnimateCSS({
            path: '/test_state',
            name: 'blinker',
            duration: 1000,
        }), Infinity)})
    },
    animateStopBlink: () => {
        dispatch({type: 'ADD_ANIMATION', animation: AnimateCSS({
            path: '/test_state',
            name: null,
            duration: Infinity,
        })})
    },
})

export const AnimationTester = connect(
    mapStateToProps,
    mapDispatchToProps,
)(AnimationTesterComponent)
