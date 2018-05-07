import {MComponent} from "../../MComponent"
import React from "react"
import axios from 'axios'
import {BACKEND_URL} from "../../const"
import BubblePreloader from 'react-bubble-preloader'
import {Checkbox} from "../../comp/Checkbox";
import {DebouncedText} from "../../comp/DebouncedText";

export class Commands extends MComponent {
    constructor(props) {
        super("DASHBOARDCOMMANDS", props)
        this.state = {commands: null, commandStates: {}}
    }

    componentDidMount() {
        axios.get(BACKEND_URL + "/api/commands").then(e => {
            let data = e.data
            this.getLogger().debug("Got command data:", data)
            let states = {}
            data.forEach(e => {
                states[e.name] = true
            })
            this.setState({commands: data, commandStates: states})
        })
    }

    renderCommands() {
        let cards = []
        let counter = 0
        this.state.commands.sort((a, b) => a.name.localeCompare(b.name)).forEach(c => {
            cards.push(
                <div className={"column is-12"} key={counter}>
                    <div className={"toggle-row"}>
                        <div className={"is-inline-block"}>
                            <p className={"title is-size-5"}>mew.{c.name}</p>
                            {c.desc}
                        </div>
                        <span style={{marginLeft: "auto", marginRight: "1.5rem"}}/>
                        <Checkbox id={c.name} className="switch is-rounded is-primary is-medium" isChecked={true}/>
                    </div>
                </div>
            )
            ++counter
        })
        return cards
    }

    render() {
        if(this.state.commands) {
            return (
                <div className={"has-text-left"} style={{width: "100%"}}>
                    <div className={"column is-12"}>
                        <div className={"toggle-row"}>
                            <div className={"is-inline-block"}>
                                <p className={"title is-size-5"}>Prefix</p>
                                Change what Mewna responds to.
                            </div>
                            <span style={{marginLeft: "auto", marginRight: "1.5rem"}}/>
                            <DebouncedText placeholder="Default: mew." id="custom_prefix" maxLength={16} />
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