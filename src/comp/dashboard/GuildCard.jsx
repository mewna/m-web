import {MComponent} from "../../MComponent";
import React from "react";
import {GuildIcon} from "../GuildIcon";
import styled from 'styled-components'

export class GuildCard extends MComponent {
    constructor(props) {
        super("GUILDCARD", props)
    }

    renderIcon() {
        return <GuildIcon guild={this.props.guild} />
    }

    render() {
        let style = {}
        if(this.props.guild.icon) {
            style = {backgroundImage: `url("https://cdn.discordapp.com/icons/${this.props.guild.id}/${this.props.guild.icon}.png?size=1024")`}
        }

        return (
            <div className={"guild-card column is-4 has-text-left"}>
                <a onClick={() => {
                    this.getLogger().debug("clicked manage ->", this.props.guild.id)
                    this.props.callback && this.props.callback(this.props.guild)
                }} style={{width: "100%"}}>
                    <div className="card detached hover">
                        <GuildCardBackground style={style} />
                        <div className="guild-card-name">
                            {this.props.guild.name}
                        </div>
                    </div>
                </a>
            </div>
        )
    }
}

const GuildCardBackground = styled.div`
width: 100%;
height: 100%;
background-position: center;
background-size: cover;
background-repeat: no-repeat;
border-radius: 8px;
box-shadow: rgba(0,0,0,0.2) 0px 2px 3px, inset rgba(0,0,0,0.2) 0px -1px 2px;
`