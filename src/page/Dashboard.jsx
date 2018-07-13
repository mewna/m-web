import {MComponent} from "../MComponent"
import React from "react"
import {NoAuth} from "../comp/NoAuth"
import {GuildCard} from "../comp/dashboard/GuildCard"
import {NavLink} from "react-router-dom"
import BubblePreloader from 'react-bubble-preloader'
import {matchPath} from 'react-router'
import {DashboardCard} from "../comp/dashboard/DashboardCard"
import {GuildHeader} from '../comp/GuildHeader'

import {Behaviour} from './dashboard/Behaviour'
import {Economy} from "./dashboard/Economy"
import {Emotes} from "./dashboard/Emotes"
import {Levels} from "./dashboard/Levels"
import {Misc} from "./dashboard/Misc"
import {Music} from "./dashboard/Music"
import {Twitch} from "./dashboard/Twitch"
import {Welcoming} from "./dashboard/Welcoming"

import axios from 'axios'
import {BACKEND_URL} from "../const"
import {VHContainer} from "./VHContainer"
import {withRouter} from 'react-router-dom'

const MANAGE_GUILD = 0x00000020

class DashboardInternal extends MComponent {
    constructor(props) {
        super("DASHBOARD", props)
        // /api/v1/cache/guild/:id/exists
        this.state = {guilds: null, connected: false, config: null, pluginMetadata: null, existStates: {}}
    }

    async fetchGuildsExist(guilds) {
        let data = {}
        let promises = []
        guilds.forEach(async e => {
            let promise = axios.get(`${BACKEND_URL}/api/v1/cache/guild/${e.id}/exists`).then(res => data[e.id] = res.data)
            promises.push(promise)
        })
        await Promise.all(promises)
        this.setState({existStates: data}, () => {
            this.getLogger().debug("fetched states:", this.state.existStates)
            this.getLogger().debug("have:", Object.keys(this.state.existStates).length, "and expect:", this.state.guilds.length)
        })
    }

    componentDidMount() {
        // TODO: Figure out the smart thing to do with not wasting connections
        this.getLogger().debug("Starting dashboard join...")
        try {
            this.getSocket().joinChannel("dashboard:" + this.getAuth().getId(), {}, (e) => {
                this.getLogger().debug("Dashboard got socket message:", e)
                const data = e.d.data
                this.setState({guilds: data.guilds.filter(g => (g.permissions & MANAGE_GUILD) === MANAGE_GUILD)}, 
                    () => this.fetchGuildsExist(this.state.guilds))
                // So this works, because when the user first logs in, there are no guilds send in the login message
                // which means that this will go "loading screen"
                // Once the socket connects, we get all the guilds and update the global user
                // And it's all good after that
                // :thumbsup:
                const user = data.user
                if(user === null || user === undefined) {
                    this.getLogger().error("No user retrieved from API!?")
                } else {
                    user.guilds = data.guilds
                    this.getStore().updateUser(user)
                    // Fetch plugin metadata
                    axios.get(BACKEND_URL + "/api/v1/metadata/plugins").then(e => {
                        this.getLogger().debug("Got plugin metadata:", e.data)
                        this.setState({pluginMetadata: e.data})
                        this.setState({connected: true})
                    })
                }
            })
        } catch(e) {
            this.getLogger().error("Connect error:", e)
        }
        window.addEventListener("message", this.handleAddMessage.bind(this))
    }

    componentWillUnmount() {
        window.removeEventListener("message", this.handleAddMessage.bind(this))
        this.getSocket().leaveChannel("dashboard:" + this.getAuth().getId())
    }

    handleAddMessage(e) {
        let data = e.data
        if(data.bot_added) {
            this.getLogger().info("Joined", data.guild_id)
            const link = `/discord/dashboard/${data.guild_id}`
            this.props.history.push(link)
        }
    }

    renderGuilds() {
        if(this.state.guilds && Object.keys(this.state.existStates).length === this.state.guilds.length) {
            let guilds = []
            let counter = 0
            this.state.guilds.filter(g => (g.permissions & MANAGE_GUILD) === MANAGE_GUILD).forEach(g => {
                guilds.push(<GuildCard guild={g} key={counter} callback={guild => {
                    if(this.state.existStates[guild.id].exists) {
                        // push history state
                        this.getLogger().info("Have guild", guild.id, "->", this.state.existStates[guild.id])
                        const link = `/discord/dashboard/${guild.id}`
                        this.props.history.push(link)
                    } else {
                        // open oauth prompt
                        this.getLogger().info("Don't have guild", guild.id)
                        this.getLogger().info("Creating guild add prompt...")
                        window.open(BACKEND_URL + `/api/v1/connect/discord/bot/add/start?guild=${guild.id}`,
                            "Discord webhook authorization", "resizable=no,menubar=no,scrollbars=yes,status=no,height=640,width=480")
                    }
                }}/>)
                ++counter
            })
            return guilds
        } else {
            return (
                <div className="has-text-centered" style={{width: "100%"}}>
                    <BubblePreloader
                        colors={["white", "white", "white"]}
                    />
                </div>
            )
        }
    }

