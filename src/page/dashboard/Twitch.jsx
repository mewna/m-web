import React from "react"
import {BACKEND_URL} from "../../const"
import {MComponent} from "../../MComponent"
import BubblePreloader from 'react-bubble-preloader'
import {debounce} from 'throttle-debounce'

import axios from 'axios'
import Select from "react-select"
import {DashboardPage} from "./DashboardPage"
import {DebouncedText} from "../../comp/DebouncedText"

const SEARCH_READY = 0
const SEARCH_BUSY = 1
const SEARCH_SUCCESS = 2
const SEARCH_FAILURE = 3

/*
 * Webhook URL format:
 * https://discordapp.com/oauth2/authorize
 *      ?response_type=code
 *      &client_id=CLIENT_ID
 *      &redirect_uri=CALLBACK_URL
 *      &scope=webhook.incoming
 *      &state=STATE
 *      &guild_id=GUILD_ID
 *      &channel_id=CHANNEL_ID
 */

export class Twitch extends DashboardPage {
    constructor(props) {
        super("TWITCH", props)
        this.state = {channel: null, channels: null, searchState: SEARCH_READY, streamers: []} // TODO: Make this from the config instead...
        this.debouncedTwitchSearch = debounce(500, false, this.handleTwitchSearch)
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
            })
        })
    }

    handleChange(e) {
        this.getLogger().debug(e)
        this.setState({channel: e})
    }

    handleTwitchSearch(e) {
        if(e.value && e.value.trim().length > 0) {
            this.getLogger().debug(e.value)
        } else {
            // TODO: Clear
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
                    <div className={"column is-12"}>
                        <div className={"toggle-row"}>
                            <div className={"is-inline-block"}>
                                <p className={"title is-size-5"}>Message channel</p>
                                The channel where stream notifications are posted.
                            </div>
                            <span style={{marginLeft: "auto", marginRight: "1.5rem"}} />
                            <Select
                                className={"wide-select"}
                                name="channel-select"
                                value={this.state.channel}
                                onChange={(e) => this.handleChange(e)}
                                options={this.state.channels}
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
                                <p className={"title is-size-5"}>Add a streamer</p>
                                Add streamers by typing their name here.
                            </div>
                            <span style={{marginLeft: "auto", marginRight: "1.5rem"}} />
                            {stateSymbol}
                            <DebouncedText placeholder="Streamer's name" addClass={this.state.searchState === SEARCH_BUSY ? "is-loading" : ""} max-length={32} callback={(val) => {
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
                                                        this.setState({searchState: SEARCH_READY}, () => {
                                                            let streamers = this.state.config.twitchStreamers.slice()
                                                            streamers.push(data)
                                                            let config = Object.assign({}, this.state.config)
                                                            config.twitchStreamers = streamers
                                                            this.setState({config: config}, () => {
                                                                this.getLogger().debug("SEARCH_READY")
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
                    <div className={"column is-12"}>
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
            this.state.config.twitchStreamers.forEach(e => cards.push(
                <TwitchStreamer streamer={e} key={key++} deleteCallback={(streamer) => {
                    let config = Object.assign({}, this.state.config)
                    let streamers = config.twitchStreamers.splice(0, config.twitchStreamers.length)
                    streamers = streamers.filter(e => e.id !== streamer.id)
                    config.twitchStreamers = streamers
                    this.setState({config: config})
                }}/>
            ));
            return cards
        } else {
            return (
                <div className="column is-12">
                    <div className="notification is-outlined">
                        You don't have any streamers. Type a streamer's name in the textbox to get started.
                    </div>
                </div>
            )
        }
    }
}

class TwitchStreamer extends MComponent {
    constructor(props) {
        super("TWITCH:" + props.streamer.display_name, props)
    }

    render() {
        return (
            <div className={"column is-12"}>
                <div className={"toggle-row"}>
                    <div className={"is-flex"} style={{flexDirection: "row", alignItems: "center"}}>
                        <img
                            src={this.props.streamer.profile_image_url}
                            alt={"avatar of " + this.props.streamer.display_name} className={"is-inline circle"} style={{width: "32px", height: "32px"}} />
                        <span style={{marginLeft: "0.25em"}} className={"title is-size-5"}>{this.props.streamer.display_name}</span>
                    </div>
                    <span style={{marginLeft: "auto", marginRight: "1.5rem"}} />
                    <a className="button is-primary hover" onClick={()=>{}}>Edit</a>
                </div>
                <a className={"button is-danger toggle-corner-button hover"} onClick={() => {
                        this.props.deleteCallback && this.props.deleteCallback(this.props.streamer)
                    }}><i className="far fa-trash-alt" /></a>
            </div>
        )
    }
}
