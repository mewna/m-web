import React from 'react'
import {MComponent} from "../MComponent"

import {BACKEND_URL} from "../const"

import axios from 'axios'

export class DiscordLogoutButton extends MComponent {
    constructor(props) {
        super("LOGOUT", props)
    }

    tryLogout() {
        axios.post(BACKEND_URL + "/api/auth/logout", {key: this.getAuth().getToken()}).then(e => {
            this.getLogger().info("Clearing...")
            this.getAuth().clearToken()
            this.getAuth().clearId()
            this.getLogger().info("Redirecting...")
            window.location.replace(BACKEND_URL + "/auth/logout")
        })
    }

    render() {
        const p = Object.assign({}, this.props)
        delete p.staticContext // omegalul
        return (
            <a href="" onClick={e => this.tryLogout()} {...p}>{this.props.text}</a>
        )
    }
}
