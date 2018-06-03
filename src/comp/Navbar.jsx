import React from 'react'
import {MComponent} from "../MComponent"
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import {NavLink} from "react-router-dom"
import {DiscordLoginButton} from "./DiscordLoginButton"
import {DiscordLogoutButton} from "./DiscordLogoutButton"
import onClickOutside from 'react-onclickoutside'


class UserMenuInternal extends MComponent {
    constructor(props) {
        super("USERMENUINTERNAL", props)
        this.state = {drop: false}
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
            return `${base}/${avatar}.png`
        }
    }

    handleClick(e) {
        if(e.target.tagName !== "A") {
            this.doNothing(e)
        }
        this.setState({drop: !this.state.drop})
    }

    collapse() {
        this.setState({drop: false})
    }

    handleClickOutside(e) {
        this.collapse()
    }

    doNothing(e) {
        e.preventDefault()
    }

    render() {
        let cls = "navbar-item has-dropdown"
        if(this.state.drop) {
            cls += " is-active"
        }
        return (
            <div className={cls} onClick={(e) => this.handleClick(e)}>
                <a className="navbar-link" onClick={(e) => this.doNothing(e)}>
                    <img src={this.getAvatar()} alt="avatar" className="image is-24x24 circle is-inline-block" />
                    <span className="is-inline-block" style={{"margin": "0.25em"}}></span>{this.props.user.username}
                </a>
                <div className="navbar-dropdown is-boxed">
                    <NavLink className="navbar-item" to={`/profile/${this.props.user.id}`}>Profile</NavLink>
                    <NavLink className="navbar-item" to="/dashboard">Dashboard</NavLink>
                    <hr className="navbar-divider" />
                    <DiscordLogoutButton className="navbar-item has-text-white" text={"Log out"} />
                </div>
            </div>
        )
    }
}
const UserMenu = onClickOutside(UserMenuInternal)

class Navbar extends MComponent {
    constructor(props) {
        super("NAVBAR", props)
    }

    navEnd() {
        const community = <a href="https://discord.gg/UwdDN6r" className="navbar-item" target="_blank" rel="noopener noreferrer">Community</a>
        const commands = <NavLink to={"/commands"} className={"navbar-item"}>Commands</NavLink>
        if(this.props.user && this.props.user !== {}) {
            return (
                <div className="navbar-end">
                    {community}
                    {commands}
                    <UserMenu user={this.props.user} />
                </div>
            )
        } else {
            return (
                <div className="navbar-end">
                    {community}
                    {commands}
                    <DiscordLoginButton className="navbar-item has-text-white" text="Log in" />
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
                            <span />
                            <span />
                            <span />
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