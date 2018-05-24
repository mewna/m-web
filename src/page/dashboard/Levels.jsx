import React from "react"
import {DashboardPage} from "./DashboardPage";
import BubblePreloader from 'react-bubble-preloader'
import {OptionToggle} from "../../comp/dashboard/OptionToggle";
import {DebouncedTextarea} from "../../comp/DebouncedTextarea";

export class Levels extends DashboardPage {
    constructor(props) {
        super("LEVELS", props)
    }

    componentDidMount() {
        this.fetchConfig()
    }

    render() {
        if(this.state.config) {
            return (
                <div>
                    <OptionToggle name="Enable levels" desc="Whether or not people should gain xp by chatting in this server."
                        checkedCallback={() => this.state.config.levelsEnabled} callback={() => {
                            let config = Object.assign({}, this.state.config)
                            config.levelsEnabled = !config.levelsEnabled
                            this.setState({config: config})
                            this.getLogger().debug("Toggled levelsEnabled: ", config.levelsEnabled)
                        }} />
                    <OptionToggle name="Enable level-up messages" desc="Whether or not messages should be sent when someone levels up."
                        checkedCallback={() => this.state.config.levelUpMessagesEnabled} callback={() => {
                            let config = Object.assign({}, this.state.config)
                            config.levelUpMessagesEnabled = !config.levelUpMessagesEnabled
                            this.setState({config: config})
                            this.getLogger().debug("Toggled levelUpMessagesEnabled: ", config.levelUpMessagesEnabled)
                        }} />
                    <OptionToggle name="Enable level-up cards" desc="Whether or not a card with extra info should be sent when someone levels up."
                        checkedCallback={() => this.state.config.levelUpCards} callback={() => {
                            let config = Object.assign({}, this.state.config)
                            config.levelUpCards = !config.levelUpCards
                            this.setState({config: config})
                            this.getLogger().debug("Toggled levelUpCards: ", config.levelUpCards)
                        }} />
                    <div className={"column is-12"}>
                        <div className={"toggle-col"}>
                            <div>
                                <p className={"title is-size-5"}>Level-up message</p>
                                The message sent when someone levels up.
                            </div>
                            <div className={"small-spacer-v"} />
                            <DebouncedTextarea callback={(e) => {
                                const val = e.textarea_value
                                let config = Object.assign({}, this.state.config)
                                config.levelUpMessage = val
                                this.setState({config: config})
                                this.getLogger().debug("Set levelUpMessage:", val)
                            }} value={this.state.config.levelUpMessage} />
                        </div>
                    </div>
                    {/* TODO: Role rewards */}
                    {this.renderCommands(true)}
                </div>
            )
        } else {
            return (
                <div className="has-text-centered" style={{width: "100vw"}}>
                    <BubblePreloader
                        colors={["white", "white", "white"]}
                    />
                </div>
            )
        }
    }
}
