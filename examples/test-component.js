import React from 'react'
import {Button} from 'react-bootstrap'
import {connect} from 'react-redux'

import {ExpandableSection} from 'monadical-react-components'

import {Become, Repeat, Animate, Translate, AnimateCSS} from '../src/animations.js'


const SOURCE = "https://github.com/Monadical-SAS/redux-time/blob/master/examples/test-component.js"

const base_style = {
    width: 200,
    margin: 'auto',
    overflow: 'hidden',
    border: '1px dashed red',
    backgroundColor: 'orange',
}

const AnimationTesterComponent = ({getTime, text, style, animateFirstState, animateSecondState, animateGreen, animateRed, animateMove, animateRotate, animatePulse, animateBlink, animateBlinkStop, clearAnimations, debug}) =>
    <ExpandableSection name="Animation Test" source={debug && SOURCE} expanded>
        <pre style={{...base_style, ...style}}>
            <br/>
            {text}
            <br/><br/>
        </pre><br/>
        <Button title="Instant state change" onClick={animateFirstState.bind(this, getTime())}>1st state</Button>
        <Button title="Instant state change" onClick={animateSecondState.bind(this, getTime())}>2nd state</Button>
        <Button title="Instant state change" onClick={animateGreen.bind(this, getTime())}>Green</Button>
        <Button title="Instant state change" onClick={animateRed.bind(this, getTime())}>Red</Button>
        <Button title="Instant state change" onClick={animateMove.bind(this, getTime())}>Move</Button>
        <Button title="Javascript animation" onClick={animateRotate.bind(this, getTime())}>Rotate 3x</Button>
        <Button title="Javascript animation" onClick={animatePulse.bind(this, getTime())}>Pulse</Button>
        <Button title="CSS keyframe animation" onClick={animateBlink.bind(this, getTime())}>Blink Forever</Button>
        <Button title="CSS keyframe animation" onClick={animateBlinkStop.bind(this, getTime())}>Stop Blinking</Button>
        <Button onClick={clearAnimations}>Reset</Button>
    </ExpandableSection>


const mapStateToProps = ({animations}) => ({
    text: animations.state.test_state.text,
    style: animations.state.test_state.style,
})

const mapDispatchToProps = (dispatch) => ({
    clearAnimations: () => {
        dispatch({type: 'CLEAR_ANIMATIONS'})
    },
    animateFirstState: (start_time) => {
        dispatch({type: 'ADD_ANIMATION', animation: Become({
            path: '/test_state/text',
            state: '1st state',
            start_time,
        })})
    },
    animateSecondState: (start_time) => {
        dispatch({type: 'ADD_ANIMATION', animation: Become({
            path: '/test_state/text',
            state: '2nd state',
            start_time,
        })})
    },
    animateGreen: (start_time) => {
        dispatch({type: 'ADD_ANIMATION', animation: Become({
            path: '/test_state/style/color',
            state: 'green',
            start_time,
        })})
    },
    animateRed: (start_time) => {
        dispatch({type: 'ADD_ANIMATION', animation: Become({
            path: '/test_state/style/color',
            state: 'red',
            start_time,
        })})
    },
    animateMove: (start_time) => {
        dispatch({type: 'ADD_ANIMATION', animation: Translate({
            path: '/test_state',
            start_state: {top: 0, left: 0},
            end_state: {top: 100, left: 100},
            duration: 3000,
            unit: 'px',
            start_time,
        })})
    },
    animateRotate: (start_time) => {
        dispatch({type: 'ADD_ANIMATION', animation: Repeat(Animate({
            path: '/test_state/style/transform/rotate',
            start_state: 0,
            end_state: 360,
            duration: 3000,
            curve: 'linear',
            unit: 'deg',
            start_time,
        }), 3)})
    },
    animatePulse: (start_time) => {
        dispatch({type: 'ADD_ANIMATION', animation: AnimateCSS({
            path: '/test_state',
            name: 'pulse',
            duration: 2000,
            start_time,
        })})
    },
    animateBlink: (start_time) => {
        dispatch({type: 'ADD_ANIMATION', animation: Repeat(AnimateCSS({
            path: '/test_state',
            name: 'blinker',
            duration: 1000,
            start_time,
        }), Infinity)})
    },
    animateBlinkStop: (start_time) => {
        dispatch({type: 'ADD_ANIMATION', animation: Become({
            path: '/test_state/style/animation/blinker',
            state: null,
            start_time,
        })})
    },
})

export const AnimationTester = connect(
    mapStateToProps,
    mapDispatchToProps,
)(AnimationTesterComponent)
