/* eslint jsx-a11y/anchor-is-valid: 0 */

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
for(let i = 1; i <= 100; i++) {
    LEVELS.push({value: i, label: "Level " + i})
}

export class Levels extends DashboardPage {
    constructor(props) {
        super("LEVELS", props)
    }

    componentDidMount() {
        this.fetchConfig(() => {
            // noinspection JSUnresolvedVariable
            axios.get(BACKEND_URL + "/api/v1/cache/guild/" + this.props.guild.id + "/roles").then(e => {
                const roles = e.data.sort((a, b) => a.name.localeCompare(b.name)).map(e => new Role(e.id, e.name, e.color))
                this.getLogger().debug("Got roles:", roles)
                this.setState({
                    roles: roles,
                    roleOptions: roles.map(e => {
                        return {
                            label: e.name,
                            value: e.id,
                        }
                    })
                })
            })
        })
    }

    handleRoleSelect(e) {
        let config = Object.assign({}, this.state.config)
        let roleRewards = config.levelRoleRewards
        roleRewards[e.value] = 1
        config.roleRewards = roleRewards
        // this.setState({config: config}, () => this.updateConfig())
        this.updateConfig(config)
    }

    handleRoleLevelChange(oldLevel, newLevel, role) {
        let config = Object.assign({}, this.state.config)
        let roleRewards = config.levelRoleRewards
        roleRewards[role.id] = newLevel
        config.roleRewards = roleRewards
        // this.setState({config: config}, () => this.updateConfig())
        this.updateConfig(config)
    }

    handleRoleRemove(level, role) {
        let config = Object.assign({}, this.state.config)
        let roleRewards = config.levelRoleRewards
        delete roleRewards[role.id]
        config.roleRewards = roleRewards
        // this.setState({config: config}, () => this.updateConfig())
        this.updateConfig(config)
    }

    renderRoleCards() {
        const rewards = this.state.config.levelRoleRewards
        const cards = []
        let counter = 0
        const keys = Object.keys(rewards)
        for(const key of keys) {
            let roleId = key
            const role = this.state.roles.filter(e => e.id === roleId)[0]
            let level = rewards[roleId]
            this.getLogger().debug("role for", roleId, "->", role)
            cards.push(<RoleReward key={counter}
                deleteCallback={(level, role) => {this.handleRoleRemove(level, role)}}
                levelChangeCallback={(oldLevel, newLevel, role) => {this.handleRoleLevelChange(oldLevel, newLevel, role)}}
                role={role} level={level} />)
            ++counter
        }
        if(cards.length > 0) {
            return cards
        } else {
            return (
                <div className="column is-12 toggle-column-wrapper">
                    <div className="notification is-outlined">
                        You don't have any role rewards. Choose a role from the dropdown to get started.
                    </div>
                </div>
            )
        }
    }

