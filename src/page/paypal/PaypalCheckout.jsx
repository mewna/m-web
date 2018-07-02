import {MComponent} from "../../MComponent"
import React from "react"
import BubblePreloader from 'react-bubble-preloader'
import axios from 'axios'
import {BACKEND_URL} from '../../const'

export class PaypalCheckout extends MComponent {
    constructor(props) {
        super("PAYPALCHECKOUT", props)
    }

    componentDidMount() {
        axios.post(BACKEND_URL + "/api/v1/data/store/checkout/start", {
            "userId": this.props.match.params.id,
            "sku": this.props.match.params.sku
        }).then(data => {
            this.getLogger().debug(data)
            if(data.data.redirect) {
                window.location = data.data.redirect
            } else {
                this.getLogger().warn("No redirect!?")
            }
        })
    }

    render() {
        return (
            <div className="has-text-centered" style={{width: "100vw"}}>
                <BubblePreloader
                    colors={["white", "white", "white"]}
                />
            </div>
        )
    }
}
