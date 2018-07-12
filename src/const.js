// https://daveceddia.com/multiple-environments-with-react/
let backendUrl

const hostname = window && window.location && window.location.hostname

if(hostname === "mewna.com") {
    backendUrl = "https://esp.mewna.com"
} else if(hostname === "mewna.app") {
    backendUrl = "https://esp.mewna.app"
} else {
    backendUrl = process.env.REACT_APP_BACKEND_URL
    require('preact/debug')
}

export const BACKEND_URL = backendUrl // process.env.REACT_APP_BACKEND_URL
export const DISCORD_EPOCH = 1420070400000
export const MEWNA_EPOCH = 1518566400000
