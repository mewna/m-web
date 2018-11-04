import React from "react"
import {DebouncedText} from "../../comp/DebouncedText"
import {DashboardPage} from "./DashboardPage";
import BubblePreloader from 'react-bubble-preloader'

export class Behaviour extends DashboardPage {
    constructor(props) {
        super("BEHAVIOUR", props)
    }

    componentDidMount() {
        this.fetchConfig()
    }

    render() {
        if(this.state.config) {
            return (
                <div className={"has-text-left"} style={{width: "100%"}}>
                    <div className={"column is-12 toggle-column-wrapper"}>
                        <div className={"toggle-row"}>
                            <div className={"is-inline-block"}>
                                <p className={"title is-size-5"}>Custom prefix</p>
                                Changes the prefix Mewna responds to in this server. 
                            </div>
                            <span style={{marginLeft: "auto", marginRight: "1.5rem"}} />
                            <DebouncedText placeholder="Default: mew." id="prefix" maxLength={16}
                                value={this.state.config.prefix} callback={(e) => {
                                    let config = Object.assign({}, this.state.config)
                                    config.prefix = e.value
                                    this.updateConfig(config)
                                }} />
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="has-text-centered is-centered" style={{width: "100%"}}>
                    <BubblePreloader
                        colors={["white", "white", "white"]}
                    />
                </div>
            )
        }
    }
}
