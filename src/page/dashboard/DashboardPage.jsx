import {MComponent} from "../../MComponent"
import {BACKEND_URL} from "../../const"
import axios from 'axios'

export class DashboardPage extends MComponent {
    fetchConfig(callback) {
        axios.get(BACKEND_URL + `/api/config/guild/${this.props.guild.id}/fetch`, {headers: {"Authorization": this.getAuth().getToken()}}).then(e => {
            let data = JSON.parse(e.data)
            this.getLogger().debug("Fetched guild config:", data)
            this.setState({config: data})
            callback && callback()
        })
    }

    updateConfig(callback) {
        axios.post(BACKEND_URL + `/api/config/guild/${this.props.guild.id}/update`, this.state.config,
            {headers: {"Authorization": this.getAuth().getToken()}})
            .then(e => {
                let data = JSON.parse(e.data)
                this.getLogger().debug("Updating guild config:", data)
                this.setState({config: data})
                callback && callback()
            })
    }
}