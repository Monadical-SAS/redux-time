import {connect} from 'react-redux'
import {ExpandableSection} from 'monadical-react-components'

const SOURCE = "https://github.com/Monadical-SAS/redux-time/blob/master/examples/test-component.js"
const COMPONENT_HEIGHT = 200

const page_start_time = Date.now()
const scale = 50                     // 20px = 1sec

const offset = (time) =>
    time - page_start_time


const AnimRow = (anim, idx) => {
    const {type, start_time, end_time} = anim

    const style = {
        position: 'absolute',
        top: (idx * 25) % (COMPONENT_HEIGHT - 20),
        left: offset(start_time)/scale,
        height: 20,
        width: end_time !== Infinity ?
                (end_time - start_time)/scale
                : 10,
        backgroundColor: type.includes('BECOME') ? 'gray' : 'red',
        border: 'solid 1px black',
        overflow: 'hidden',
    }

    return <div style={style}>{type}</div>
}

const CurrentFrame = ({warped_time, former_time}) => {

    const style = {
        position: 'absolute',
        top: COMPONENT_HEIGHT - 20,
        left: offset(former_time) / scale,
        height: 20,
        width: '30px',
        color: 'blue',
    }

    return <div style={style}>&gt;|</div>
}

const TimelineComponent = ({queue, warped_time, former_time, debug}) =>
    <ExpandableSection style={{overflow: "auto"}} name="Animations Timeline" source={debug && SOURCE} expanded>
        <div style={{width: '100%', height: `${COMPONENT_HEIGHT}px`, position: 'relative', overflow: 'scroll'}}>
            {queue.map(AnimRow)}
            <CurrentFrame warped_time={warped_time} former_time={former_time}/>
        </div>
    </ExpandableSection>

const mapStateToProps = ({animations}) => ({
    queue: animations.queue,
    warped_time: animations.warped_time,
    former_time: animations.former_time,
})

export const Timeline = connect(
    mapStateToProps,
)(TimelineComponent)