    renderGuildDashboardCards(guild) {
        if(this.state.pluginMetadata) {
            let cards = []
            let key = 0
            this.state.pluginMetadata.forEach(e => {
                cards.push(
                    <DashboardCard key={key} name={e.name} shortlink={e.name.toLowerCase()} guild={guild}>
                        {e.desc}
                    </DashboardCard>
                )
                ++key
            })
            return cards
        } else {
            return []
        }
    }

    renderGuildDashboard(match, page) {
        const guild = this.state.guilds.filter(e => e.id === match.params.id)[0]
        if(!page) {
            return (
                <div>
                    {this.renderGuildDashboardCards(guild)}
                </div>
            )
        } else {
            let pageData = ""
            switch(page.toLowerCase()) {
                case "behaviour":
                    pageData = <Behaviour guild={guild} />
                    break;
                case "economy":
                    pageData = <Economy guild={guild} />
                    break
                case "emotes":
                    pageData = <Emotes guild={guild} />
                    break
                case "levels":
                    pageData = <Levels guild={guild} />
                    break
                case "misc":
                    pageData = <Misc guild={guild} />
                    break
                case "music":
                    pageData = <Music guild={guild} />
                    break
                case "twitch":
                    pageData = <Twitch guild={guild} />
                    break
                case "welcoming":
                    pageData = <Welcoming guild={guild} />
                    break
                default:
                    pageData = "Unknown page?"
                    break
            }
            return (
                <div style={{width: "100%"}}>
                    {pageData}
                </div>
            )
        }
    }

    /**
     * We don't want to constantly un/mount this component due to it putting
     * unnecessary pressure on the ESP socket connection. So instead, we just
     * glob on EVERYTHING that matches `/discord/dashboard*`, then parse out the route
     * parameters by ourselves. By doing this, we can avoid unneeded remounts
     * of this component, and still get the benefits of react.
     *
     * @see https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/matchPath.md
     */
    computeParams() {
        return matchPath(this.props.match.url, {
            path: "/discord/dashboard/:id/:page?",
            exact: false,
            strict: false
        }) || {params: {}} // If no match, return a default that won't cause null dereferences
    }

    renderHeader(match) {
        if(match.params.id && this.state.guilds) {
            const guild = this.state.guilds.filter(e => e.id === match.params.id)[0]
            const page = match.params.page
            let pageName = null
            if(page) {
                pageName = " - " + (page.charAt(0).toUpperCase() + page.substr(1))
            }
            let parent = "/discord/dashboard"
            let backText = "Back to server list"
            if(page) {
                parent += "/" + guild.id
                backText = "Back to dashboard"
            }
            let backLink = (
                <NavLink to={parent} className={"button is-primary hover"} style={{marginRight: "1.25em"}}>
                    {backText}
                </NavLink>
            )
            return (
                <GuildHeader guild={guild} titleExtra={pageName}>
                    {backLink}
                </GuildHeader>
            )
        } else {
            return ""
        }
    }

    chooseRender(match) {
        if(match.params.id && this.state.guilds) {
            return (
                <div className={"columns is-multiline is-paddingless is-marginless is-centered has-text-centered card-columns"}>
                    {this.renderGuildDashboard(match, match.params.page)}
                </div>
            )
        } else if(match.params.id) {
            return (
                <BubblePreloader
                    colors={["white", "white", "white"]}
                />
            )
        } else {
            return (
                <div className="has-text-centered" style={{width: "100%"}}>
                    <section className="section is-small" />
                    <p className="is-size-3">Select a server</p>
                    <div className={"columns is-multiline is-paddingless is-marginless is-centered has-text-centered card-columns"}>
                        {this.renderGuilds()}
                    </div>
                </div>
            )
        }
    }

    render() {
        const match = this.computeParams()
        return (
            <div>
                {this.renderHeader(match)}
                {/* 
                Sooooo it turns out we can't do this in App.js because it causes fire with route params. 
                neet, I know. 
                This wraps the page in a nice div to give us a container and other main-element-features. 
                */}
                <VHContainer>
                    <NoAuth />
                    <div className={"columns has-text-centered is-centered is-paddingless is-marginless"}>
                        <div className="column is-10">
                            {this.chooseRender(match)}
                        </div>
                    </div>
                </VHContainer>
            </div >
        )
    }
}

export const Dashboard = withRouter(DashboardInternal)