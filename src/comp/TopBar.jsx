import React from 'react'
import {MComponent} from '../MComponent'

export class TopBar extends MComponent {
    constructor(props) {
        super("TOPBAR", props)
    }

    render() {
        let content = (
            <div>
                <div className="guild-header-name">{this.props.title}</div>
                <div style={{marginLeft: "auto", marginRight: "1em"}} />
                {this.props.children}
            </div>
        )
        if(this.props.noTitle) {
            content = (
                this.props.children
            )
        }
        return (
            <div className="profile-top-bar">
                <div className="container is-4em-h-m-8em">
                    <div className="columns has-text-centered is-centered is-4em-h-m-8em" style={{width: "100%"}}>
                        <div className="column is-10 is-4em-h">
                            <div className={"columns is-centered has-text-centered is-4em-h-m-8em"}>
                                <div className="column is-12 has-text-left is-4em-h-m-8em profile-top-bar-inner">
                                    {content}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}