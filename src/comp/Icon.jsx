import {MComponent} from "../MComponent";
import React from "react";

export class Icon extends MComponent {
    render() {
        let className = "circle server-icon"
        if(this.props.className) {
            className += " " + this.props.className
        }
        return (
            <div className={className}>
                <img className="image circle" src={this.props.src} alt={"guild icon"} />
            </div>
        )
    }
}