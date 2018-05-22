import {MComponent} from "../MComponent"
import React from "react"

export class NoAuth extends MComponent {
    constructor(props) {
        super("NOAUTH", props)
    }

    render() {
        return (
            <div>
                <section className={"section is-small"} />
                <div className={"container is-centered has-text-centered"}>
                    <h1 className={"title is-size-1 has-text-white"}>You're not allowed to do that!</h1>
                </div>
            </div>
        )
    }
}