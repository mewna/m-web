import {Checkbox} from "../../comp/Checkbox"
import React from "react"
import {DebouncedTextarea} from "../../comp/DebouncedTextarea"

import Select from 'react-select'
import 'react-select/dist/react-select.css'
import BubblePreloader from 'react-bubble-preloader'
import axios from 'axios'
import {BACKEND_URL} from "../../const";
import {DashboardPage} from "./DashboardPage";

export class Welcoming extends DashboardPage {
    constructor(props) {
        super("WELCOMING", props)
        this.state = {channel: null, channels: null, role: null, roles: null, roleOptions: null}
    }

    componentDidMount() {
        this.fetchConfig(() => {
            // noinspection JSUnresolvedVariable
            axios.get(BACKEND_URL + "/api/cache/guild/" + this.props.guild.id + "/channels").then(e => {
                const channels = e.data
                this.setState({
                    channels: channels.filter(e => e.type === 0).sort((a, b) => a.name.localeCompare(b.name)).map(e => {
                        return {
                            label: "#" + e.name,
                            value: e.id
                        }
                    })
                })
                axios.get(BACKEND_URL + "/api/cache/guild/" + this.props.guild.id + "/roles").then(e => {
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
        this.setState({channel: e})
    }

    handleRoleChange(e) {
        this.setState({role: e})
    }

    render() {
        if(this.state.channels && this.state.roles) {
            return (
                <div className={"has-text-left"} style={{width: "100%"}}>
                    <div className={"column is-12"}>
                        <div className={"toggle-row"}>
                            <div className={"is-inline-block"}>
                                <p className={"title is-size-5"}>Message channel</p>
                                The channel that the messages will be sent in.
                            </div>
                            <span style={{marginLeft: "auto", marginRight: "1.5rem"}} />
                            <Select
                                className={"wide-select"}
                                name="channel-select"
                                value={this.state.channel}
                                onChange={(e) => this.handleChannelChange(e)}
                                options={this.state.channels}
                                clearable={false}
                            />
                        </div>
                    </div>
                    <div className={"column is-12"}>
                        <div className={"toggle-row"}>
                            <div>
                                <p className={"title is-size-5"}>Join role</p>
                                Set the role assigned to people when they join
                            </div>
                            <span style={{marginLeft: "auto", marginRight: "1.5rem"}} />
                            <Select
                                className={"wide-select"}
                                name="channel-select"
                                value={this.state.role}
                                onChange={(e) => this.handleRoleChange(e)}
                                options={this.state.roleOptions}
                                clearable={false}
                                searchable={false}
                            />
                        </div>
                    </div>
                    <div className={"column is-12"}>
                        <hr className={"dark-hr"} />
                    </div>
                    <div className={"column is-12"}>
                        <div className={"toggle-row"}>
                            <div className={"is-inline-block"}>
                                <p className={"title is-size-5"}>Enable welcome messages</p>
                                Allow sending a message whenever someone joins the server.
                            </div>
                            <span style={{marginLeft: "auto", marginRight: "1.5rem"}} />
                            <Checkbox id={"welcome-toggle"} className="switch is-rounded is-primary is-medium"
                                isChecked={true} />
                        </div>
                    </div>
                    <div className={"column is-12"}>
                        <div className={"toggle-col"}>
                            <div>
                                <p className={"title is-size-5"}>Welcome message</p>
                                The message sent when someone joins the server.
                            </div>
                            <div className={"small-spacer-v"} />
                            <DebouncedTextarea className={"dark-textarea"} value={"Hey {user.mention}, welcome to {server.name}!"}
                                rows={8} min-rows={8} />
                        </div>
                    </div>
                    <div className={"column is-12"}>
                        <hr className={"dark-hr"} />
                    </div>
                    <div className={"column is-12"}>
                        <div className={"toggle-row"}>
                            <div className={"is-inline-block"}>
                                <p className={"title is-size-5"}>Enable goodbye messages</p>
                                Allow sending a message whenever someone leaves the server.
                            </div>
                            <span style={{marginLeft: "auto", marginRight: "1.5rem"}} />
                            <Checkbox id={"goodbye-toggle"} className="switch is-rounded is-primary is-medium"
                                isChecked={true} />
                        </div>
                    </div>
                    <div className={"column is-12"}>
                        <div className={"toggle-col"}>
                            <div>
                                <p className={"title is-size-5"}>Goodbye message</p>
                                The message sent when someone leaves the server.
                            </div>
                            <div className={"small-spacer-v"} />
                            <DebouncedTextarea className={"dark-textarea"} value={"Sorry to see you go, {user.name}..."} rows={8}
                                min-rows={8} />
                        </div>
                    </div>
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
