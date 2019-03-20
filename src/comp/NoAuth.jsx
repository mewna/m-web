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
        setTimeout(() => {
            axios.get(BACKEND_URL + "/api/v1/heartbeat", {headers: {"authorization": this.getAuth().getToken()}})
                .then(data => {
                    let user = data.data.check
                    this.getLogger().info("Got NoAuth data:", user)
                    if(this.getAuth().getId() === "128316294742147072") {
                        if(!user) {
                            alert(JSON.stringify(data))
                            alert("Your token: " + this.getAuth().getToken())
                            alert("Your id: " + this.getAuth().getId())
                        }
                    }
                    if(!user || user === null || user === undefined) {
                        this.getLogger().warn("NoAuth triggered")
                        this.getAuth().clearToken()
                        this.getAuth().clearId()
                        this.props.history.push('/noauth')
                    }
                })
        }, 500)
    }

    componentDidMount() {
        this.tryRedir()
    }

    render() {
        return ""
    }
}

// Allows us access to the history so we can redirect
export const NoAuth = withRouter(NoAuthInternal)
