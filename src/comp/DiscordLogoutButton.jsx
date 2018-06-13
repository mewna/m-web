import React from 'react'
import {MComponent} from "../MComponent"
import {withRouter} from 'react-router-dom'

import {BACKEND_URL} from "../const"

import axios from 'axios'

export class DiscordLogoutButtonInternal extends MComponent {
    constructor(props) {
        super("LOGOUT", props)
    }

    tryLogout(e) {
        e.preventDefault()
        // noinspection JSUnusedLocalSymbols
        axios.post(BACKEND_URL + "/api/v1/auth/logout", {key: this.getAuth().getToken()}).then(_ => {
            this.getAuth().clearToken()
            this.getAuth().clearId()
            this.getStore().clear()
            this.getSocket().leaveAllChannels()
            this.getSocket().reconnect()
            this.props.history.push('/')
        })
    }

    render() {
        const p = Object.assign({}, this.props)
        delete p.staticContext // omegalul
        // noinspection JSUnusedLocalSymbols
        return (
            <a href="" onClick={e => this.tryLogout(e)} {...p}>{this.props.text}</a>
        )
    }
}

export const DiscordLogoutButton = withRouter(DiscordLogoutButtonInternal)