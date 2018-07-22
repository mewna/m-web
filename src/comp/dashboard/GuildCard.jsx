import {MComponent} from "../../MComponent";
import React from "react";
import {GuildIcon} from "../GuildIcon";

export class GuildCard extends MComponent {
    constructor(props) {
        super("GUILDCARD", props)
    }

    renderIcon() {
        return <GuildIcon guild={this.props.guild} />
    }

    render() {
        let cardBackground = `url("https://cdn.discordapp.com/icons/${this.props.guild.id}/${this.props.guild.icon}.png?size=1024")`

        return (
            <div className="column is-4 guild-card-column">
                <a onClick={() => {
                    this.getLogger().debug("clicked manage ->", this.props.guild.id)
                    this.props.callback && this.props.callback(this.props.guild)
                }} style={{width: "100%"}}>
                    <div className="guild-card-wrapper">
                        <div className="guild-card-background" style={{
                            backgroundImage: cardBackground
                        }} />
                        <div className="guild-card-name">
                            {this.props.guild.name}
                        </div>
                    </div>
                </a>
            </div>
        )
    }
}