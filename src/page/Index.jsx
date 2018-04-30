import {MComponent} from "../MComponent"
import {DiscordLoginButton} from "../comp/DiscordLoginButton"
import {DiscordLogoutButton} from "../comp/DiscordLogoutButton"
import React from "react"
import {NavLink} from "react-router-dom";
import {connect} from 'react-redux'

export class Index extends MComponent {
    constructor(props) {
        super("INDEX", props)
    }

    render() {
        let user;
        if(this.getStore().getUser()) {
            const u = this.getStore().getUser()
            user = u.name + "#" + u.discriminator + " -> " + u.id
        } else {
            user = "Not logged in"
        }
        return (
            <div className="row">
                <div className="column column-75">
                    <section className={"section is-small"}></section>
                    Logged in as: {user}
                    <div className={"container has-text-left"}>
                        <DiscordLoginButton text="login"/><br/>
                        <DiscordLogoutButton text="logout"/><br/>
                        <NavLink to={"/dashboard"}>dashboard</NavLink>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export const IndexRedux = connect(mapStateToProps)(Index)