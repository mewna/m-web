import {Component} from 'react'
import {Logger} from "./logger"

export class MComponent extends Component {
    constructor(name, props) {
        super(props)
        this.logger = new Logger(name)
    }

    getSocket() {
        return window.socket
    }

    getAuth() {
        return window.auth
    }

    getStore() {
        return window.store
    }

    getLogger() {
        return this.logger
    }
}
