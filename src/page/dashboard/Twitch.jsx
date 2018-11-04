import React from "react"
import {BACKEND_URL} from "../../const"
import {MComponent} from "../../MComponent"
import BubblePreloader from 'react-bubble-preloader'

import axios from 'axios'
import Select from "react-select"
import {DashboardPage} from "./DashboardPage"
import {DebouncedText} from "../../comp/DebouncedText"
import {DebouncedTextarea} from "../../comp/DebouncedTextarea"
import {OptionToggle} from "../../comp/dashboard/OptionToggle"

const SEARCH_READY = 0
const SEARCH_BUSY = 1
const SEARCH_SUCCESS = 2
const SEARCH_FAILURE = 3

class ChannelSelector extends MComponent {
    constructor(props) {
        super("CHANNELSELECTOR", props)
    }

    handleMouseDown(event) {
        event.preventDefault()
        event.stopPropagation()
        this.props.onSelect(this.props.option, event)
    }

    handleMouseEnter(event) {
        this.props.onFocus(this.props.option, event)
    }

    handleMouseMove(event) {
        if(this.props.isFocused) {
            return
        }
        this.props.onFocus(this.props.option, event)
    }

    internalClick() {
        if(this.props.option.hook) {
            this.getLogger().info("Found webhook for", this.props.option.value)
        } else {
            this.getLogger().info("Creating webhook for", this.props.option.value)
            window.open(BACKEND_URL + `/api/v1/connect/discord/webhooks/start?guild=${this.props.option.guild}&channel=${this.props.option.value}`,
                "Discord webhook authorization", "resizable=no,menubar=no,scrollbars=yes,status=no,height=640,width=480")
        }
    }

    render() {
        return (
            <div onMouseEnter={this.handleMouseEnter.bind(this)}
                onMouseMove={this.handleMouseMove.bind(this)}
                onClick={this.handleMouseDown.bind(this)}>
                <a className={this.props.className}
                    onClick={() => this.internalClick()}>
                    {this.props.children}
                </a>
            </div>
        );
    }
}

export class Twitch extends DashboardPage {
    constructor(props) {
        super("TWITCH", props)
        this.state = {channels: null, searchState: SEARCH_READY, streamers: {}}
    }

    componentDidMount() {
        this.doFetch()
        window.addEventListener("message", this.handleHookCreate.bind(this))
    }

    componentWillUnmount() {
        window.removeEventListener("message", this.handleHookCreate.bind(this))
    }

    doFetch() {
        this.fetchConfig(() => {
            // noinspection JSUnresolvedVariable
            axios.get(BACKEND_URL + "/api/v1/cache/guild/" + this.props.guild.id + "/channels").then(e => {
                const channels = e.data
                axios.get(BACKEND_URL + `/api/v1/data/guild/${this.props.guild.id}/webhooks`, {headers: {"Authorization": this.getAuth().getToken()}}).then(f => {
                    let hooks = JSON.parse(f.data)
                    this.setState({
                        channels: channels.filter(e => e.type === 0).sort((a, b) => a.name.localeCompare(b.name)).map(e => {
                            return {
                                label: "#" + e.name,
                                value: e.id,
                                guild: this.props.guild.id,
                                hook: hooks.filter(hook => hook.channel === e.id).length > 0
                            }
                        })
                    })
                })
            })
        })
    }

    handleHookCreate(e) {
        if(e.data && e.data.data && e.data.data.hook_created) {
            this.doFetch()
        }
    }

    handleHookChannelChange(val) {
        let config = Object.assign({}, this.state.config)
        config.twitchWebhookChannel = val.value
        this.updateConfig(config)
        /*
        this.setState(state, () => {
            this.updateConfig()
        })
        */
    }

    handleStreamerConfigUpdate(incomingConfig) {
        let idx = -1
        // I'm evil ik :(
        let streamers = JSON.parse(JSON.stringify(this.state.config.twitchStreamers))
        for(let i = 0; i < streamers.length; i++) {
            if(streamers[i].id === incomingConfig.id) {
                idx = i
                break
            }
        }
        if(idx > -1) {
            streamers[idx] = incomingConfig
            let config = Object.assign({}, this.state.config)
            config.twitchStreamers = streamers
            /*
            this.setState({config: config}, () => {
                this.updateConfig()
            })
            */
            this.updateConfig(config)
        } else {
            this.getLogger().warn("Couldn't find streamer for id:", incomingConfig.id)
        }
    }

