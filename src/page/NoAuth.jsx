import {MComponent} from "../MComponent"
import React from "react"

export class NoAuth extends MComponent {
    constructor(props) {
        super("NOAUTH", props)
    }

    render() {
        return (
            <div>
                <h1>You're not allowed to do that!</h1>
            </div>
        )
    }
}