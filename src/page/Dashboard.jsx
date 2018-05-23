import {MComponent} from "../MComponent"
import React from "react"
import {NoAuth} from "../comp/NoAuth"
import {GuildCard} from "../comp/dashboard/GuildCard"
import {NavLink} from "react-router-dom"
import BubblePreloader from 'react-bubble-preloader'
import {matchPath} from 'react-router'
import {DashboardCard} from "../comp/dashboard/DashboardCard"
import {GuildIcon} from "../comp/GuildIcon"

import {Economy} from "./dashboard/Economy"
import {Emotes} from "./dashboard/Emotes"
import {Levels} from "./dashboard/Levels"
import {Misc} from "./dashboard/Misc"
import {Music} from "./dashboard/Music"
import {Twitch} from "./dashboard/Twitch"
import {Welcoming} from "./dashboard/Welcoming"

import axios from 'axios'
import {BACKEND_URL} from "../const";

const MANAGE_GUILD = 0x00000020

export class Dashboard extends MComponent {
    constructor(props) {
        super("DASHBOARD", props)
        this.state = {guilds: null, connected: false, config: null, pluginMetadata: null}
    }

    componentDidMount() {
        // TODO: Figure out the smart thing to do with not wasting connections
        this.getLogger().debug("Starting dashboard join...")
        try {
            this.getSocket().joinChannel("dashboard:" + this.getAuth().getId(), {}, (e) => {
                this.getLogger().debug("Dashboard got socket message:", e)
                const data = e.d.data
                this.setState({guilds: data.guilds})
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
                    axios.get(BACKEND_URL + "/api/metadata/plugins").then(e => {
                        this.getLogger().debug("Got plugin metadata:", e.data)
                        this.setState({pluginMetadata: e.data})
                        this.setState({connected: true})
                    })
                }
            })
        } catch(e) {
            this.getLogger().error("Connect error:", e)
        }
    }

    componentWillUnmount() {
        this.getSocket().leaveChannel("dashboard:" + this.getAuth().getId())
    }

    renderGuilds() {
        if(this.state.guilds) {
            let guilds = []
            let counter = 0
            this.state.guilds.filter(g => (g.permissions & MANAGE_GUILD) === MANAGE_GUILD).forEach(g => {
                guilds.push(<GuildCard guild={g} key={counter} />)
                ++counter
            })
            return (
                guilds
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
        let backLink = ""
        let pageName = ""
        if(page) {
            pageName = " - " + (page.charAt(0).toUpperCase() + page.substr(1))
        }
        if(match.params.id) {
            let parent = "/dashboard"
            let backText = "Back to server list"
            if(page) {
                parent += "/" + guild.id
                backText = "Back to dashboard"
            }
            backLink = (
                <section className={"section is-small is-not-quite-black is-flex"}
                    style={{
                        padding: "1rem", flexDirection: "row", justifyContent: "left", alignItems: "center",
                        margin: "0.75rem", borderRadius: "4px", width: "100%"
                    }}>
                    <GuildIcon guild={guild} />
                    <div>
                        <p className={"is-size-4"}>{guild.name}{pageName}</p>
                    </div>
                    <NavLink to={parent} className={"button is-primary hover"}
                        style={{marginLeft: "auto", marginRight: "1.5rem"}}>
                        {backText}
                    </NavLink>
                </section>
            )
        }
        if(!page) {
            return (
                <div style={{width: "100%"}}>
                    <div
                        className={"columns is-multiline is-paddingless is-marginless is-centered has-text-centered card-columns"}>
                        {backLink}
                        <div className={"column is-12"}>
                            <hr className={"dark-hr"} />
                        </div>
                        {this.renderGuildDashboardCards(guild)}
                        {/*
                        <DashboardCard name={"Commands"} shortlink={"commands"} guild={guild}>
                            Enable/disable commands, and change the prefix.
                        </DashboardCard>
                        <DashboardCard name={"Twitch"} shortlink={"twitch"} guild={guild}>
                            Get notified when your favourite streamers start streaming.
                        </DashboardCard>
                        <DashboardCard name={"Economy"} shortlink={"economy"} guild={guild}>
                            Change the currency symbol and control the economy.
                        </DashboardCard>
                        <DashboardCard name={"Levels"} shortlink={"levels"} guild={guild}>
                            Turn on chat levels, give level rewards, and customize the messages.
                        </DashboardCard>
                        <DashboardCard name={"Music"} shortlink={"music"} guild={guild}>
                            Control the music in your server.
                        </DashboardCard>
                        <DashboardCard name={"Welcoming"} shortlink={"welcoming"} guild={guild}>
                            Welcome/goodbye messages and join roles.
                        </DashboardCard>
                        */}
                    </div>
                </div>
            )
        } else {
            let pageData = ""
            switch(page.toLowerCase()) {
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
            pageData = (
                <div style={{width: "100%"}}>
                    <div className={"column is-12"}>
                        <hr className={"dark-hr"} />
                    </div>
                    {pageData}
                </div>
            )
            return (
                <div style={{width: "100%"}}>
                    <div
                        className={"columns is-multiline is-paddingless is-marginless is-centered has-text-centered card-columns"}>
                        {backLink}
                        {pageData}
                    </div>
                </div>
            )
        }
    }

    /**
     * We don't want to constantly un/mount this component due to it putting
     * unnecessary pressure on the ESP socket connection. So instead, we just
     * glob on EVERYTHING that matches `/dashboard*`, then parse out the route
     * parameters by ourselves. By doing this, we can avoid unneeded remounts
     * of this component, and still get the benefits of react.
     *
     * @see https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/matchPath.md
     */
    computeParams() {
        return matchPath(this.props.match.url, {
            path: "/dashboard/:id/:page?",
            exact: false,
            strict: false
        }) || {params: {}} // If no match, return a default that won't cause null dereferences
    }

    chooseRender(match) {
        if(match.params.id && this.state.guilds) {
            return this.renderGuildDashboard(match, match.params.page)
        } else {
            return this.renderGuilds()
        }
    }

    render() {
        const match = this.computeParams()
        return (
            <div>
                <NoAuth />
                <section className={"section is-small"} />
                <div className={"columns has-text-centered is-centered is-paddingless is-marginless"}>
                    <div className="column is-10">
                        <div
                            className={"columns is-multiline is-paddingless is-marginless is-centered has-text-centered card-columns"}>
                            {this.chooseRender(match)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}