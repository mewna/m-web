/* eslint jsx-a11y/anchor-is-valid: 0 */

import React from "react"
import {MComponent} from "../../MComponent";
import BubblePreloader from 'react-bubble-preloader'
import {BACKEND_URL} from "../../const";
import axios from "axios";

export class Webhooks extends MComponent {
    constructor(props) {
        super("WEBHOOKS", props)
        this.state = {
            webhooks: null,
            channels: null,
        }
    }

    componentDidMount() {
        this.fetchWebhooks()
        window.addEventListener("message", this.handleHookCreate.bind(this))
    }

    componentWillUnmount() {
        window.removeEventListener("message", this.handleHookCreate.bind(this))
    }

    fetchWebhooks() {
        axios.get(BACKEND_URL + `/api/v1/data/guild/${this.props.guild.id}/webhooks`, {headers: {"Authorization": this.getAuth().getToken()}}).then(f => {
            let hooks = JSON.parse(f.data)
            this.setState({
                webhooks: hooks,
            })
        })
        axios.get(BACKEND_URL + `/api/v1/cache/guild/${this.props.guild.id}/channels`, {headers: {"Authorization": this.getAuth().getToken()}}).then(f => {
            let channels = f.data
            this.setState({
                channels: channels,
            })
        })
    }

    renderHooks() {
        if(this.state.webhooks.length > 0) {
            let key = 0
            let cards = []
            this.state.webhooks.forEach(e => {
                let channel = this.state.channels.filter(c => c.id === e.channel)[0]
                if(channel) {
                    cards.push(
                        <Webhook hook={e} channel={channel} key={key++} del={e => this.updateHooksLater(e)} />
                    )
                }
            })
            return cards
        } else {
            return (
                <div className="column is-12 toggle-column-wrapper">
                    <div className="notification is-outlined">
                        You don't have any webhooks. Press "Create Webhook" to get started.
                    </div>
                </div>
            )
        }
    }

    updateHooksLater(id) {
        let hooks = this.state.webhooks.filter(e => e.id !== id)
        this.setState({webhooks: hooks})
    }

    handleHookCreate(e) {
        this.getLogger().debug("Got message for Webhooks#handleHookCreate:", e)
        if(e.data && e.data && e.data.hook_created) {
            this.getLogger().debug("New hook created, refresh in 500ms")
            setTimeout(() => this.fetchWebhooks(), 500)
        }
    }

    handleCreateClick(e) {
        e.preventDefault()
        window.open(BACKEND_URL + `/api/v1/connect/discord/webhooks/start?guild=${this.props.guild.id}`,
                "Discord webhook authorization", "resizable=no,menubar=no,scrollbars=yes,status=no,height=640,width=480")
    }

    render() {
        if(this.state.webhooks && this.state.channels) {
            return (
                <div className={"has-text-left"} style={{width: "100%"}}>
                    <div className="is-flex" style={{width: "100%", alignContent: "center", alignItems: "center", marginBottom: "2.5em"}}>
                        <div>
                            <a className="button is-primary" onClick={e => this.handleCreateClick(e)}>
                                Create webhook
                            </a>
                        </div>
                    </div>
                    {this.renderHooks()}
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

// [{"channel":"454123181637238784","guild":"267500017260953601","id":"508190368768983041"}]
class Webhook extends MComponent {
    constructor(props) {
        super("WEBHOOK", props)
    }

    render() {
        return (
            <div className={"column is-12 toggle-column-wrapper"}>
                <div className={"toggle-row"}>
                    <div>
                        <p className={"title is-size-5"}>#{this.props.channel.name}</p>
                    </div>
                    <span style={{marginLeft: "auto", marginRight: "1.5rem"}} />
                    <a className={"button is-danger toggle-corner-button"} onClick={e => {
                        this.getLogger().debug("fetching hook", this.props.hook.id, "for guild", this.props.channel.guildId)
                        axios.delete(BACKEND_URL + `/api/v1/data/guild/${this.props.channel.guildId}/webhooks/${this.props.hook.id}`, 
                            {headers: {"Authorization": this.getAuth().getToken()}}).then(h => {
                            this.props.del(this.props.hook.id)
                        })
                    }}><i className="far fa-trash-alt" /></a>
                </div>
            </div>
        )
    }
}