import {MComponent} from "../MComponent"
import React from "react"
import {NavLink} from "react-router-dom"

export class NotFound extends MComponent {
    constructor(props) {
        super("NOTFOUND", props)
    }

    render() {
        return (
            <div>
                <main className="content">
                    <section className={"section is-medium"} />
                    <div className={"container is-centered has-text-centered"}>
                        <img src="/mewna-404.svg" alt="404" style={{width: "256px", height: "256px"}} />
                        <h1 className={"title is-size-4 has-text-white"}>It looks like you got lost...</h1>
                        <NavLink className="button is-primary is-large" to="/">Back to the site</NavLink>
                    </div>
                </main>
            </div>
        )
    }
}