    render() {
        if(this.state.channels) {
            let stateSymbol = ""
            if(this.state.searchState === SEARCH_SUCCESS) {
                stateSymbol = <i className="fas fa-check-circle has-text-success" style={{marginRight: "1em"}} />
            } else if(this.state.searchState === SEARCH_FAILURE) {
                stateSymbol = <i className="fas fa-times-circle has-text-danger" style={{marginRight: "1em"}} />
            } else {
                stateSymbol = ""
            }

            return (
                <div className={"has-text-left"} style={{width: "100%"}}>
                    <div className={"column is-12 toggle-column-wrapper"}>
                        <div className={"toggle-row"}>
                            <div className={"is-inline-block"}>
                                <p className={"title is-size-5"}>Message channel</p>
                                The channel where stream notifications are posted.
                            </div>
                            <span style={{marginLeft: "auto", marginRight: "1.5rem"}} />
                            <Select
                                className={"wide-select"}
                                name="channel-select"
                                value={this.state.config.twitchWebhookChannel}
                                onChange={(e) => this.handleHookChannelChange(e)}
                                options={this.state.channels}
                                clearable={false}
                                searchable={false}
                                optionComponent={ChannelSelector}
                            />
                        </div>
                    </div>
                    <div className={"column is-12 toggle-column-wrapper"}>
                        <hr className={"dark-hr"} />
                    </div>
                    <div className={"column is-12 toggle-column-wrapper"}>
                        <div className={"toggle-row"}>
                            <div className={"is-inline-block"}>
                                <p className={"title is-size-5"}>Add a streamer</p>
                                Add streamers by typing their name here.
                            </div>
                            <span style={{marginLeft: "auto", marginRight: "1.5rem"}} />
                            {stateSymbol}
                            <DebouncedText placeholder="Streamer's name" addClass={this.state.searchState === SEARCH_BUSY ? "is-loading" : ""}
                                max-length={32} callback={(val) => {
                                    if(val.value.length > 0) {
                                        this.setState({searchState: SEARCH_BUSY}, () => {
                                            this.getLogger().debug("SEARCH_BUSY")
                                            axios.get(BACKEND_URL + "/api/v1/data/twitch/lookup/name/" + val.value).then(e => {
                                                const data = e.data
                                                this.getLogger().debug("data =>", data)
                                                if(data.status === "400") {
                                                    this.setState({searchState: SEARCH_FAILURE}, () => {
                                                        this.getLogger().debug("SEARCH_FAILURE")
                                                        setTimeout(() => {
                                                            this.setState({searchState: SEARCH_READY}, () => {
                                                                this.getLogger().debug("SEARCH_READY")
                                                            })
                                                        }, 1000);
                                                    })
                                                } else {
                                                    this.setState({searchState: SEARCH_SUCCESS}, () => {
                                                        this.getLogger().debug("SEARCH_SUCCESS")
                                                        setTimeout(() => {
                                                            // Update cache
                                                            let streamers = Object.assign({}, this.state.streamers || {})
                                                            streamers[data.id] = data
                                                            // Update config
                                                            let twitchStreamers = this.state.config.twitchStreamers ? this.state.config.twitchStreamers.slice() : []
                                                            twitchStreamers.push(new Streamer(data.id,
                                                                false, "{streamer.name} has started streaming! Check them out here: {link}",
                                                                false, "{streamer.name} has finished streaming.",
                                                                false, "{follower.name} started following {streamer.name}!"))
                                                            let config = Object.assign({}, this.state.config)
                                                            config.twitchStreamers = twitchStreamers
                                                            this.setState({streamers: streamers}, () => {
                                                                this.updateConfig(config, () => {
                                                                    this.setState({searchState: SEARCH_READY}, () => {
                                                                        this.getLogger().debug("SEARCH_READY")
                                                                    })
                                                                })
                                                            })
                                                        }, 1000);
                                                    })
                                                }
                                            }).catch(__ => {
                                                this.setState({searchState: SEARCH_FAILURE}, () => {
                                                    this.getLogger().debug("SEARCH_FAILURE")
                                                    setTimeout(() => {
                                                        this.setState({searchState: SEARCH_READY}, () => {
                                                            this.getLogger().debug("SEARCH_READY")
                                                        })
                                                    }, 1000);
                                                })
                                            })
                                        })
                                    }
                                }} disabled={this.state.searchState !== SEARCH_READY} />
                        </div>
                    </div>
                    <div className={"column is-12 toggle-column-wrapper"}>
                        <hr className={"dark-hr"} />
                    </div>
                    {this.renderStreamers()}
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

    renderStreamers() {
        if(this.state.config && this.state.config.twitchStreamers && this.state.config.twitchStreamers.length > 0) {
            let cards = []
            let key = 0
            this.state.config.twitchStreamers.forEach(configStreamer => {
                cards.push(
                    <TwitchStreamer streamer={this.state.streamers[configStreamer.id]} streamerId={configStreamer.id} config={configStreamer} key={key++}
                        deleteCallback={(streamer) => {
                            let config = Object.assign({}, this.state.config)
                            let streamers = config.twitchStreamers.filter(e => e.id !== streamer.id)
                            // This is absolutely stupid, but I have no idea why this works
                            // when the "correct"-looking way of doing it fails
                            // Basically, if the state is just directly updated, we get stuff
                            // that renders wrong, for reasons beyond me. If we first set it
                            // to an empty array, THEN update and setState({}), it works fine.
                            // I have no idea why, but this works, so don't touch it. 
                            config.twitchStreamers = []
                            this.setState({config: config}, () => {
                                config.twitchStreamers = streamers
                                /*
                                this.setState({config: config}, () => {
                                    this.updateConfig(() => this.getLogger().debug("Updated config:", config))
                                })
                                */
                                this.updateConfig(config, () => this.getLogger().debug("Updated config:", config))
                            })
                        }}
                        resolveStreamerCallback={streamer => {
                            let streamers = Object.assign({}, this.state.streamers || {})
                            streamers[streamer.id] = streamer
                            this.setState({streamers: streamers})
                        }}
                        configCallback={(config) => {
                            this.handleStreamerConfigUpdate(config)
                        }} />
                )
            })
            return cards
        } else {
            return (
                <div className="column is-12 toggle-column-wrapper">
                    <div className="notification is-outlined">
                        You don't have any streamers. Type a streamer's name in the textbox to get started.
                    </div>
                </div>
            )
        }
    }
}

/**
 * Data class to hold config opts
 */
class Streamer {
    constructor(id, streamStartMessagesEnabled, streamStartMessage, streamEndMessagesEnabled,
        streamEndMessage, followMessagesEnabled, followMessage) {
        this.id = id
        this.streamStartMessagesEnabled = streamStartMessagesEnabled
        this.streamStartMessage = streamStartMessage
        this.streamEndMessagesEnabled = streamEndMessagesEnabled
        this.streamEndMessage = streamEndMessage
        this.followMessagesEnabled = followMessagesEnabled
        this.followMessage = followMessage
    }
}

class TwitchStreamer extends MComponent {
    constructor(props) {
        super("TWITCHSTREAMER", props)
        this.state = {expanded: false, streamer: null, config: props.config}
    }

    componentDidMount() {
        if(this.props.streamer) {
            this.getLogger().debug("Rendering with streamer:", this.props.streamer)
            this.setState({streamer: this.props.streamer})
        } else {
            axios.get(BACKEND_URL + "/api/v1/data/twitch/lookup/id/" + this.props.streamerId).then(e => {
                this.getLogger().debug("Rendering with streamer:", e.data)
                this.setState({streamer: e.data})
                this.props.resolveStreamerCallback && this.props.resolveStreamerCallback(e.data)
            })
        }
    }

    renderInner() {
        if(this.state.expanded) {
            return (
                <div style={{width: "100%"}}>
                    <hr className={"dark-hr"} />
                    <div className="columns is-multiline">
                        <OptionToggle name="Stream start notifications" desc="The bot will send a message when this person starts streaming."
                            checkedCallback={() => this.state.config.streamStartMessagesEnabled} callback={() => {
                                let config = Object.assign({}, this.state.config)
                                config.streamStartMessagesEnabled = !config.streamStartMessagesEnabled
                                this.setState({config: config}, () => this.props.configCallback && this.props.configCallback(this.state.config))
                            }} />
                        <div className={"column is-12 toggle-column-wrapper"}>
                            <div className={"toggle-col"}>
                                <div>
                                    <p className={"title is-size-5"}>Stream start message</p>
                                    The message sent when this person starts streaming.
                                </div>
                                <div className={"small-spacer-v"} />
                                <DebouncedTextarea callback={(e) => {
                                    const val = e.textarea_value
                                    let config = Object.assign({}, this.state.config)
                                    config.streamStartMessage = val
                                    this.setState({config: config}, () => this.props.configCallback && this.props.configCallback(this.state.config))
                                }} value={this.state.config.streamStartMessage} rows={4} max-rows={4} />
                            </div>
                        </div>

                        <OptionToggle name="Stream end notifications" desc="The bot will send a message when this person finishes streaming."
                            checkedCallback={() => this.state.config.streamEndMessagesEnabled} callback={() => {
                                let config = Object.assign({}, this.state.config)
                                config.streamEndMessagesEnabled = !config.streamEndMessagesEnabled
                                this.setState({config: config}, () => this.props.configCallback && this.props.configCallback(this.state.config))
                            }} />
                        <div className={"column is-12 toggle-column-wrapper"}>
                            <div className={"toggle-col"}>
                                <div>
                                    <p className={"title is-size-5"}>Stream end message</p>
                                    The message sent when this person finishes streaming.
                                </div>
                                <div className={"small-spacer-v"} />
                                <DebouncedTextarea callback={(e) => {
                                    const val = e.textarea_value
                                    let config = Object.assign({}, this.state.config)
                                    config.streamEndMessage = val
                                    this.setState({config: config}, () => this.props.configCallback && this.props.configCallback(this.state.config))
                                }} value={this.state.config.streamEndMessage} rows={4} max-rows={4} />
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return ""
        }
    }

    render() {
        if(this.state.streamer) {
            return (
                <div className={"column is-12 toggle-column-wrapper"}>
                    <div className={"toggle-row"} style={{flexWrap: "wrap", maxHeight: "128rem", height: "initial"}}>
                        <div className={"is-flex"} style={{flexDirection: "row", alignItems: "center", flexWrap: "true"}}>
                            <img
                                src={this.state.streamer.profile_image_url}
                                alt={"avatar of " + this.state.streamer.display_name} className={"is-inline circle"} style={{width: "32px", height: "32px"}} />
                            <span style={{marginLeft: "0.25em"}} className={"title is-size-5"}>{this.state.streamer.display_name}</span>
                        </div>
                        <span style={{marginLeft: "auto", marginRight: "1.5rem"}} />
                        <a className="button is-primary hover" onClick={() => this.setState({expanded: !this.state.expanded})}>
                            {this.state.expanded ? "Done editing" : "Edit"}
                        </a>
                        {this.renderInner()}
                        <a className={"button is-danger toggle-corner-button hover"} onClick={() => {
                            if(this.props.streamerId !== this.state.streamer.id) {
                                this.getLogger().warn("streamerId (", this.props.streamerId, ") !== this.state.streamer.id (", this.state.streamer.id, ")!")
                            }
                            this.props.deleteCallback && this.props.deleteCallback(this.state.streamer)
                        }}><i className="far fa-trash-alt" /></a>
                    </div>
                </div>
            )
        } else {
            return (
                <div className={"column is-12"}>
                    <div className={"toggle-row is-centered has-text-centered"}>
                        <BubblePreloader colors={["white", "white", "white"]} />
                    </div>
                </div>
            )
        }
    }
}
