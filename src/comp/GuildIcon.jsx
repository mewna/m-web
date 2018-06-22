import {MComponent} from "../MComponent";
import {Icon} from "./Icon";
import React from "react";

export class GuildIcon extends MComponent {
    constructor(props) {
        super("GUILDICON", props)
    }

    render() {
        let className = "guild-icon"
        if(this.props.big) {
            className = "guild-icon-big"
        }
        if(this.props.className) {
            className += " " + this.props.className
        }
        if(this.props.guild.icon) {
            return (
                <Icon src={`https://cdn.discordapp.com/icons/${this.props.guild.id}/${this.props.guild.icon}.png`}
                    alt={"guild icon"} className={className} noborder={this.props.noborder} big={this.props.big || false} />
            )
        } else {
            let chars = this.props.guild.name.split(/\s+/).map(e => e.substring(0, 1)).join("")
            let style = {}
            if(this.props.noborder) {
                style = {border: "transparent"}
            }
            return (
                <div className={className} style={style}>
                    {chars}
                </div>
            )
        }
    }
}