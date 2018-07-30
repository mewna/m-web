import {Logger} from "./logger"
import Cookies from 'universal-cookie'

class CookieStore {
    _cookies = new Cookies()

    setItem(item, value) {
        return this._cookies.set(item, value, { path: '/' })
    }

    getItem(item) {
        return this._cookies.get(item)
    }

    removeItem(item) {
        return this._cookies.remove(item)
    }
}

export class Auth {
    constructor() {
        this.store = new CookieStore() // window.localStorage
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
            this.logger.error("Token set with token present?")
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