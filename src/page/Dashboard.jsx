import {MComponent} from "../MComponent"
import React from "react"
import {NavLink} from "react-router-dom"
import {NoAuth} from "../comp/NoAuth"
import {GuildCard} from "../comp/dashboard/GuildCard";

const MANAGE_GUILD = 0x00000020

export class Dashboard extends MComponent {
    constructor(props) {
        super("DASHBOARD", props)
        this.state = {guilds: null}
    }

    componentDidMount() {
        this.setState({
            guilds: [
                {
                    "permissions": 2146958591,
                    "owner": true,
                    "name": "amy's personal bottos",
                    "id": "206584013790380033",
                    "icon": null
                },
                {
                    "permissions": 2146958591,
                    "owner": true,
                    "name": "amy incorporated™",
                    "id": "267500017260953601",
                    "icon": "b5f93c5470f0950430d1ad8346ca69e7"
                },
                {
                    "permissions": 2146958591,
                    "owner": true,
                    "name": "Occasionally Things Happen Here",
                    "id": "128316392909832192",
                    "icon": null
                },
            ]
        })
        /*
        this.getSocket().joinChannel("dashboard:" + this.getAuth().getId(), {}, (e) => {
            this.getLogger().debug("Dashboard got socket message:", e)
            const data = e.d.data
            this.setState({guilds: data.guilds})
        })
        */
    }

    componentWillUnmount() {
        /*
        this.getSocket().leaveChannel("dashboard:" + this.getAuth().getId())
        */
    }

    renderGuilds() {
        if(this.state.guilds) {
            let guilds = []
            let counter = 0
            this.state.guilds.filter(g => (g.permissions & MANAGE_GUILD) === MANAGE_GUILD).forEach(g => {
                guilds.push(<GuildCard guild={g} key={counter} className={"column is-3"}/>)
                ++counter
            })
            return (
                guilds
            )
        } else {
            return (
                <div>
                    Nothing! Wow! :O
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                <NoAuth/>
                <section className={"section is-small"}/>
                Dashboard!<br/>
                <NavLink to={"/"}>&lt;-- Back home</NavLink>
                <div className={"container has-text-left"}>
                    <div className={"columns"}>
                        {this.renderGuilds()}
                    </div>
                </div>
            </div>
        )
    }
}