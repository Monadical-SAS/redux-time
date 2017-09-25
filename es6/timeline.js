import React from "react";
import {connect} from 'react-redux'
import {ExpandableSection} from 'monadical-react-components'

const SOURCE = "https://github.com/Monadical-SAS/redux-time/blob/master/es6/timeline.js"
const COMPONENT_HEIGHT = 320

const page_start_time = Date.now()

const offset = (time) =>
    time - page_start_time

const getCssProperty = (elmId, property) => {
   const elem = document.getElementById(elmId)
   return elem ?
          window.getComputedStyle(elem,null).getPropertyValue(property)
          : 0
}

const current_width = () => {
    const elem = document.getElementById("animations_container")
    return elem ? elem.getBoundingClientRect().width : 1
}

const current_frame_position = () => {
    const left_property = getCssProperty("current_frame", "left")
    const left = typeof(left_property) === "number" ?
                 left_property
                 : Number(left_property.replace("px", ""))
    return left
}

const AnimRow = ({anim, idx, scale, warped_time}) => {
    const {type, start_time, end_time} = anim

    const is_infinite = end_time === Infinity
    const left = offset(start_time)/scale
    const warped_time_left = offset(warped_time)/scale

    let width = current_width()
    width = warped_time_left < width ?
            (width - left)
            : warped_time_left - left

    const style = {
        position: 'absolute',
        top: (idx * 27) % (COMPONENT_HEIGHT - 70),
        left: left,
        height: 20,
        width: is_infinite ?
                width
                : (end_time - start_time)/scale,
        zIndex: is_infinite ?
                0
                : 1,
        backgroundColor: type.includes('BECOME') ? 'gray' : 'red',
        border: 'solid 1px black',
        overflow: 'hidden',
    }

    const className = is_infinite ? "infinite" : ""

    return <div className={`anim ${className}`} style={style}>
            {type}
            <br/>
            <div className="anim_details">
                Path: {`${anim.path}`}<br/>
                Start time: {`${anim.start_time}`}<br/>
                End time: {`${anim.end_time}`}<br/>
                Start state: {JSON.stringify(anim.start_state, null, 1)}<br/>
                End state: {JSON.stringify(anim.end_state, null, 1)}<br/>
                Curve: {`${anim.curve}`}<br/>
            </div>
        </div>
}

const CurrentFrame = ({warped_time, scale}) => {

    const style = {
        position: 'absolute',
        top: 10,
        left: (offset(warped_time) / scale) - 1,
        height: 280,
        width: 1,
        zIndex: 2,
        backgroundColor: 'blue',
    }

    return <div id="current_frame" style={style}></div>
}

const SecondsMarker = ({scale}) => {
    const seconds = []
    const second_in_pixels = (1000/scale)
    const total = current_width()
    for (let incr = second_in_pixels; incr < total; incr = incr + second_in_pixels) {
        seconds.push(
            <span style={{left: incr, position: "absolute"}}>
                |{Math.round(incr/second_in_pixels)}
            </span>)
    }
    return <div style={{width: total,
                        position: "relative",
                        top: COMPONENT_HEIGHT - 40}}>
               {seconds}
            </div>
}

class TimelineComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            scale: 25,
        }
    }

    changeScale(new_scale) {
        this.setState({
            scale: 50 - new_scale,
        })
    }

    render() {
        const {queue, warped_time, debug} = this.props
        const anim_list = []
        let container_width = 0
        for (let idx = 0; idx < queue.length; idx++){
            anim_list.push(
                <AnimRow
                    anim={queue[idx]}
                    idx={idx}
                    scale={this.state.scale}
                    warped_time={warped_time}
                />
            )
            const end_time = queue[idx].end_time
            if (end_time !== Infinity){
                const last_time = offset(end_time)/this.state.scale
                container_width = last_time > container_width ?
                                  last_time
                                  : container_width
            }
        }
        const frame_position = current_frame_position()
        if (frame_position > container_width){
            container_width = frame_position
        }

        return <ExpandableSection name="Animations Timeline" source={debug && SOURCE} expanded>
            <style>{`
                .anim_details {
                    display: none;
                }

                .anim:hover .anim_details {
                    display: inline-block;
                }
                .anim:hover {
                    height: auto !important;
                    z-index: 10 !important;
                }
                .anim:hover:not(.infinite){
                    min-width: 200px !important;
                }
                .section-animations-timeline{
                    z-index: 1;
                }

                `}
            </style>
            <div style={{width: '100%', height: 'auto', postion: 'relative'}}>
                <div style={{width: '70%', display: 'block',
                    marginLeft: 'auto', marginRight: 'auto'}}>
                    Zoom 🔍
                    <input type="range"
                           min="0"
                           max="50"
                           step="0.1"
                           onChange={(e) => this.changeScale(Number(e.target.value))}
                           value={50 - this.state.scale}
                           style={{
                               height: '10px', display: 'block',
                               width: "100%",
                           }}
                    />
                </div>
            </div>
            <div style={{width: '100%', height: `${COMPONENT_HEIGHT}px`,
                         overflowX: 'scroll', position: 'relative'}}>
                <div id="animations_container" style={{
                    position: 'relative',
                    width: container_width,
                    minWidth: "100%"
                }}>
                    {anim_list}
                    <CurrentFrame warped_time={warped_time} scale={this.state.scale}/>
                    <SecondsMarker scale={this.state.scale}/>
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
