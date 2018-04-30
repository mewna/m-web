import React from 'react'
import {MComponent} from "../MComponent"
import {withRouter} from 'react-router-dom'

import {BACKEND_URL} from "../const"

import axios from 'axios'

class DiscordLoginButtonInternal extends MComponent {
    constructor(props) {
        super("LOGIN", props)
    }

    componentDidMount() {
        window.addEventListener("message", this.handleLoginMessage.bind(this))
    }

    componentWillUnmount() {
        window.removeEventListener("message", this.handleLoginMessage.bind(this))
    }

    handleLoginMessage(e) {
        let data = e.data
        if(data.type && data.type === "login") {
            this.getLogger().info("Logged in with data:", data)
            // Set basic data
            this.getAuth().clearToken()
            this.getAuth().clearId()
            this.getAuth().setToken(data.key)
            this.getAuth().setId(data.user.id)
            this.getSocket().joinChannel("user:" + data.user.id, {key: data.key})
            this.getSocket().joinChannel("cache:user:" + data.user.id)
            // Request the user data and then redirect
            axios.get(BACKEND_URL + "/api/cache/user/" + data.user.id).then(e => {
                const userData = JSON.parse(e.data)
                this.getStore().updateUser(userData)
                this.getLogger().info("Got user:", userData)
                this.props.history.push('/dashboard')
            })
        }
    }

    tryLogin(e) {
        e.preventDefault()
        this.getLogger().info("Creating OAuth2 dialog...")
        window.open(BACKEND_URL + "/auth/discord", "Discord login", "resizable=no,menubar=no,scrollbars=yes,status=no,height=640,width=480")
    }

    render() {
        const p = Object.assign({}, this.props)
        delete p.staticContext // omegalul
        return (
            <a href="" onClick={e => this.tryLogin(e)} {...p}>{this.props.text}</a>
        )
    }
}

// Allows us access to the history so we can redirect
export const DiscordLoginButton = withRouter(DiscordLoginButtonInternal)