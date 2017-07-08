import React from 'react'
import {Button} from 'react-bootstrap'

import {connect} from 'react-redux'

import {TimeControlsComponent} from 'warped-time'


const mapStateToProps = ({animations}) => ({
    speed: animations.speed,
    current_timestamp: animations.current_timestamp,
    last_timestamp: animations.last_timestamp,
})

const mapDispatchToProps = (dispatch) => ({
    setSpeed: (speed) => {
        dispatch({type: 'SET_ANIMATION_SPEED', speed})
    },
})

export const AnimationControls = connect(
    mapStateToProps,
    mapDispatchToProps,
)(TimeControlsComponent)
