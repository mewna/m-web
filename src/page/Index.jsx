import {MComponent} from "../MComponent"
import {DiscordLoginButton} from "../comp/DiscordLoginButton"
import {NavLink} from "react-router-dom";
/*
import {DiscordLogoutButton} from "../comp/DiscordLogoutButton"
*/
import React from "react"
import {connect} from 'react-redux'
import {VHContainer} from './VHContainer'

export class Index extends MComponent {
    constructor(props) {
        super("INDEX", props)
    }

    render() {
        /*
        let user;
        if(this.getStore().getUser()) {
            const u = this.getStore().getUser()
            user = u.username + "#" + u.discriminator + " -> " + u.id
        } else {
            user = "Not logged in"
        }
        return (
            <div>
                <section className={"section is-small"}></section>
                Logged in as: {user}
                <div className={"container has-text-left"}>
                    <DiscordLoginButton text="login" /><br />
                    <DiscordLogoutButton text="logout" /><br />
                    <NavLink to={"/discord/dashboard"}>dashboard</NavLink>
                </div>
            </div>
        )
        */

        return (
            <VHContainer>
                <section className="section is-medium has-text-centered">
                    <h1 className="title has-text-white is-size-3">Better social integration.</h1>
                    <p>
                        {/*
                        Mewna is a bot for Discord that automates notifications to your community.<br />
                        Twitch supported and more on the way.
                        */}
                        Mewna brings notifications directly to your community, with Twitch<br />
                        supported and more on the way.
                    </p>
                    <div className="index-button-container">
                        <DiscordLoginButton className="is-inline-block index-button hover" innerClass="button is-primary" text="Get started" />
                        <div className="index-button hover">
                            <NavLink to="/features" className="button has-text-white is-not-quite-black is-borderless">Learn more</NavLink>
                        </div>
                    </div>
                </section>
                <section className={"section is-small"} />
            </VHContainer>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export const IndexRedux = connect(mapStateToProps)(Index)