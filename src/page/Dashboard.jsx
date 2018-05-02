import {MComponent} from "../MComponent"
import React from "react"
import {NoAuth} from "../comp/NoAuth"
import {GuildCard} from "../comp/dashboard/GuildCard"
import {NavLink} from "react-router-dom"
import BubblePreloader from 'react-bubble-preloader'
import {matchPath} from 'react-router'
import {DashboardCard} from "../comp/dashboard/DashboardCard";
import {GuildIcon} from "../comp/GuildIcon";

const MANAGE_GUILD = 0x00000020

export class Dashboard extends MComponent {
    constructor(props) {
        super("DASHBOARD", props)
        this.state = {guilds: null, connected: false}
    }

    componentDidMount() {
        // TODO: Figure out the smart thing to do with not wasting connections
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
            user.guilds = data.guilds
            this.getStore().updateUser(user)
        })
        this.setState({connected: true})
    }

    componentWillUnmount() {
        this.getSocket().leaveChannel("dashboard:" + this.getAuth().getId())
    }

    renderGuilds() {
        if(this.state.guilds) {
            let guilds = []
            let counter = 0
            this.state.guilds.filter(g => (g.permissions & MANAGE_GUILD) === MANAGE_GUILD).forEach(g => {
                guilds.push(<GuildCard guild={g} key={counter}/>)
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

    renderGuildDashboard(match, page) {
        const guild = this.state.guilds.filter(e => e.id === match.params.id)[0]
        let backLink = ""
        if(match.params.id) {
            backLink = (
                <section className={"section is-small is-not-quite-black column is-12 is-flex"}
                         style={{padding: "1rem", flexDirection: "row", justifyContent: "left", alignItems: "center",
                         marginLeft: "0.75rem", width: "98%", borderRadius: "4px"}}>
                    <GuildIcon guild={guild} /> {guild.name}
                    <NavLink to={"/dashboard"} className={"button is-primary hover"} style={{marginLeft: "auto", marginRight: "1.5rem"}}>
                        Back to server list
                    </NavLink>
                </section>
            )
        }
        if(!page) {
            return (
                <div style={{width: "100%"}}>
                    <div className={"columns is-multiline is-paddingless is-marginless is-centered has-text-centered card-columns"}>
                        {backLink}
                        <DashboardCard name={"Commands"} shortlink={"commands"} guild={guild}>
                            Create custom commands, enable/disable commands, and change the prefix.
                        </DashboardCard>
                        <DashboardCard name={"Notifications"} shortlink={"notifications"} guild={guild}>
                            Set up notifications for Twitch, Reddit, Twitter, and more.
                        </DashboardCard>
                        <DashboardCard name={"Economy"} shortlink={"economy"} guild={guild}>
                            Change the currency and control the economy.
                        </DashboardCard>
                        <DashboardCard name={"Levels"} shortlink={"levels"} guild={guild}>
                            Turn on chat levels, reset experience, and customize the messages.
                        </DashboardCard>
                        <DashboardCard name={"Music"} shortlink={"music"} guild={guild}>
                            Toggle radio and manage what people listen to.
                        </DashboardCard>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    {backLink}<br />
                    page: {page}
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
                <NoAuth/>
                <section className={"section is-small"}/>
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