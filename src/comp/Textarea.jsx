import React from 'react'
import {MComponent} from "../MComponent"

const MAX_CHARS = 2000

// TODO: Debouncing
export class Textarea extends MComponent {
    constructor(props) {
        super("TEXTAREA", props)

        let initial = 0
        if(this.props.value) {
            initial = this.props.value.length
        }

        this.state = {
            chars_left: MAX_CHARS - initial,
            textarea_value: this.props.value,
        }
    }

    handleChange(e) {
        // noinspection JSUnresolvedVariable
        let input = e.target.value
        this.setState({
            chars_left: MAX_CHARS - input.length,
            textarea_value: input,
        })
    }

    render() {
        return (
            <div className="textarea-container">
                <textarea onChange={(e) => this.handleChange(e)} {...this.props} value={this.state.textarea_value}/>
                <div className="textarea-counter">{MAX_CHARS - this.state.chars_left}/{MAX_CHARS}</div>
            </div>
        )
    }
}