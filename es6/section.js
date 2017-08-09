import React from 'react'


export class ExpandableSection extends React.Component {
    constructor(props) {
        super(props)
        this.state = {expanded: props.expanded}
    }
    toggleSection() {
        this.setState({expanded: !this.state.expanded})
    }
    render() {
        const {name, source, children} = this.props
        const {expanded} = this.state
        const classname = name.replace(' ', '-').toLowerCase()

        return <div className={`section-${classname}`} style={{position: 'relative', minHeight: 25}}>
            <hr/>
            {source ?
                <small style={{opacity: 0.2, position: 'absolute', top: 3, right: 5}}>
                    <a href={source}>{source.split('/master/').slice(-1)[0]}</a>
                </small> : null}

            <a href={`#${classname}`} onClick={::this.toggleSection} name={classname}>
                <h5 style={{position: 'absolute', top: -7, left: 5}}>
                    {expanded ? '▼' : '▶'} {name}
                </h5>
            </a>
            {expanded ?
                <div>
                    {children}
                </div> : null}
        </div>
    }
}
