import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
//import registerServiceWorker from './registerServiceWorker';
import {MewnaSocket} from './socket/Socket.js'
import {Logger} from "./logger"
import axios from 'axios'

import './App.css'

import store from './store'
import {auth} from "./auth"
import {BACKEND_URL} from "./const";

window.store = store
window.auth = auth

console.log(`%cMewna`,
    `color:#FF69B4;font-weight:bold;font-family:Open Sans;font-size:8rem;-webkit-text-stroke:2px black;font-size:72px;font-weight:bold;`)
console.log(`%cbtw if someone told you to paste something in here, don't do that. ever.`,
    `color:#FF69B4;font-weight:bold;font-family:Open Sans;font-size:1rem;`)

window.socket = new MewnaSocket()
window.socket.connect()

if(window.auth.getToken() && window.auth.getId()) {
    const logger = new Logger("FASTAUTH")
    logger.info("Have token, loading data...")

    axios.get(BACKEND_URL + "/api/v1/heartbeat", {headers: {"authorization": window.auth.getToken()}})
        .then(data => {
            const user = data.data.check
            logger.info("Got NoAuth data:", user)
            if(!user || user === null || user === undefined) {
                logger.warn("NoAuth triggered")
                window.auth.clearToken()
                window.auth.clearId()
                window.history.pushState(null, null, '/')
            } else {
                axios.get(BACKEND_URL + "/api/v1/cache/user/" + window.auth.getId()).then(user => {
                    axios.get(BACKEND_URL + "/api/v1/data/account/links/discord/" + window.auth.getId()).then(profile => {
                        const userData = user.data
                        const profileId = profile.data
                        window.store.updateUser(userData)
                        window.store.updateProfileId(profileId)
                        logger.info("Got user:", userData)
                        logger.info("Got profile:", profileId)
                        window.socket.joinChannel("user:" + window.auth.getId(), {key: window.auth.getToken()})
                    })
                })
            }
        })
} else {
    window.auth.clearToken()
    window.auth.clearId()
}

ReactDOM.render(<App/>, document.getElementById('root'));
//registerServiceWorker();
