import React from "react"
import {DebouncedTextarea} from "../../comp/DebouncedTextarea"

import Select from 'react-select'
import 'react-select/dist/react-select.css'
import BubblePreloader from 'react-bubble-preloader'
import axios from 'axios'
import {BACKEND_URL} from "../../const"
import {DashboardPage} from "./DashboardPage"
import {OptionToggle} from "../../comp/dashboard/OptionToggle"

export class Welcoming extends DashboardPage {
    constructor(props) {
        super("WELCOMING", props)
        this.state = {channel: null, channels: null, role: null, roles: null, roleOptions: null}
    }

    componentDidMount() {
        this.fetchConfig(() => {
            // noinspection JSUnresolvedVariable
            axios.get(BACKEND_URL + "/api/v1/cache/guild/" + this.props.guild.id + "/channels").then(e => {
                const channels = e.data
                this.setState({
                    channels: channels.filter(e => e.type === 0).sort((a, b) => a.name.localeCompare(b.name)).map(e => {
                        return {
                            label: "#" + e.name,
                            value: e.id
                        }
                    })
                })
                axios.get(BACKEND_URL + "/api/v1/cache/guild/" + this.props.guild.id + "/roles").then(e => {
                    const roles = e.data
                    this.getLogger().debug("Got roles:", roles)
                    this.setState({
                        roles: roles,
                        roleOptions: roles.sort((a, b) => a.name.localeCompare(b.name)).map(e => {
                            return {
                                // TODO: Colour
                                label: e.name,
                                value: e.id
                            }
                        })
                    })
                })
            })
        })
    }


    handleChannelChange(e) {
        let config = Object.assign({}, this.state.config)
        config.messageChannel = e.value
        // this.setState({config: config}, () => this.updateConfig())
        this.updateConfig(config)
    }

    handleRoleChange(e) {
        let config = Object.assign({}, this.state.config)
        config.joinRoleId = e.label === "@everyone" ? null : e.value
        // this.setState({config: config}, () => this.updateConfig())
        this.updateConfig(config)
    }

    render() {
        if(this.state.channels && this.state.roles) {
            return (
                <div className={"has-text-left"} style={{width: "100%"}}>
                    <div className={"column is-12 toggle-column-wrapper"}>
                        <div className={"toggle-row"}>
                            <div className={"is-inline-block"}>
                                <p className={"title is-size-5"}>Welcome/Goodbye message channel</p>
                                The channel that the messages will be sent in.
                            </div>
                            <span style={{marginLeft: "auto", marginRight: "1.5rem"}} />
                            <Select
                                className={"wide-select"}
                                name="channel-select"
                                value={this.state.config.messageChannel}
                                onChange={(e) => this.handleChannelChange(e)}
                                options={this.state.channels}
                                clearable={false}
                                searchable={false}
                            />
                        </div>
                    </div>
                    <div className={"column is-12 toggle-column-wrapper"}>
                        <div className={"toggle-row"}>
                            <div>
                                <p className={"title is-size-5"}>Join role</p>
                                Set the role assigned to people when they join. Choose @everyone to clear it.
                            </div>
                            <span style={{marginLeft: "auto", marginRight: "1.5rem"}} />
                            <Select
                                className={"wide-select"}
                                name="channel-select"
                                value={this.state.config.joinRoleId}
                                onChange={(e) => this.handleRoleChange(e)}
                                options={this.state.roleOptions}
                                clearable={false}
                                searchable={false}
                            />
                        </div>
                    </div>
                    <div className={"column is-12 toggle-column-wrapper"}>
                        <hr className={"dark-hr"} />
                    </div>
                    <OptionToggle name="Enable welcome messages" desc="Allow sending a message whenever someone joins the server."
                        checkedCallback={() => this.state.config.enableWelcomeMessages} callback={() => {
                            let config = Object.assign({}, this.state.config)
                            config.enableWelcomeMessages = !config.enableWelcomeMessages
                            // this.setState({config: config}, () => this.updateConfig())
                            this.updateConfig(config)
                            this.getLogger().debug("Toggled enableWelcomeMessages: ", config.enableWelcomeMessages)
                        }} />
                    <div className={"column is-12 toggle-column-wrapper"}>
                        <div className={"toggle-col"}>
                            <div>
                                <p className={"title is-size-5"}>Welcome message</p>
                                The message sent when someone joins the server.
                            </div>
                            <div className={"small-spacer-v"} />
                            <DebouncedTextarea className={"dark-textarea"} value={this.state.config.welcomeMessage}
                                rows={8} min-rows={8}
                                callback={(e) => {
                                    const val = e.textarea_value
                                    let config = Object.assign({}, this.state.config)
                                    config.welcomeMessage = val
                                    // this.setState({config: config}, () => this.updateConfig())
                                    this.updateConfig(config)
                                    this.getLogger().debug("Set welcomeMessage:", val)
                                }} />
                        </div>
                    </div>
                    <div className={"column is-12 toggle-column-wrapper"}>
                        <hr className={"dark-hr"} />
                    </div>
                    <OptionToggle name="Enable goodbye messages" desc="Allow sending a message whenever someone leaves the server."
                        checkedCallback={() => this.state.config.enableGoodbyeMessages} callback={() => {
                            let config = Object.assign({}, this.state.config)
                            config.enableGoodbyeMessages = !config.enableGoodbyeMessages
                            // this.setState({config: config}, () => this.updateConfig())
                            this.updateConfig(config)
                            this.getLogger().debug("Toggled enableGoodbyeMessages: ", config.enableGoodbyeMessages)
                        }} />
                    <div className={"column is-12 toggle-column-wrapper"}>
                        <div className={"toggle-col"}>
                            <div>
                                <p className={"title is-size-5"}>Goodbye message</p>
                                The message sent when someone leaves the server.
                            </div>
                            <div className={"small-spacer-v"} />
                            <DebouncedTextarea className={"dark-textarea"} value={this.state.config.goodbyeMessage} rows={8}
                                min-rows={8} callback={(e) => {
                                    const val = e.textarea_value
                                    let config = Object.assign({}, this.state.config)
                                    config.goodbyeMessage = val
                                    // this.setState({config: config}, () => this.updateConfig())
                                    this.updateConfig(config)
                                    this.getLogger().debug("Set goodbyeMessage:", val)
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
