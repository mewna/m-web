import React from "react"
import axios from 'axios'
import {BACKEND_URL} from "../../const"
import BubblePreloader from 'react-bubble-preloader'
import {Checkbox} from "../../comp/Checkbox";
import {DebouncedText} from "../../comp/DebouncedText";
import {DashboardPage} from "./DashboardPage";

export class Commands extends DashboardPage {
    constructor(props) {
        super("COMMANDS", props)
        this.state = {commands: null}
    }

    componentDidMount() {
        this.fetchConfig(() => {
            axios.get(BACKEND_URL + "/api/metadata/commands").then(e => {
                let data = e.data
                this.getLogger().debug("Got command data:", data)
                const commandSettings = this.state.config.commandSettings
                data.forEach(e => {
                    if(!commandSettings.hasOwnProperty(e.name)) {
                        commandSettings[e.name] = {enabled: true}
                    }
                })
                this.setState({commands: data})
            })
        })
    }

    renderCommands() {
        let cards = []
        let counter = 0
        this.state.commands.sort((a, b) => a.name.localeCompare(b.name)).forEach(c => {
            // noinspection JSUnusedLocalSymbols
            cards.push(
                <div className={"column is-12"} key={counter}>
                    <div className={"toggle-row"}>
                        <div className={"is-inline-block"}>
                            <p className={"title is-size-5"}>mew.{c.name}</p>
                            {c.desc}
                        </div>
                        <span style={{marginLeft: "auto", marginRight: "1.5rem"}}/>
                        <Checkbox id={c.name} className="switch is-rounded is-primary is-medium"
                                  isChecked={this.state.config.commandSettings[c.name].enabled}
                                  callback={(_) => {
                                      let states = Object.assign({}, this.state.config.commandSettings)
                                      states[c.name].enabled = !states[c.name].enabled
                                      let config = Object.assign({}, this.state.config)
                                      config.commandSettings = states
                                      this.setState({config: config})
                                      this.getLogger().debug("Toggled command:", c.name, "to:", states[c.name].enabled)
                                  }}/>
                    </div>
                </div>
            )
            ++counter
        })
        return cards
    }

    render() {
        if(this.state.commands && this.state.config) {
            return (
                <div className={"has-text-left"} style={{width: "100%"}}>
                    <div className={"column is-12"}>
                        <div className={"toggle-row"}>
                            <div className={"is-inline-block"}>
                                <p className={"title is-size-5"}>Prefix</p>
                                Change what Mewna responds to.
                            </div>
                            <span style={{marginLeft: "auto", marginRight: "1.5rem"}}/>
                            {/* TODO: Callback */}
                            <DebouncedText placeholder="Default: mew." id="custom_prefix" maxLength={16} value={this.state.config.customPrefix} />
                        </div>
                    </div>
                    <div className={"column is-12"}>
                        <hr className={"dark-hr"} />
                    </div>
                    {this.renderCommands()}
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