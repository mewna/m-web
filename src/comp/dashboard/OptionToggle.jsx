import React from "react"
import {MComponent} from '../../MComponent'
import {Checkbox} from '../Checkbox'

export class OptionToggle extends MComponent {
    constructor(props) {
        super("OPTIONTOGGLE", props)
        if(!props.checkedCallback) {
            throw new Error("No props.checkedCallback")
        }
        if(!props.callback) {
            throw new Error("No props.callback")
        }
        if(!props.name) {
            throw new Error("No props.name")
        }
    }

    render() {
        let desc = ""
        if(this.props.desc && this.props.desc.length > 0) {
            desc = this.props.desc
        }
        return (
            <div className={"column is-12"}>
                <div className={"toggle-row"}>
                    <div className={"is-inline-block"}>
                        <p className={"title is-size-5"}>{this.props.name}</p>
                        {desc}
                    </div>
                    <span style={{marginLeft: "auto", marginRight: "1.5rem"}} />
                    <Checkbox id={this.props.name} className="switch is-rounded is-primary is-medium"
                        isChecked={this.props.checkedCallback()}
                        callback={this.props.callback} />
                </div>
            </div>
        )
    }
}