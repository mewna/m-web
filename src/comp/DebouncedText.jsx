import React from 'react'
import {debounce} from 'throttle-debounce'
import {MComponent} from "../MComponent";

export class DebouncedText extends MComponent {
    constructor(props) {
        super(props)
        if(props.callback) {
            this.handleChange = debounce(500, false, this.props.callback)
        } else {
            this.handleChange = debounce(500, false, this.handleChange)
        }
    }

    handleChange(e) {
        this.getLogger().debug('value :: ', e.target.value);
        this.getLogger().debug('which :: ', e.which);
    }

    printChange(e) {
        this.handleChange(e)
    }

    render() {
        return (
            <div>
                <input type="text" className="input" onChange={e => this.printChange(e)} {...this.props} />
            </div>
        );
    }
}