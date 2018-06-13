import React from 'react'
import {withRouter} from 'react-router-dom'

import {MComponent} from "../MComponent"

import axios from 'axios'

import {BACKEND_URL} from "../const"

class NoAuthInternal extends MComponent {
    constructor(props) {
        super("NOAUTH", props)
        this.state = {user: null}
    }

    tryRedir() {
        axios.get(BACKEND_URL + "/api/v1/heartbeat", {headers: {"authorization": this.getAuth().getToken()}})
            .then(data => {
                const user = data.data.check
                this.getLogger().info("Got NoAuth data:", user)
                if(!user || user === null || user === undefined) {
                    this.getLogger().warn("NoAuth triggered")
                    this.getAuth().clearToken()
                    this.getAuth().clearId()
                    this.props.history.push('/noauth')
                }
            })
    }

    componentDidMount() {
        this.tryRedir()
    }

    render() {
        return (
            <div/>
        )
    }
}

// Allows us access to the history so we can redirect
export const NoAuth = withRouter(NoAuthInternal)