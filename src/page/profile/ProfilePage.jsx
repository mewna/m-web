import {MComponent} from "../../MComponent"
import React from "react"
import {NavLink} from "react-router-dom";
import {connect} from 'react-redux'

export class ProfilePage extends MComponent {
    constructor(props) {
        super("PROFILEPAGE", props)
    }

    render() {
        let user;
        if(this.getStore().getUser()) {
            const u = this.props.user
            user = u.name + "#" + u.discriminator + " -> " + u.id
        } else {
            user = "Not logged in"
        }
        return (
            <div>
                <section className="section is-large" style={{background: "#55FF55"}}>
                    aaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                </section>
                <div className="row">
                    memes
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export const ProfilePageRedux = connect(mapStateToProps)(ProfilePage)