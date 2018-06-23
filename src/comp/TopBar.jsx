import React from 'react'
import {MComponent} from '../MComponent'

export class TopBar extends MComponent {
    constructor(props) {
        super("TOPBAR", props)
    }

    render() {
        return (
            <div className="profile-top-bar">
                <div className="container is-4em-h">
                    <div className="columns has-text-centered is-centered is-4em-h" style={{width: "100%"}}>
                        <div className="column is-10 is-4em-h">
                            <div className={"columns is-centered has-text-centered is-4em-h"}>
                                <div className="column is-12 has-text-left is-4em-h profile-top-bar-inner">
                                    <div className="guild-header-name">{this.props.title}</div>
                                    <div style={{marginLeft: "auto", marginRight: "1em"}} />
                                    {this.props.children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}