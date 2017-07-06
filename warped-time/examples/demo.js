import React from 'react'
import ReactDOM from 'react-dom'

import {WarpedTime} from '../main.js'
import {TimeControls} from '../controls.js'

window.time = new WarpedTime()

ReactDOM.render(
    <TimeControls time={window.time} debug expanded/>,
    document.getElementById('react'),
)
