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
        let imageClass = "is-60x60"
        if(this.props.big) {
            imageClass = "is-92x92"
        }
        imageClass = "image " + imageClass
        let style = {display: "flex", alignItems: "center", justifyContent: "center", alignContent: "center"}
        if(this.props.noborder) {
            style = {display: "flex", alignItems: "center", justifyContent: "center", alignContent: "center", border: "transparent"}
        }
        return (
            <div className={className}
                style={style}>
                <img className={imageClass} src={this.props.src} onError={this.props.onError || (() => {})} alt={"icon"} />
            </div>
        )
    }
}