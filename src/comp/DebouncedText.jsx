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
    }

    handleChange(e) {
        this.handleChangeInternal(e.target)
    }

    render() {
        return (
            <div>
                <input type="text" className="input" onChange={e => this.handleChange(e)} {...this.props} />
            </div>
        );
    }
}