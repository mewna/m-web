import React from "react"
import {BACKEND_URL} from "../../const"
import {MComponent} from "../../MComponent"
import BubblePreloader from 'react-bubble-preloader'
import {debounce} from 'throttle-debounce'

import axios from 'axios'
import Select from "react-select";
import {DashboardPage} from "./DashboardPage";

export class Twitch extends DashboardPage {
    constructor(props) {
        super("TWITCH", props)
        this.state = {channel: null, channels: null}
        this.debouncedTwitchSearch = debounce(500, false, this.handleTwitchSearch)
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
            })
        })
    }

    handleChange(e) {
        this.getLogger().debug(e)
        this.setState({channel: e})
    }

    handleTwitchSearch(e) {
        if(e && e.trim().length > 0) {
            this.getLogger().debug(e)
        } else {
            // TODO: Clear
        }
    }

    render() {
        if(this.state.channels) {
            return (
                <div className={"has-text-left"} style={{width: "100%"}}>
                    <div className="column is-12">
                        <div className="notification is-danger">
                            THIS ENTIRE THING IS NOT READY YET AT ALL. DON'T EXPECT IT TO DO ANYTHING.
                        </div>
                    </div>
                    <div className={"column is-12"}>
                        <hr className={"dark-hr"} />
                    </div>
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
                            {/*
                            <DebouncedText id="streamer_name" maxLength={64} placeholder="Streamer's name" />
                            */}
                            <Select
                                className={"wide-select"}
                                name="channel-select"
                                value={this.state.selectedTwitchChannel}
                                onInputChange={(e) => this.debouncedTwitchSearch(e)}
                                options={this.state.foundTwitchChannels}
                                clearable={true}
                                searchable={true}
                                searchPromptText="Streamer's name"
                                wrapperStyle={{width: "100%", maxWidth: "100%"}}
                            />
                            <a className="button is-primary hover" onClick={() => {}} style={{marginLeft: "1em"}}>Add</a>
                        </div>
                    </div>
                    <div className={"column is-12"}>
                        <hr className={"dark-hr"} />
                    </div>
                    <TwitchStreamer name="secretlyanamy" avatar="https://static-cdn.jtvnw.net/user-default-pictures/cd618d3e-f14d-4960-b7cf-094231b04735-profile_image-300x300.jpg" />
                    <TwitchStreamer name="MorriganSky" avatar="https://static-cdn.jtvnw.net/jtv_user_pictures/66f69f2de183a28d-profile_image-300x300.jpeg" />
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

class TwitchStreamer extends MComponent {
    constructor(props) {
        super("TWITCH:" + props.name, props)
        this.name = props.name
        this.avatar = props.avatar
    }

    render() {
        return (
            <div className={"column is-12"}>
                <div className={"toggle-row"}>
                    <div className={"is-flex"} style={{flexDirection: "row", alignItems: "center"}}>
                        <img
                            src={this.props.avatar}
                            alt={"avatar of " + this.props.name} className={"is-inline circle"} style={{width: "32px", height: "32px"}} />
                        <span style={{marginLeft: "0.25em"}} className={"title is-size-5"}>{this.props.name}</span>
                    </div>
                    <span style={{marginLeft: "auto", marginRight: "1.5rem"}} />
                    <a className="button is-primary hover" onClick={() => {}}>Edit</a>
                </div>
                <a className={"button is-danger toggle-corner-button hover"}><i className="far fa-trash-alt" /></a>
            </div>
        )
    }
}
