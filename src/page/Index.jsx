import {MComponent} from "../MComponent"
import {DiscordLoginButton} from "../comp/DiscordLoginButton"
import {NavLink} from "react-router-dom";
/*
import {DiscordLogoutButton} from "../comp/DiscordLogoutButton"
*/
import React from "react"
import {connect} from 'react-redux'

export class Index extends MComponent {
    constructor(props) {
        super("INDEX", props)
    }

    render() {
        return (
            <div className="container index-container" style={{position: "inherit"}}>
                <div className="index-background is-hidden-mobile">
                    <div className="index-background-image" />
                </div>
                <div className={"index-top-spacer-div is-hidden-mobile"} />
                <div className="columns">
                    <div className="column is-6">
                        <section className="section is-medium has-text-centered">
                            {/*<h1 className="title has-text-white is-size-3">Better social integration.</h1>*/}
                            <h1 className="title has-text-white is-size-3">Engage your community.</h1>
                            <p>
                                {/*
                                Mewna is a bot for Discord that automates notifications to your community.<br />
                                Twitch supported and more on the way.
                                Mewna brings notifications directly to your Discord community,<br />
                                with Twitch supported and more on the way.
                                */}
                                Mewna is a <a href="https://discord.com/" className="is-text-link">Discord</a> bot that helps engage your server,<br />
                                with features from chat levels to Twitch notifications.
                            </p>
                            <div className="index-button-container">
                                <DiscordLoginButton className="is-inline-block index-button hover" innerClass="button is-primary" text="Get started" />
                                <div className="index-button hover">
                                    <NavLink to="/features" className="button has-text-white is-black is-borderless">Learn more</NavLink>
                                </div>
                            </div>
                        </section>
                    </div>
                    <div className="column is-6">
                        <section className="section is-medium has-text-centered">
                            <div className="index-mewna-content">
                                <div className="index-mewna-content-inner">
                                    <img src="/discord-box.png" alt="discord" className="index-mewna-floaty-box floaty-box-1" />
                                    <img src="/twitch-box.png" alt="twitch" className="index-mewna-floaty-box floaty-box-2" />
                                    <img src="/unknown-box.png" alt="unknown" className="index-mewna-floaty-box floaty-box-3" />
                                    <img src="/unknown-box.png" alt="unknown" className="index-mewna-floaty-box floaty-box-4" />
                                    <img src="/mewna-laptop.svg" alt="mewna" className="index-mewna-image" />
                                </div>
                            </div>
                        </section>
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