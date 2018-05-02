import React from 'react'
import {MComponent} from "../MComponent"
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import {NavLink} from "react-router-dom";
import {DiscordLoginButton} from "./DiscordLoginButton";
import {DiscordLogoutButton} from "./DiscordLogoutButton";


class Navbar extends MComponent {
    constructor(props) {
        super("NAVBAR", props)
    }

    getAvatar() {
        const base = `https://cdn.discordapp.com/avatars/${this.props.user.id}`
        if(this.props.user.avatar) {
            const avatar = this.props.user.avatar
            if(avatar.startsWith("a_")) {
                return `${base}/${avatar}.gif`
            } else {
                return `${base}/${avatar}.png`
            }
        } else {
            const avatar = parseInt(this.props.user.discriminator, 10) % 5
            return `${base}/${avatar}.gif`
        }
    }

    navEnd() {
        const community = <a href="https://discord.gg/UwdDN6r" className="navbar-item" target="_blank" rel="noopener noreferrer">Community</a>
        const commands = <NavLink to={"/commands"} className={"navbar-item"}>Commands</NavLink>
        if(this.props.user && this.props.user !== {}) {
            return (
                <div className="navbar-end">
                    {community}
                    {commands}
                    <NavLink to={`/profile/${this.props.user.id}`} className={"navbar-item"}>
                        <img src={this.getAvatar()} className={"circle navbar-user-avatar"} alt="avatar"/>
                        {this.props.user.username}
                    </NavLink>
                    <DiscordLogoutButton className="navbar-item has-text-white" text={"Log out"} />
                </div>
            )
        } else {
            return (
                <div className="navbar-end">
                    {community}
                    {commands}
                    <DiscordLoginButton className="navbar-item has-text-white" text="Log in"/>
                </div>
            )
        }
    }

    render() {
        return (
            <nav className="navbar">
                <div className="container">
                    <div className="navbar-brand">
                        <NavLink to="/" className="navbar-item no-hover">
                            <p className="is-size-3 logo nav-max-height">
                                Mewna
                            </p>
                        </NavLink>
                        <span className="navbar-burger burger" data-target="navbarMenu" onClick={() => {
                            // The following code is based off a toggle menu by @Bradcomp
                            // source: https://gist.github.com/Bradcomp/a9ef2ef322a8e8017443b626208999c1
                            let burger = document.querySelector('.burger')
                            let menu = document.querySelector('#navbarMenu')
                            burger.classList.toggle('is-active')
                            menu.classList.toggle('is-active')
                        }}>
                            <span/>
                            <span/>
                            <span/>
                        </span>
                    </div>
                    <div id="navbarMenu" className="navbar-menu">
                        {this.navEnd()}
                    </div>
                </div>
            </nav>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export const NavbarRedux = withRouter(connect(mapStateToProps)(Navbar))