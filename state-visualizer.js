import React from 'react'

import {connect} from 'react-redux'

import {
    pastAnimations,
    currentAnimations,
    futureAnimations,
    sortedAnimations,
    activeAnimations,
} from './reducers.js'


const AnimationList = ({animations, verbose=true, style}) =>
    <table style={{width: '100%', minWidth: '1500px', fontSize: '85%', overflow: 'scroll', ...(style || {})}}>
        <tbody>
            <tr style={{borderBottom: '1px solid #f0f0f0', lineHeight: '20px', fontWeight: 900}}>
                <td>Type</td>
                <td>Path</td>
                <td>Start</td>
                {verbose ? <td>End</td> : null}
                <td>Duration</td>
                {verbose ? <td>From State</td> : null}
                <td>To State</td>
            </tr>
            {animations.map(anim =>
                <tr>
                    <td>{anim.type}</td>
                    <td>/{anim.path.split('/').slice(-1)[0]}</td>
                    <td>{Math.round(anim.start_time)}</td>
                    {verbose ? <td>{Math.round(anim.end_time)}</td> : null}
                    <td>{Math.round(anim.duration)}</td>
                    {verbose ? <td>{anim.start_state !== undefined ? JSON.stringify(anim.start_state) : ''}</td> : null}
                    <td>{anim.end_state !== undefined ? JSON.stringify(anim.end_state) : JSON.stringify(anim.state)}</td>
                </tr>)}
        </tbody>
    </table>

const source_tag = <small style={{opacity: 0.2, position: 'absolute', top: -15, right: 5}}>
    <a href="https://github.com/Monadical-SAS/redux-time/blob/master/state-visualizer.js">state-visualizer.js</a>
</small>


const AnimationStateVisualizerComponent = ({animations, path, debug}) => {
    const {queue, current_timestamp, last_timestamp} = animations
    const active_anims = activeAnimations(queue, current_timestamp, last_timestamp)

    const past_anims = sortedAnimations(pastAnimations(queue, current_timestamp, last_timestamp))
    const current_anims = sortedAnimations(currentAnimations(queue, current_timestamp, last_timestamp))
    const future_anims = sortedAnimations(futureAnimations(queue, current_timestamp, last_timestamp))

    const col_style = {width: '32.5%', display: 'inline-block', verticalAlign: 'top'}
    return <div style={{position: 'relative'}}>
        {debug ? source_tag : null}
        <pre height="200" style={{width: '98%', display: 'inline-block', verticalAlign: 'top', textAlign: 'left', overflow: 'scroll'}}>
            <b>Active Animations ({active_anims.length})</b><br/>
            <AnimationList animations={active_anims} style={{width: '100%'}}/>
        </pre>
        <pre height="200" style={col_style}>
            <b>Past ({past_anims.length})</b><br/>
            <AnimationList animations={past_anims} verbose={false}/>
        </pre>
        <pre height="200" style={col_style}>
            <b>Current ({current_anims.length})</b><br/>
            <AnimationList animations={current_anims} verbose={false}/>
        </pre>
        <pre height="200" style={col_style}>
            <b>Future ({future_anims.length})</b><br/>
            <AnimationList animations={future_anims} verbose={false}/>
        </pre>
        <pre height="200" style={{textAlign: 'left'}}>
            <b>Animated State {path ? `(animations.state.${path})` : ''}</b><br/>
            {JSON.stringify(path ? animations.state[path] : animations.state, null, 4)}
        </pre>
    </div>
}

const mapStateToProps = ({animations}) => ({
    animations,
})

export const AnimationStateVisualizer = connect(
    mapStateToProps,
)(AnimationStateVisualizerComponent)
