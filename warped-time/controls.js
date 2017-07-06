import React from 'react'
import {Button} from 'react-bootstrap'

export const TimeControlsComponent = ({current_timestamp, speed, setSpeed, debug}) => {
    return <div>
        {debug ? <small style={{opacity: 0.2, position: 'absolute', top: -15, right: 5}}>controls.js</small>: null}

        Speed of Time: {speed} | 🕐 {current_timestamp}<br/>
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
    </div>
}


export class TimeControls extends React.Component {
    constructor(props) {
        super(props)
        this.time = this.props.time || window.time
        this.state = {
            speed: this.time.speed,
            current_timestamp: this.time.getWarpedTime()
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
        this.setState({current_timestamp: this.props.time.getWarpedTime()})
        if (this.animating)
            window.requestAnimationFrame(::this.tick)
    }
    setSpeed(speed) {
        this.time.setSpeed(speed)
        this.setState({...this.state, speed})
    }
    render() {
        return <TimeControlsComponent
            speed={this.state.speed}
            current_timestamp={this.state.current_timestamp}
            setSpeed={::this.setSpeed}
            debug={this.props.debug}/>
    }
}
