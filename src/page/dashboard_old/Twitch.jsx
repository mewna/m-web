import React from "react"
import {BACKEND_URL} from "../../const"
import {DebouncedText} from "../../comp/DebouncedText"
import BubblePreloader from 'react-bubble-preloader'

import axios from 'axios'
import Select from "react-select";
import {DashboardPage} from "./DashboardPage";

export class Twitch extends DashboardPage {
    constructor(props) {
        super("TWITCH", props)
        this.state = {channel: null, channels: null}
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

    render() {
        if(this.state.channels) {
            return (
                <div className={"has-text-left"} style={{width: "100%"}}>
                    <div className={"column is-12"}>
                        <div className={"toggle-row"}>
                            <div className={"is-inline-block"}>
                                <p className={"title is-size-5"}>Message channel</p>
                                The channel that the messages will be sent in.
                            </div>
                            <span style={{marginLeft: "auto", marginRight: "1.5rem"}}/>
                            <Select
                                className={"wide-select"}
                                name="channel-select"
                                value={this.state.channel}
                                onChange={(e) => this.handleChange(e)}
                                options={this.state.channels}
                                clearable={false}
                            />
                        </div>
                    </div>
                    <div className={"column is-12"}>
                        <hr className={"dark-hr"}/>
                    </div>
                    <div className={"column is-12"}>
                        <div className={"toggle-row"}>
                            <div className={"is-inline-block"}>
                                <p className={"title is-size-5"}>Add a streamer</p>
                                Add streamers by typing their names here.
                            </div>
                            <span style={{marginLeft: "auto", marginRight: "1.5rem"}}/>
                            <DebouncedText id="streamer_name" maxLength={64}/>
                        </div>
                    </div>
                    <div className={"column is-12"}>
                        <hr className={"dark-hr"}/>
                    </div>
                    <div className={"column is-12"}>
                        <div className={"toggle-row"}>
                            <div className={"is-flex"} style={{flexDirection: "row", alignItems: "center"}}>
                                <img
                                    src={"https://static-cdn.jtvnw.net/user-default-pictures/cd618d3e-f14d-4960-b7cf-094231b04735-profile_image-300x300.jpg"}
                                    alt={"avatar"} className={"is-inline circle"} style={{width: "32px", height: "32px"}}/>
                                <span style={{marginLeft: "0.25em"}} className={"title is-size-5"}>secretlyanamy</span>
                            </div>
                            <span style={{marginLeft: "auto", marginRight: "1.5rem"}}/>
                        </div>
                        <a className={"button is-danger toggle-corner-button"}><i className="far fa-trash-alt"/></a>
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
