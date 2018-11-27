import React from 'react'
import { MComponent } from '../../MComponent'
import {VHContainer} from '../VHContainer'
import axios from 'axios'
import { BACKEND_URL } from '../../const'
import BubblePreloader from 'react-bubble-preloader'
import {connect} from 'react-redux'
import {PostEditor} from '../../comp/profile/PostEditor';

export class ServerPage extends MComponent {
    constructor(props) {
        super("SERVERPAGE", props)
        this.state = {
            server: null,
            manages: false
        }
    }

    componentDidMount() {
        axios.get(BACKEND_URL + "/api/v1/cache/guild/" + this.props.match.params.id).then(e => {
            this.getLogger().debug("Got guild:", e.data)
            this.setState({server: e.data})
        })
        axios.get(BACKEND_URL + "/api/v1/data/guild/" + this.props.match.params.id + "/manages", {headers: {"Authorization": this.getAuth().getToken()}})
            .then(e => {
                this.getLogger().debug("Got manages:", e.data)
                this.setState({manages: e.data.manages})
            })
    }

    renderBackground() {
        return (
            <div className="profile-background-section">
                <div
                    style={{
                        backgroundImage: `url(/backgrounds/default/rainbow_triangles.png)`,
                        width: "100%",
                        height: "100%",
                        backgroundSize: "cover",
                        backgroundPosition: "0% 35%"
                    }}
                />
            </div>
        )
    }

    renderTopBar() {
        return (
            <div className="profile-top-bar">
                <div className="container is-4em-h">
                    <div className="columns profile-column-container is-4em-h is-flex" style={{flexDirection: "row", alignItems: "center"}}>
                        <div className="column is-3 profile-column is-4em-h" />
                        <div className="column is-9 profile-column is-4em-h profile-top-bar-inner">
                            <span style={{marginLeft: "auto", marginRight: "1em"}} />
                            <div>
                                {/* TODO: Render an edit or whatever, idk */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderInfoColumn() {
        return (
            <div className="column is-3 profile-column profile-about-column">
                <div>
                    <img src={`https://cdn.discordapp.com/icons/${this.state.server.id}/${this.state.server.icon}.png`} 
                            alt="server icon" className="profile-avatar"
                        />
                    {this.renderServerName()}
                    <hr className="dark-hr" />
                    <p className="profile-about-text-title">About</p>
                    {this.renderServerDescription()}
                </div>
            </div>
        )
    }

    renderServerName() {
        return (
            <div className="profile-name">
                {this.state.server.name}
            </div>
        )
    }

    renderServerDescription() {
        return (
            <p>SERVER DESCRIPTION<br /></p>
        )
    }

    renderEditor() {
        if(this.state.manages) {
            return (
                <PostEditor callback={text => {
                    this.getLogger().debug("Got post text:", text)
                }} />
            )
        } else {
            return ""
        }
    }

    renderTimeline() {
        return (
            <div className="column is-12 is-not-quite-black rounded-corners post-column">
                <b>{this.state.server.name}</b> has no posts...
            </div>
        )
    }

    render() {
        if(this.state.server) {
            return (
                <div>
                    {this.renderBackground()}
                    {this.renderTopBar()}
                    <VHContainer>
                        <div className="columns profile-column-container">
                            {this.renderInfoColumn()}
                            <div className="column is-12 is-hidden-tablet" />
                            <div className="column is-9 profile-column rounded-corners">
                                <div className="columns is-multiline">
                                    {this.renderEditor()}
                                    {this.renderTimeline()}
                                </div>
                            </div>
                        </div>
                    </VHContainer>
                </div>
            )
        } else {
            return (
                <div className="has-text-centered" style={{width: "100vw"}}>
                    <BubblePreloader
                        colors={["white", "white", "white"]}
                    />
                </div>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        profileId: state.profileId,
    }
}

export const ServerPageRedux = connect(mapStateToProps)(ServerPage)
