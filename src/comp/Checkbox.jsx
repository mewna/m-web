import {MComponent} from "../MComponent";
import React from "react";

export class Checkbox extends MComponent {
    constructor(props) {
        super("CHECKBOX-" + props.id, props)
        let checked = false
        if(props.isChecked !== null && props.isChecked !== undefined) {
            checked = props.isChecked
        }
        this.state = {checked: checked}
    }

    handleChange(e) {
        this.setState({checked: e.target.checked})
        if(this.props.callback) {
            this.props.callback(e)
        }
    }

    render() {
        return (
            <div className="field">
                <input type="checkbox" value={this.state.checked} name={this.props.id} id={this.props.id}
                       checked={this.state.checked ? "checked" : ""}
                       className={this.props.className}
                       onChange={e => this.handleChange(e)}/>
                <label htmlFor={this.props.id}/>
            </div>
        )
    }
}