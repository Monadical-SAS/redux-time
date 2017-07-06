import React from 'react'
import {Button} from 'react-bootstrap'

import {connect} from 'react-redux'


const AnimationControlsComponent = ({animations, setTimeWarp}) =>
    <div className="animation-controls" style={{textAlign: 'center', marginTop: '10px'}}>
        Speed of Time: {animations.speed} | 🕐 {animations.current_timestamp}<br/>
        Reverse &lt;
        <input
            type="range"
            onChange={(e) => setTimeWarp(e.target.value)}
            min={-2}
            max={2}
            step={0.01}
            value={animations.speed}
            style={{width: '70%', height: '10px', display: 'inline'}}/>
        &gt; Forward
        <br/>
        <Button onClick={setTimeWarp.bind(this, -100)}>-100x</Button> &nbsp;
        <Button onClick={setTimeWarp.bind(this, -10)}>-10x</Button> &nbsp;
        <Button onClick={setTimeWarp.bind(this, -1)}>-1x</Button> &nbsp;
        <Button onClick={setTimeWarp.bind(this, -0.1)}>-0.1x</Button> &nbsp;
        <Button onClick={setTimeWarp.bind(this, -0.01)}>-0.01x</Button> &nbsp;
        <Button onClick={setTimeWarp.bind(this, 0)}>Pause</Button> &nbsp;
        <Button onClick={setTimeWarp.bind(this, 0.01)}>+0.01x</Button> &nbsp;
        <Button onClick={setTimeWarp.bind(this, 0.1)}>+0.1x</Button> &nbsp;
        <Button onClick={setTimeWarp.bind(this, 1)}>1x</Button> &nbsp;
        <Button onClick={setTimeWarp.bind(this, 10)}>+10x</Button> &nbsp;
        <Button onClick={setTimeWarp.bind(this, 100)}>+100x</Button>
    </div>


const mapStateToProps = ({animations}) => ({
    animations,
    state: animations.state,
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
