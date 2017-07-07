import React from 'react'
import {Button} from 'react-bootstrap'

import {ExpandableSection} from './section.js'


const SOURCE = "https://github.com/Monadical-SAS/redux-time/blob/master/warped-time/controls.js"


const FPS = (speed, current_timestamp, last_timestamp) =>
    Math.round((speed * 1000)/(current_timestamp - last_timestamp)) || 0


export const TimeControlsComponent = ({current_timestamp, last_timestamp, speed, setSpeed, debug, expanded}) => {
    return <ExpandableSection name="Time Controls" source={debug && SOURCE} expanded={expanded}>
        Speed of Time: {speed}x |
        Warped 🕐 {Math.round(current_timestamp, 0)} |
        Actual 🕰 {(new Date).getTime()} {speed == 0 ? '(updating paused)' : ''} |&nbsp;
        {FPS(speed, current_timestamp, last_timestamp)} FPS
        <br/>
        Reverse ⏪
        <input
            type="range"
            onChange={(e) => setSpeed(e.target.value)}
            min={-2}
            max={2}
            step={0.01}
            value={speed}
            style={{width: '70%', height: '10px', display: 'inline'}}/>
        ⏩ Forward
        <br/>
        <Button onClick={setSpeed.bind(this, -100)}>-100x</Button> &nbsp;
        <Button onClick={setSpeed.bind(this, -10)}>-10x</Button> &nbsp;
        <Button onClick={setSpeed.bind(this, -1)}>-1x</Button> &nbsp;
        <Button onClick={setSpeed.bind(this, -0.1)}>-0.1x</Button> &nbsp;
        <Button onClick={setSpeed.bind(this, -0.01)}>-0.01x</Button> &nbsp;
        <Button bsStyle="danger" onClick={setSpeed.bind(this, 0)}>⏸</Button> &nbsp;
        <Button bsStyle="success" onClick={setSpeed.bind(this, 1)}>▶️</Button> &nbsp;
        <Button onClick={setSpeed.bind(this, 0.01)}>+0.01x</Button> &nbsp;
        <Button onClick={setSpeed.bind(this, 0.1)}>+0.1x</Button> &nbsp;
        <Button onClick={setSpeed.bind(this, 1)}>1x</Button> &nbsp;
        <Button onClick={setSpeed.bind(this, 10)}>+10x</Button> &nbsp;
        <Button onClick={setSpeed.bind(this, 100)}>+100x</Button>
    </ExpandableSection>
}

// auto-self-updating TimeControls component using requestAnimationFrame
export class TimeControls extends React.Component {
    constructor(props) {
        super(props)
        this.time = this.props.time || window.time
        this.state = {
            speed: this.time.speed,
            current_timestamp: this.time.getWarpedTime(),
            last_timestamp: this.time.getWarpedTime() - 20,
        }
    }
    componentDidMount() {
        this.animating = true
        this.tick()
    }
    componentWillUnmount() {
        this.animating = false
    }
    tick() {
        this.setState({
            current_timestamp: this.props.time.getWarpedTime(),
            last_timestamp: this.state.current_timestamp,
        })
        if (this.animating) {
            window.requestAnimationFrame(::this.tick)
        }
    }
    setSpeed(speed) {
        this.time.setSpeed(speed)
        this.setState({...this.state, speed})
    }
    render() {
        return <TimeControlsComponent
            speed={this.state.speed}
            current_timestamp={this.state.current_timestamp}
            last_timestamp={this.state.last_timestamp}
            setSpeed={::this.setSpeed}
            debug={this.props.debug}
            expanded={this.props.expanded}/>
    }
}
