import React from 'react'
import {Button} from 'react-bootstrap'

import {connect} from 'react-redux'


const AnimationControlsComponent = ({speed, current_timestamp, setTimeWarp, debug=false}) =>
    <div className="animation-controls" style={{textAlign: 'center', paddingTop: '10px', position: 'relative'}}>
        {debug ? <small style={{opacity: 0.2, position: 'absolute', top: -15, right: 5}}>controls.js</small>: null}

        Speed of Time: {speed} | 🕐 {current_timestamp}<br/>
        Reverse ⏪
        <input
            type="range"
            onChange={(e) => setTimeWarp(e.target.value)}
            min={-2}
            max={2}
            step={0.01}
            value={speed}
            style={{width: '70%', height: '10px', display: 'inline'}}/>
        ⏩ Forward
        <br/>
        <Button onClick={setTimeWarp.bind(this, -100)}>-100x</Button> &nbsp;
        <Button onClick={setTimeWarp.bind(this, -10)}>-10x</Button> &nbsp;
        <Button onClick={setTimeWarp.bind(this, -1)}>-1x</Button> &nbsp;
        <Button onClick={setTimeWarp.bind(this, -0.1)}>-0.1x</Button> &nbsp;
        <Button onClick={setTimeWarp.bind(this, -0.01)}>-0.01x</Button> &nbsp;
        <Button bsStyle="danger" onClick={setTimeWarp.bind(this, 0)}>⏸</Button> &nbsp;
        <Button bsStyle="success" onClick={setTimeWarp.bind(this, 1)}>▶️</Button> &nbsp;
        <Button onClick={setTimeWarp.bind(this, 0.01)}>+0.01x</Button> &nbsp;
        <Button onClick={setTimeWarp.bind(this, 0.1)}>+0.1x</Button> &nbsp;
        <Button onClick={setTimeWarp.bind(this, 1)}>1x</Button> &nbsp;
        <Button onClick={setTimeWarp.bind(this, 10)}>+10x</Button> &nbsp;
        <Button onClick={setTimeWarp.bind(this, 100)}>+100x</Button>
    </div>


const mapStateToProps = ({animations}) => ({
    speed: animations.speed,
    current_timestamp: animations.current_timestamp,
})

const mapDispatchToProps = (dispatch) => ({
    setTimeWarp: (speed) => {
        dispatch({type: 'SET_ANIMATION_SPEED', speed})
    },
})

export const AnimationControls = connect(
    mapStateToProps,
    mapDispatchToProps,
)(AnimationControlsComponent)
