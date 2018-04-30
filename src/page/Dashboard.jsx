import {MComponent} from "../MComponent"
import React from "react"
import {NavLink} from "react-router-dom"
import {NoAuth} from "../comp/NoAuth"

const MANAGE_GUILD = 0x00000020

export class Dashboard extends MComponent {
    constructor(props) {
        super("DASHBOARD", props)
        this.state = {guilds: null}
    }

    componentDidMount() {
        this.getSocket().joinChannel("dashboard:" + this.getAuth().getId(), {}, (e) => {
            this.getLogger().debug("Dashboard got socket message:", e)
            const data = e.d.data
            this.setState({guilds: data.guilds})
        })
    }

    componentWillUnmount() {
        this.getSocket().leaveChannel("dashboard:" + this.getAuth().getId())
    }

    renderGuilds() {
        if(this.state.guilds) {
            let guilds = []
            let counter = 0
            this.state.guilds.filter(g => (g.permissions & MANAGE_GUILD) === MANAGE_GUILD).forEach(g => {
                let icon = <p>icon: <img src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`} alt={"guild icon"}/></p>
                if(!g.icon) {
                    icon = <p>no icon :(</p>
                }
                guilds.push(<div key={counter} style={{background: "rgba(0, 0, 0, 0.5)", margin: "1rem"}}>
                    <p>name: {g.name}</p>
                    {icon}
                </div>)
                ++counter
            })
            return (
                <div>
                    {guilds}
                </div>
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
                <div className={"container has-text-left"}>
                    Dashboard!<br/>
                    <NavLink to={"/"}>&lt;-- Back home</NavLink>
                    {this.renderGuilds()}
                </div>
            </div>
        )
    }
}