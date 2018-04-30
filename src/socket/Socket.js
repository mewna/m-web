import {Socket} from "phoenix"

import {BACKEND_URL} from "../const"
import {Logger} from "../logger"

export class MewnaSocket {
    constructor() {
        this.logger = new Logger("SOCKET")
        this.channels = {}
    }

    connect() {
        this.logger.info("[FASTCONNECT] Connecting to ESP...")
        this.socket = new Socket(BACKEND_URL.replace("http", "ws") + "/socket")
        this.socket.onError(() => {
            this.logger.error("[FASTCONNECT] Connection error! 🔥")
        })
        this.socket.onClose(() => {
            this.logger.warn("[FASTCONNECT] Connection was closed")
        })

        this.socket.connect()
        this.logger.info("[FASTCONNECT] ESP ready")

        this.joinChannel("user-socket")
    }

    joinChannel(channelName, params = null, callback = () => {}) {
        this.channels[channelName] = this.socket.channel("esp:" + channelName, params || {})
        this.channels[channelName].on("m", m => {
            this.logSocketMessage(channelName, m)
            if(callback) {
                callback(m)
            }
        })
        const start = Date.now()
        this.channels[channelName].join().receive("ok", resp => {
            const end = Date.now()
            this.logger.info("[CHANNEL] +" + (end - start) + " Connected to channel", channelName + ":", resp)
        }).receive("error", resp => {
            const end = Date.now()
            this.logger.error("[CHANNEL] +" + (end - start) + " Failed connecting to channel", channelName + ":", resp)
        }).receive("timeout", resp => {
            const end = Date.now()
            this.logger.error("[CHANNEL] +" + (end - start) + " Timed out connecting to channel", channelName + ":", resp)
        })
    }

    leaveChannel(channelName) {
        this.channels[channelName].leave()
        delete this.channels[channelName]
        this.logger.info("Left:", channelName)
    }

    logSocketMessage(channel, m) {
        this.logger.info("+" + (Date.now() - m.ts), "> Got", m.t + ",", "ctx", {channel: "esp:" + channel, data: m.d})
    }

    getSocket() {
        return this.socket
    }

    push(channel, event, data) {
        this.logger.debug("Pushing", event, "->", data)
        this.channels[channel].push(event, data)
    }
}