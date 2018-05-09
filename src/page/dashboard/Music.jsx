import {MComponent} from "../../MComponent"
import {Checkbox} from "../../comp/Checkbox"
import React from "react"

export class Music extends MComponent {
    constructor(props) {
        super("MUSIC", props)
    }

    render() {
        return (
            <div className={"has-text-left"} style={{width: "100%"}}>
                <div className={"column is-12"}>
                    <div className={"toggle-row"}>
                        <div className={"is-inline-block"}>
                            <p className={"title is-size-5"}>Enable Radio</p>
                            Allow radio to be played when there's nothing in the queue.
                        </div>
                        <span style={{marginLeft: "auto", marginRight: "1.5rem"}}/>
                        <Checkbox id={"radio-toggle"} className="switch is-rounded is-primary is-medium" isChecked={true}/>
                    </div>
                </div>
            </div>
        )
    }
}
