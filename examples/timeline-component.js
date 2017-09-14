import {connect} from 'react-redux'

import {Become, Animate} from "../../es6/animations.js";
import {activeAnimations} from "../../es6/reducers.js";

const TimelineComponent = ({active_animations, state}) =>
    <div>
        <p>{active_animations}</p>
        <p>{state}</p>
    </div>

const mapStateToProps = ({animations}) => ({
    active_animations: activeAnimations({
        queue: animations.queue,
        warped_time: animations.warped_time,
        former_time: animations.former_time,
    }),
    state: animations,
})

export const Timeline = connect(
    mapStateToProps,
)(TimelineComponent)
