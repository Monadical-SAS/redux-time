import React from 'react'

import {connect} from 'react-redux'
import {TimeControlsComponent} from 'warped-time'


const mapStateToProps = ({animations}) => ({
    speed: animations.speed,
    warped_time: animations.warped_time,
    former_time: animations.former_time,
})

const mapDispatchToProps = (dispatch) => ({
	setTime: (warped_time) => {
		dispatch({type: 'SET_WARPED_TIME', warped_time})
	},
    setSpeed: (speed) => {
        dispatch({type: 'SET_SPEED', speed})
    },
})

export const AnimationControls = connect(
    mapStateToProps,
    mapDispatchToProps,
)(TimeControlsComponent)
