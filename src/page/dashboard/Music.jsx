import React from "react"
import {DashboardPage} from "./DashboardPage";
import BubblePreloader from 'react-bubble-preloader'

export class Music extends DashboardPage {
    constructor(props) {
        super("MUSIC", props)
    }

    componentDidMount() {
        this.fetchConfig()
    }

    render() {
        if(this.state.config) {
            return (
                <div className={"has-text-left"} style={{width: "100%"}}>
                    {this.renderCommands(false)}
                </div>
            )
        } else {
            return (
                <div className="has-text-centered" style={{width: "100vw"}}>
                    <BubblePreloader
                        colors={["white", "white", "white"]}
                    />
                </div>
            )
        }
    }
}
