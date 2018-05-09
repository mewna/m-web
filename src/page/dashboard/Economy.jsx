import {MComponent} from "../../MComponent"
import React from "react"
import {DebouncedText} from "../../comp/DebouncedText"

export class Economy extends MComponent {
    constructor(props) {
        super("ECONOMY", props)
    }

    render() {
        return (
            <div className={"has-text-left"} style={{width: "100%"}}>
                <div className={"column is-12"}>
                    <div className={"toggle-row"}>
                        <div className={"is-inline-block"}>
                            <p className={"title is-size-5"}>Currency symbol</p>
                            The symbol used for currency in this server.
                        </div>
                        <span style={{marginLeft: "auto", marginRight: "1.5rem"}}/>
                        <DebouncedText placeholder="Default: :white_flower:" id="custom_currency_symbol" maxLength={16}/>
                    </div>
                </div>
            </div>
        )
    }
}
