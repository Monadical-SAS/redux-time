import React from 'react'
import {Button} from 'react-bootstrap'

import {connect} from 'react-redux'

import {prettyJSON} from './util.js'

import {pastAnimations, currentAnimations, futureAnimations, sortedAnimations, uniqueAnimations, activeAnimations} from './reducers.js'
import {Become, Repeat, Animate, Translate, AnimateCSS} from './animations.js'


String.prototype.ljust = function(width, padding) {
    padding = padding || " ";
    padding = padding.substr(0, 1);
    if (this.length < width)
        return this + padding.repeat(width - this.length);
    else
        return this + '';
}


export const AnimationControlsComponent = ({state, animations, setTimeWarp, full_state=true}) => {
    const active_anims = activeAnimations(animations.queue, animations.current_timestamp, animations.last_timestamp)

    let state_section = null
    if (full_state) {
        const past_anims = pastAnimations(animations.queue, animations.current_timestamp, animations.last_timestamp)
        const current_anims = currentAnimations(animations.queue, animations.current_timestamp, animations.last_timestamp)
        const future_anims = futureAnimations(animations.queue, animations.current_timestamp, animations.last_timestamp)
        state_section = <div>
            {state.test_state &&
                <div>
                    <pre style={{width: 200, margin: 'auto', overflow: 'hidden', ...state.test_state.style}}>
                        <br/>
                        {state.test_state.text}
                        <br/><br/>
                    </pre><br/>
                    <Button onClick={() => window.store.dispatch({type: 'ADD_ANIMATION', animation: Become({path: '/test_state/text', state: '1st state', start_time: window.animations.time.getWarpedTime()})})}>1st state</Button>
                    <Button onClick={() => window.store.dispatch({type: 'ADD_ANIMATION', animation: Become({path: '/test_state/text', state: '2nd state', start_time: window.animations.time.getWarpedTime()})})}>2nd state</Button>
                    <Button onClick={() => window.store.dispatch({type: 'ADD_ANIMATION', animation: Become({path: '/test_state/style/color', state: 'green', start_time: window.animations.time.getWarpedTime()})})}>Green</Button>
                    <Button onClick={() => window.store.dispatch({type: 'ADD_ANIMATION', animation: Become({path: '/test_state/style/color', state: 'red', start_time: window.animations.time.getWarpedTime()})})}>Red</Button>
                    <Button onClick={() => window.store.dispatch({type: 'ADD_ANIMATION', animation: Translate({path: '/test_state', start_state: {top: 0, left: 0}, end_state: {top: 100, left: 100}, start_time: window.animations.time.getWarpedTime(), duration: 3000, unit: 'px'})})}>Move</Button>
                    <Button onClick={() => window.store.dispatch({type: 'ADD_ANIMATION', animation: Repeat(Animate({path: '/test_state/style/transform/rotate', start_state: 0, end_state: 360, start_time: window.animations.time.getWarpedTime(), duration: 3000, curve: 'linear', unit: 'deg'}), 3)})}>Rotate 3x</Button>
                    <Button onClick={() => window.store.dispatch({type: 'ADD_ANIMATION', animation: AnimateCSS({path: '/test_state', name: 'pulse', start_time: window.animations.time.getWarpedTime(), duration: 2000})})}>Pulse</Button>
                    <Button onClick={() => window.store.dispatch({type: 'ADD_ANIMATION', animation: Repeat(AnimateCSS({path: '/test_state', name: 'blinker', start_time: window.animations.time.getWarpedTime(), duration: 1000}), Infinity)})}>Blink Forever</Button>
                    <Button onClick={() => window.store.dispatch({type: 'ADD_ANIMATION', animation: AnimateCSS({path: '/test_state', name: null, start_time: window.animations.time.getWarpedTime(), duration: Infinity})})}>Stop Blinking</Button>
                    <br/><hr/>
                </div>}
            <pre height="200" style={{width: '100%', display: 'inline-block', verticalAlign: 'top', textAlign: 'left'}}>
                <b>Active ({active_anims.length})</b><br/>
                {active_anims.map(a => `${a.start_time.toFixed(0).ljust(5)}->${a.end_time.toFixed(0).ljust(5)} ${a.source_type}:${a.type} /${a.path.split('/').slice(-1)[0].slice(0,10).ljust(10)} ${JSON.stringify(a.amt || a.state).slice(0,10).ljust(10)} ${JSON.stringify(a)}`).join('\n')}
            </pre>
            <pre height="200" style={{width: '33%', display: 'inline-block', verticalAlign: 'top'}}>
                <b>Past ({past_anims.length})</b><br/>
                {past_anims.map(a => `${a.source_type}:${a.type} ${Math.round(a.start_time)}->${Math.round(a.end_time)} ${JSON.stringify(a.amt || a.state)} ${a.path.split('/').splice(-1)} ${JSON.stringify(a.path)}`).join('\n')}
            </pre>
            <pre height="200" style={{width: '33%', display: 'inline-block', verticalAlign: 'top'}}>
                <b>Current ({current_anims.length})</b><br/>
                {current_anims.map(a => `${a.source_type}:${a.type} ${Math.round(a.start_time)}->${Math.round(a.end_time)} ${JSON.stringify(a.amt || a.state)} ${a.path.split('/').splice(-1)} ${JSON.stringify(a.path)}`).join('\n')}
            </pre>
            <pre height="200" style={{width: '33%', display: 'inline-block', verticalAlign: 'top'}}>
                <b>Future ({future_anims.length})</b><br/>
                {future_anims.map(a => `${a.source_type}:${a.type} ${Math.round(a.start_time)}->${Math.round(a.end_time)} ${JSON.stringify(a.amt || a.state)} ${a.path.split('/').splice(-1)} ${JSON.stringify(a.path)}`).join('\n')}
            </pre>
            <pre height="200" style={{textAlign: 'left'}}><b>State</b><br/>{prettyJSON(animations.state)}</pre>
        </div>
    }

    return <div className="animation-controls" style={{textAlign: 'center', marginTop: '20px'}}>
        <h1>Redux-Time Demo</h1><br/>

        Speed: {animations.speed} | {animations.current_timestamp}<br/>
        Reverse &lt; <input type="range" onChange={(e) => setTimeWarp(e.target.value)} min={-2} max={2} step={0.01} value={animations.speed} style={{width: '70%', height: '10px', display: 'inline'}}/> &gt; Forward<br/>
        <Button onClick={setTimeWarp.bind(this, -10)}>-10x</Button> &nbsp;
        <Button onClick={setTimeWarp.bind(this, -1)}>-1x</Button> &nbsp;
        <Button onClick={setTimeWarp.bind(this, -0.1)}>-0.1x</Button> &nbsp;
        <Button onClick={setTimeWarp.bind(this, 0)}>Pause</Button> &nbsp;
        <Button onClick={setTimeWarp.bind(this, 0.01)}>+0.01x</Button> &nbsp;
        <Button onClick={setTimeWarp.bind(this, 0.1)}>+0.1x</Button> &nbsp;
        <Button onClick={setTimeWarp.bind(this, 1)}>1x</Button>
        <Button onClick={setTimeWarp.bind(this, 10)}>+10x</Button>
        <br/><br/>
        {state_section}
    </div>
}


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
