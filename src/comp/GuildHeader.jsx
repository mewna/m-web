import React from 'react'
import {MComponent} from '../MComponent'
import {TopBar} from './TopBar';

export class GuildHeader extends MComponent {
    constructor(props) {
        super("GUILDHEADER", props)
    }

    render() {
        return (
            <div>
                <div style={{overflow: "hidden"}}>
                    <section className={"section leaderboard-header-image"}
                        style={{
                            backgroundImage: `url("https://cdn.discordapp.com/icons/${this.props.guild.id}/${this.props.guild.icon}.png?size=1024")`
                        }}>
                    </section>
                </div>
                <div className="leaderboards-guild-header-overlay">
                </div>
                <TopBar title={this.props.guild.name + (this.props.titleExtra || "")}>
                    {this.props.children}
                </TopBar>
            </div>
        )
    }
}