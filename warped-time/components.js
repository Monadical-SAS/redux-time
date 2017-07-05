import React from 'react'


export class WarpedTimeTicker extends React.Component {
    componentDidMount() {
        this.interval = setInterval(::this.forceUpdate, 50)
    }
    componentWillUnmount() {
        clearTimeout(this.interval)
    }
    render() {
        const time = this.props.time || window.time
        return <span>{time && time.getWarpedTime()}</span>
    }
}
