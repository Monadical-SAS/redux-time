import React from "react";
import {connect} from 'react-redux'
import {ExpandableSection} from 'monadical-react-components'

const SOURCE = "https://github.com/Monadical-SAS/redux-time/blob/master/es6/timeline.js"
const COMPONENT_HEIGHT = 320

const page_start_time = Date.now()

const offset = (time) =>
    time - page_start_time


const AnimRow = (anim, idx, scale) => {
    const {type, start_time, end_time} = anim

    const style = {
        position: 'absolute',
        top: (idx * 25) % (COMPONENT_HEIGHT - 70),
        left: offset(start_time)/scale,
        height: 20,
        width: end_time !== Infinity ?
                (end_time - start_time)/scale
                : 10,
        backgroundColor: type.includes('BECOME') ? 'gray' : 'red',
        border: 'solid 1px black',
        overflow: 'hidden',
    }

    return <div className="anim" style={style}>
            {type}
            <br/>
            <div className="anim_details">
                Start time: {`${anim.start_time}`}<br/>
                End time: {`${anim.end_time}`}<br/>
                Start state: {JSON.stringify(anim.start_state)}<br/>
                End state: {JSON.stringify(anim.end_state)}<br/>
                Curve: {`${anim.curve}`}<br/>
            </div>
        </div>
}

const CurrentFrame = ({warped_time, scale}) => {

    const style = {
        position: 'absolute',
        top: COMPONENT_HEIGHT - 70,
        left: (offset(warped_time) / scale) - 1,
        height: 20,
        color: 'blue',
    }

    return <div style={style}>|</div>
}

class TimelineComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            scale: 50,
        }
    }

    changeScale(new_scale) {
        this.setState({
            scale: 50 - new_scale,
        })
    }

    render() {
        const {queue, warped_time, debug} = this.props
        return <ExpandableSection name="Animations Timeline" source={debug && SOURCE} expanded>
            <style>{`
                .anim_details {
                    display: none;
                }

                .anim:hover .anim_details {
                    display: inline-block;
                }
                .anim:hover {
                    min-width: 200px !important;
                    height: auto !important;
                    z-index: 1001;
                }
                .section-animations-timeline{
                    z-index: 1;
                }

                `}
            </style>
            <div style={{width: '100%', height: `${COMPONENT_HEIGHT}px`,
                         overflow: 'scroll', position: 'relative'}}>

                <div style={{width: '100%', height: 'auto', postion: 'relative'}}>
                    <div style={{width: '70%', display: 'block',
                        marginLeft: 'auto', marginRight: 'auto'}}>
                        Zoom 🔍
                        <input type="range"
                               min="0"
                               max="50"
                               step="0.5"
                               onChange={(e) => this.changeScale(Number(e.target.value))}
                               value={50 - this.state.scale}
                               style={{
                                   height: '10px', display: 'block',
                                   width: "100%",
                               }}
                        />
                    </div>
                </div>
                <div style={{position: 'relative'}}>
                    {queue.map((anim, idx) => AnimRow(anim, idx, this.state.scale))}
                    <CurrentFrame warped_time={warped_time} scale={this.state.scale}/>
                </div>
            </div>
        </ExpandableSection>
    }
}

const mapStateToProps = ({animations}) => ({
    queue: animations.queue,
    warped_time: animations.warped_time,
    former_time: animations.former_time,
})

export const AnimationTimeline = connect(
    mapStateToProps,
)(TimelineComponent)
