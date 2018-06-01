import React from "react"
import {DebouncedText} from "../../comp/DebouncedText"
import {DashboardPage} from "./DashboardPage";
import BubblePreloader from 'react-bubble-preloader'

export class Economy extends DashboardPage {
    constructor(props) {
        super("ECONOMY", props)
    }

    componentDidMount() {
        this.fetchConfig()
    }

    render() {
        if(this.state.config) {
            return (
                <div className={"has-text-left"} style={{width: "100%"}}>
                    <div className={"column is-12"}>
                        <div className={"toggle-row"}>
                            <div className={"is-inline-block"}>
                                <p className={"title is-size-5"}>Currency symbol</p>
                                The symbol used for currency in this server.
                            </div>
                            <span style={{marginLeft: "auto", marginRight: "1.5rem"}} />
                            <DebouncedText placeholder="Default: :white_flower:" id="custom_currency_symbol" maxLength={16}
                                value={this.state.config.currencySymbol} callback={(e) => {
                                    let config = Object.assign({}, this.state.config)
                                    config.currencySymbol = e.value
                                    this.setState({config: config}, () => this.updateConfig())
                                }} />
                        </div>
                    </div>
                    {this.renderCommands(true)}
                </div>
            )
        } else {
            return (
                <div className="has-text-centered is-centered" style={{width: "100%"}}>
                    <BubblePreloader
                        colors={["white", "white", "white"]}
                    />
                </div>
            )
        }
    }
}
