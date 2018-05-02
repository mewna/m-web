import {MComponent} from "../MComponent";
import React from "react";

export class Icon extends MComponent {
    constructor(props) {
        super("ICON", props)
    }

    render() {
        let className = ""
        if(this.props.className) {
            className += this.props.className
        }
        return (
            <div className={className}>
                <img className={"image circle is-60x60"} src={this.props.src} alt={"guild icon"} />
            </div>
        )
    }
}