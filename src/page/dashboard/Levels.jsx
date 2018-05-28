import React from "react"
import {DashboardPage} from "./DashboardPage"
import BubblePreloader from 'react-bubble-preloader'
import {OptionToggle} from "../../comp/dashboard/OptionToggle"
import {DebouncedTextarea} from "../../comp/DebouncedTextarea"
import Select from "react-select"
import {BACKEND_URL} from "../../const"
import axios from 'axios'
import {MComponent} from '../../MComponent'

const LEVELS = []
for(let i = 0; i < 100; i++) {
    LEVELS.push({value: i, label: "Level " + i})
}

export class Levels extends DashboardPage {
    constructor(props) {
        super("LEVELS", props)
    }

    componentDidMount() {
        this.fetchConfig(() => {
            this.fetchConfig(() => {
                // noinspection JSUnresolvedVariable
                axios.get(BACKEND_URL + "/api/cache/guild/" + this.props.guild.id + "/roles").then(e => {
                    const roles = e.data.sort((a, b) => a.name.localeCompare(b.name)).map(e => new Role(e.id, e.name))
                    this.getLogger().debug("Got roles:", roles)
                    this.setState({
                        roles: roles,
                        roleOptions: roles.map(e => {
                            return {
                                // TODO: Colour?
                                label: e.name,
                                value: e.id
                            }
                        })
                    })
                })
            })
        })
    }

    handleRoleSelect(e) {
        // TODO: Add a new role component down below
    }

    render() {
        if(this.state.config && this.state.roles) {
            return (
                <div>
                    <OptionToggle name="Enable levels" desc="Whether or not people should gain xp by chatting in this server."
                        checkedCallback={() => this.state.config.levelsEnabled} callback={() => {
                            let config = Object.assign({}, this.state.config)
                            config.levelsEnabled = !config.levelsEnabled
                            this.setState({config: config})
                            this.getLogger().debug("Toggled levelsEnabled: ", config.levelsEnabled)
                        }} />
                    <OptionToggle name="Enable level-up messages" desc="Whether or not messages should be sent when someone levels up."
                        checkedCallback={() => this.state.config.levelUpMessagesEnabled} callback={() => {
                            let config = Object.assign({}, this.state.config)
                            config.levelUpMessagesEnabled = !config.levelUpMessagesEnabled
                            this.setState({config: config})
                            this.getLogger().debug("Toggled levelUpMessagesEnabled: ", config.levelUpMessagesEnabled)
                        }} />
                    <OptionToggle name="Enable level-up cards" desc="Whether or not a card with extra info should be sent when someone levels up."
                        checkedCallback={() => this.state.config.levelUpCards} callback={() => {
                            let config = Object.assign({}, this.state.config)
                            config.levelUpCards = !config.levelUpCards
                            this.setState({config: config})
                            this.getLogger().debug("Toggled levelUpCards: ", config.levelUpCards)
                        }} />
                    <div className={"column is-12"}>
                        <div className={"toggle-col"}>
                            <div>
                                <p className={"title is-size-5"}>Level-up message</p>
                                The message sent when someone levels up.
                            </div>
                            <div className={"small-spacer-v"} />
                            <DebouncedTextarea callback={(e) => {
                                const val = e.textarea_value
                                let config = Object.assign({}, this.state.config)
                                config.levelUpMessage = val
                                this.setState({config: config})
                                this.getLogger().debug("Set levelUpMessage:", val)
                            }} value={this.state.config.levelUpMessage} />
                        </div>
                    </div>
                    <div className={"column is-12"}>
                        <hr className={"dark-hr"} />
                    </div>

                    <div className="column is-12">
                        <div className="notification is-danger">
                            THIS CONFIG STUFF IS NOT READY YET AT ALL. DON'T EXPECT IT TO DO ANYTHING.
                        </div>
                    </div>

                    <div className={"column is-12"}>
                        <div className={"toggle-row"}>
                            <div>
                                <p className={"title is-size-5"}>Role rewards</p>
                                Award roles to people when they reach certain levels.
                            </div>
                            <span style={{marginLeft: "auto", marginRight: "1.5rem"}} />
                            <Select
                                className={"wide-select"}
                                name="channel-select"
                                value={null}
                                onChange={(e) => this.handleRoleSelect(e)}
                                options={this.state.roleOptions}
                                clearable={false}
                                searchable={false}
                            />
                        </div>
                    </div>

                    <RoleReward role={this.state.roles[1]} />
                    {this.renderCommands(true)}
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

class Role {
    constructor(id, name) {
        this.id = id
        this.name = name
    }
}

class RoleReward extends MComponent {
    constructor(props) {
        super("ROLEREWARD", props)
        this.role = props.role
    }

    render() {
        return (
            <div className={"column is-12"}>
                <div className={"toggle-row"}>
                    <div>
                        <p className={"title is-size-5"}>{this.role.name}</p>
                    </div>
                    <span style={{marginLeft: "auto", marginRight: "1.5rem"}} />
                    <Select
                        className={"wide-select"}
                        name="role-select"
                        value={LEVELS[1]}
                        onChange={(e) => this.handleRoleSelect(e)}
                        options={LEVELS}
                        clearable={false}
                    />
                </div>
                <div style={{position: "relative"}}>
                    <a className={"button is-danger toggle-corner-button"}><i className="far fa-trash-alt" /></a>
                </div>
            </div>
        )
    }
}