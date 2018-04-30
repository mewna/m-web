import {MComponent} from "../../MComponent";
import {NavLink} from "react-router-dom";
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
        let className = "guild-card shorter "
        if(this.props.className) {
            className += this.props.className
        }
        let buttons = (
                <footer className="card-footer detached">
                    <NavLink to={"/dashboard"} className="card-footer-item fa-pull-left hover"><i className="fas fa-fw fa-cog"/> Manage</NavLink>
                </footer>
            )
        let children = null;
        if(this.props.children) {
            children = (
                <div className="card-content">
                    <div className="content">
                        {this.props.children}
                    </div>
                </div>
            )
        }
        return (
            <div className={className}>
                <div className="card detached">
                    <header className="card-header">
                        {this.renderIcon()}
                        <p className="card-header-title">
                            {this.props.guild.name}
                        </p>
                    </header>
                    {children}
                </div>
                {buttons}
            </div>
        )
    }
}