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
            <div className={className}
                style={{display: "flex", alignItems: "center", justifyContent: "center", alignContent: "center"}}>
                <img className={"image is-60x60"} src={this.props.src} alt={"icon"} />
            </div>
        )
    }
}