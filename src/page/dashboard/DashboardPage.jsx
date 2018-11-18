import {MComponent} from "../../MComponent"
import {BACKEND_URL} from "../../const"
import axios from 'axios'
import {OptionToggle} from "../../comp/dashboard/OptionToggle"
import React from 'react'
// eslint-disable-next-line no-unused-vars
import deepEquals from "lodash.isequal"

export class DashboardPage extends MComponent {
    constructor(name, props) {
        super(name, props)
        this.state = {config: null}
        this.kind = name.toLowerCase()
    }

    fetchConfig(callback) {
        axios.get(BACKEND_URL + `/api/v1/data/guild/${this.props.guild.id}/config/${this.kind}`, {headers: {"Authorization": this.getAuth().getToken()}}).then(e => {
            let data = JSON.parse(e.data)
            this.getLogger().debug("Fetched guild config:", data)
            this.setState({config: data})
            callback && callback()
        })
    }

    updateConfig(data, callback) {
        this.setState({config: data}, () => {
            axios.post(BACKEND_URL + `/api/v1/data/guild/${this.props.guild.id}/config/${this.kind}`, this.state.config,
                {headers: {"Authorization": this.getAuth().getToken()}})
                .then(e => {
                    let data = JSON.parse(e.data)
                    //this.getLogger().debug("Got config API response:", data)
                    callback && callback(data)
                })
        })
    }

    renderCommands(divider) {
        if(this.state.config && this.state.config.commandSettings) {
            let cards = []
            let names = Object.keys(this.state.config.commandSettings).sort((a, b) => a.localeCompare(b))
            let key = 0
            for(let name of names) {
                cards.push(<OptionToggle key={key} name={`mew.${name}`}
                    checkedCallback={() => this.state.config.commandSettings[name].enabled}
                    callback={(_) => {
                        let states = Object.assign({}, this.state.config.commandSettings)
                        states[name].enabled = !states[name].enabled
                        let config = Object.assign({}, this.state.config)
                        config.commandSettings = states
                        // this.setState({config: config}, () => this.updateConfig())
                        this.updateConfig(config)
                        this.getLogger().debug("Toggled command:", name, "to:", states[name].enabled)
                    }} />)
                ++key
            }
            let dividerData = ""
            if(divider) {
                dividerData = (
                    <div className={"column is-12 toggle-column-wrapper"}>
                        <hr className={"dark-hr"} />
                    </div>
                )
            }
            return (
                <div>
                    {dividerData}
                    {cards}
                </div>
            )
        } else {
            return ""
        }
    }
}