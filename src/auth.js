import {Logger} from "./logger"

export class Auth {
    constructor() {
        this.store = window.localStorage
        this.logger = new Logger("AUTH")
    }

    getToken() {
        return this.store.getItem("token")
    }

    getId() {
        return this.store.getItem("id")
    }

    setToken(token) {
        if(this.getToken()) {
            this.logger.info("Token set with token present?")
        } else {
            this.store.setItem("token", token)
        }
    }

    setId(id) {
        if(this.getId()) {
            this.logger.info("Id set with id present?")
        } else {
            this.store.setItem("id", id)
        }
        this.store.setItem("id", id)
    }

    clearToken() {
        this.store.removeItem("token")
    }

    clearId() {
        this.store.removeItem("id")
    }
}

export const auth = new Auth()