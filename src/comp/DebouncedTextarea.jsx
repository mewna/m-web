import React from 'react'
import {MComponent} from "../MComponent"
import {debounce} from 'throttle-debounce'

const MAX_CHARS = 2000

export class DebouncedTextarea extends MComponent {
    constructor(props) {
        super("DEBOUNCEDTEXTAREA", props)

        let initial = 0
        if(this.props.value) {
            initial = this.props.value.length
        }

        if(props.callback) {
            this.handleChangeInternal = debounce(500, false, this.props.callback)
        } else {
            this.handleChangeInternal = debounce(500, false, (e) => this.getLogger().debug("target ::", e))
        }

        this.state = {
            chars_left: MAX_CHARS - initial,
            textarea_value: this.props.value,
        }
    }

    handleChange(e) {
        // noinspection JSUnresolvedVariable
        let input = e.target.value
        if(input.length > MAX_CHARS) {
            input = input.substring(0, MAX_CHARS)
        }
        this.setState({
            chars_left: MAX_CHARS - input.length,
            textarea_value: input,
        }, () => {this.handleChangeInternal(this.state)})
    }

    render() {
        return (
            <div className="textarea-container">
                <textarea onChange={(e) => this.handleChange(e)} className={"dark-textarea"} rows={8} min-rows={8}
                    value={this.state.textarea_value} />
                <div className="textarea-counter">{MAX_CHARS - this.state.chars_left}/{MAX_CHARS}</div>
            </div>
        )
    }
}