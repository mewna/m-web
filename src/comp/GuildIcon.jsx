import {MComponent} from "../MComponent";
import {Icon} from "./Icon";
import React from "react";

export class GuildIcon extends MComponent {
    constructor(props) {
        super("GUILDICON", props)
    }

    render() {
        let className = "circle guild-icon"
        if(this.props.className) {
            className += " " + this.props.className
        }
        if(this.props.icon) {
            return (
                <Icon src={`https://cdn.discordapp.com/icons/${this.props.guild.id}/${this.props.guild.icon}.png`} alt={"guild icon"} />
            )
        } else {
            let chars = this.props.guild.name.split(/\s+/).map(e => e.substring(0, 1)).join("")
            return (
                <div className={className}>
                    {chars}
                </div>
            )
        }
    }
}