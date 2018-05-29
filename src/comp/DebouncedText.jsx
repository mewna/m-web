import React from 'react'
import {debounce} from 'throttle-debounce'
import {MComponent} from "../MComponent";

export class DebouncedText extends MComponent {
    constructor(props) {
        super("DEBOUNCEDTEXT", props)
        if(props.callback) {
            this.handleChangeInternal = debounce(500, false, this.props.callback)
        } else {
            this.handleChangeInternal = debounce(500, false, (e) => this.getLogger().debug("target ::", e))
        }
        this.state = {value: props.value}
    }

    handleChange(e) {
        e.persist()
        let input = e.target.value
        this.setState({value: input}, () => {
            this.handleChangeInternal(e.target)
        })
    }

    render() {
        let props = Object.assign({}, this.props)
        delete props.callback
        delete props.value
        return (
            <div>
                <input type="text" className="input" onChange={(e) => this.handleChange(e)} {...props} value={this.state.value} />
            </div>
        );
    }
}