    render() {
        if(this.state.config && this.state.roles) {
            return (
                <div>
                    <OptionToggle name="Enable levels" desc="Whether or not people should gain xp by chatting in this server."
                        checkedCallback={() => this.state.config.levelsEnabled} callback={() => {
                            let config = Object.assign({}, this.state.config)
                            config.levelsEnabled = !config.levelsEnabled
                            // this.setState({config: config}, () => this.updateConfig())
                            this.updateConfig(config)
                            this.getLogger().debug("Toggled levelsEnabled: ", config.levelsEnabled)
                        }} />
                    <OptionToggle name="Enable level-up messages" desc="Whether or not messages should be sent when someone levels up."
                        checkedCallback={() => this.state.config.levelUpMessagesEnabled} callback={() => {
                            let config = Object.assign({}, this.state.config)
                            config.levelUpMessagesEnabled = !config.levelUpMessagesEnabled
                            // this.setState({config: config}, () => this.updateConfig())
                            this.updateConfig(config)
                            this.getLogger().debug("Toggled levelUpMessagesEnabled: ", config.levelUpMessagesEnabled)
                        }} />
                    <OptionToggle name="Remove previous role rewards" desc="If enabled, users will only have the highest role reward, otherwise they can have multiple."
                        checkedCallback={() => this.state.config.removePreviousRoleRewards} callback={() => {
                            let config = Object.assign({}, this.state.config)
                            config.removePreviousRoleRewards = !config.removePreviousRoleRewards
                            // this.setState({config: config}, () => this.updateConfig())
                            this.updateConfig(config)
                            this.getLogger().debug("Toggled removePreviousRoleRewards: ", config.removePreviousRoleRewards)
                        }} />
                    <div className={"column is-12 toggle-column-wrapper"}>
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
                                // this.setState({config: config}, () => this.updateConfig())
                                this.updateConfig(config)
                                this.getLogger().debug("Set levelUpMessage:", val)
                            }} value={this.state.config.levelUpMessage} />
                        </div>
                    </div>
                    <div className={"column is-12 toggle-column-wrapper"}>
                        <hr className={"dark-hr"} />
                    </div>

                    <div className={"column is-12 toggle-column-wrapper"}>
                        <div className={"toggle-row"}>
                            <div className={"is-inline-block"}>
                                <p className={"title is-size-5"}>Import MEE6 levels</p>
                                <p>Import this server's levels and role rewards from MEE6. THIS OVERWRITES OLD LEVELS AND CANNOT BE UNDONE.</p>
                                <p>This process may take several minutes. Additionally, some users may not show up on the leaderboards until they run commands.</p>
                            </div>
                            <span style={{marginLeft: "auto", marginRight: "1.5rem"}} />
                            <a className="button is-primary hover" onClick={e => {
                                e.preventDefault()
                                // Fire off the request and get going~
                                axios.post(BACKEND_URL + `/api/v1/data/guild/${this.props.guild.id}/levels/import/mee6`, {},
                                    {headers: {"Authorization": this.getAuth().getToken()}})
                            }}>
                                Import
                            </a>
                        </div>
                    </div>

                    <div className={"column is-12 toggle-column-wrapper"}>
                        <hr className={"dark-hr"} />
                    </div>

                    <div className={"column is-12 toggle-column-wrapper"}>
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
                                onChange={e => this.handleRoleSelect(e)}
                                options={this.state.roleOptions}
                                clearable={false}
                                searchable={false}
                                optionRenderer={option => {
                                    let color = this.state.roles.filter(e => e.id === option.value)[0].color.toString(16)
                                    if(color === "1fffffff") {
                                        color = "ffffff"
                                    }
                                    return (
                                        <span id={option.value} style={{"color": "#" + color}}>
                                            {option.label}
                                        </span>
                                    )
                                }}
                            />
                        </div>
                    </div>

                    {this.renderRoleCards()}
                    {this.renderCommands(true)}
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

class Role {
    constructor(id, name, color) {
        this.id = id
        this.name = name
        this.color = color
    }
}

class RoleReward extends MComponent {
    constructor(props) {
        super("ROLEREWARD", props)
        this.state = {level: props.level}
    }

    handleLevelSelect(e) {
        const oldLevel = this.state.level
        const newLevel = e.value
        this.setState({level: newLevel}, () => {
            this.props.levelChangeCallback && this.props.levelChangeCallback(oldLevel, newLevel, this.props.role)
        })
    }

    render() {
        return (
            <div className={"column is-12 toggle-column-wrapper"}>
                <div className={"toggle-row"}>
                    <div>
                        <p className={"title is-size-5"}>{this.props.role.name}</p>
                    </div>
                    <span style={{marginLeft: "auto", marginRight: "1.5rem"}} />
                    <Select
                        className={"wide-select"}
                        name="role-select"
                        value={this.state.level}
                        onChange={(e) => this.handleLevelSelect(e)}
                        options={LEVELS}
                        clearable={false}
                    />
                    <a className={"button is-danger toggle-corner-button"} onClick={e => {
                        this.props.deleteCallback && this.props.deleteCallback(this.state.level, this.props.role)
                    }}><i className="far fa-trash-alt" /></a>
                </div>
            </div>
        )
    }
}