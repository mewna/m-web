import React from "react"
import {MComponent} from "../../MComponent";

export class Pro extends MComponent {
    constructor(props) {
        super("PRO", props)
    }
    render() {
        return (
            <div className={"has-text-left"} style={{width: "100%"}}>
                Mewna pro!
            </div>
        )
    }
}
