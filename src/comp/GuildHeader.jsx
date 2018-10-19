import React from 'react'
import {MComponent} from '../MComponent'
import {TopBar} from './TopBar';

export class GuildHeader extends MComponent {
    constructor(props) {
        super("GUILDHEADER", props)
    }

    render() {
        let bg
        if(this.props.player) {
            bg = `${this.props.player.customBackground}.png`
        } else {
            bg = `https://cdn.discordapp.com/icons/${this.props.guild.id}/${this.props.guild.icon}.png?size=1024`
        }
        return (
            <div>
                <div style={{overflow: "hidden"}}>
                    <section className={"section leaderboards-header-image is-small"}
                        style={{
                            background: `url("${bg}") center / cover`
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