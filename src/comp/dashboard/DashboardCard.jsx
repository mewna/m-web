import {MComponent} from "../../MComponent";
import {NavLink} from "react-router-dom";
import React from "react";

export class DashboardCard extends MComponent {
    constructor(props) {
        super("DASHBOARDCARD", props)
    }

    render() {
        let className = "guild-card column is-4 has-text-left"
        if(this.props.className) {
            className += " " + this.props.className
        }
        /*
        let buttons = (
            <footer className="card-footer detached">
                <NavLink to={`/discord/dashboard/${this.props.guild.id}/${this.props.shortlink}`} className="card-footer-item fa-pull-left hover">
                    <i className="fas fa-fw fa-cog"/> Manage
                </NavLink>
            </footer>
        )
        */
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
                <NavLink to={`/discord/dashboard/${this.props.guild.id}/${this.props.shortlink}`}>
                    <div className="card detached hover">
                        <header className="card-header guild-header">
                            <p className="card-header-title guild-title">
                                {this.props.name}
                            </p>
                        </header>
                        {children}
                    </div>
                </NavLink>
                {/*buttons*/}
            </div>
        )
    }
}