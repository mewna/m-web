import React from 'react'
import { MComponent } from '../../MComponent'
import {VHContainer} from '../VHContainer'
import axios from 'axios'
import { BACKEND_URL, MEWNA_EPOCH } from '../../const'
import BubblePreloader from 'react-bubble-preloader'
import {connect} from 'react-redux'
import {PostEditor} from '../../comp/profile/PostEditor';
import {NotFound} from '../NotFound'
import bigInt from "big-integer"
import {formatRelative} from 'date-fns'
import ReactMarkdown from 'react-markdown'
import {NavLink} from 'react-router-dom'

export class ServerPage extends MComponent {
    constructor(props) {
        super("SERVERPAGE", props)
        this.state = {
            server: null,
            manages: false,
            post: null,
            postAuthor: null,
            editingPost: false,
            postTitles: []
        }
    }

    async componentDidMount() {
        await this.fetchData()
    }

    async componentDidUpdate(prev) {
        let postCheck = false
        if(this.props.match.params.post) {
            if(this.state.post !== null) {
                if(this.state.post.id !== this.props.match.params.post) {
                    postCheck = true
                }
            } else {
                postCheck = true
            }
        }
        if(postCheck) {
            await this.fetchPost()
        } else if(prev.match.params.post && !this.props.match.params.post) {
            await this.fetchPostTitles()
        }
    }

    async fetchData() {
        const serverRes = await axios.get(`${BACKEND_URL}/api/v1/cache/guild/${this.props.match.params.id}`)
        this.getLogger().debug("Got guild:", serverRes.data)
        const managesRes = await axios.get(`${BACKEND_URL}/api/v1/data/guild/${this.props.match.params.id}/manages`, {headers: {"Authorization": this.getAuth().getToken()}})
        this.getLogger().debug("Got manages:", managesRes.data)

        this.setState({manages: managesRes.data.manages, server: serverRes.data}, async () => {
            if(this.props.match.params.post) {
                await this.fetchPost()
            } else {
                await this.fetchPostTitles()
            }
        })
    }

    async fetchPost() {
        const e = await axios.get(`${BACKEND_URL}/api/v1/blog/server/${this.props.match.params.id}/post/${this.props.match.params.post}`)
        const data = JSON.parse(e.data)
        this.getLogger().debug("Got post:", data)
        const f = await axios.get(`${BACKEND_URL}/api/v1/data/account/${data.author}/profile`)
        let user = f.data
        this.getLogger().debug("Got author:", user)
        this.setState({post: data, postAuthor: user})
    }

    async fetchPostTitles() {
        const e = await axios.get(`${BACKEND_URL}/api/v1/blog/server/${this.props.match.params.id}/posts/all/titles`)
        const data = JSON.parse(e.data)
        this.getLogger().debug("Got post data:", data)
        this.setState({postTitles: data})
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
                    <NavLink to={`/server/${this.state.server.id}`}>
                        <img src={`https://cdn.discordapp.com/icons/${this.state.server.id}/${this.state.server.icon}.png`} 
                                alt="server icon" className="profile-avatar"
                            />
                    </NavLink>
                    {this.renderServerName()}
                    {/*
                    <hr className="dark-hr" />
                    <p className="profile-about-text-title">About</p>
                    {this.renderServerDescription()}
                    */}
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
                <div className="column is-12 is-not-quite-black rounded-corners post-column is-flex" style={{flexDirection: "column"}}>
                    <PostEditor title={true} callback={(title, content) => {
                        this.getLogger().debug(`New post:\n${title}\n${content}`)
                        axios.post(BACKEND_URL + `/api/v1/blog/server/${this.state.server.id}/post`, {title: title, content: content},
                            {headers: {"Authorization": this.getAuth().getToken()}})
                            .then(e => {
                                // let data = JSON.parse(e.data)
                                this.getLogger().debug("Got server blog API response:", e.data)
                                const id = parseInt(e.data.id, 10)
                                if(id > 0) {
                                    this.props.history.push(`/server/${this.state.server.id}/${e.data.id}`)
                                }
                            })
                    }} />
                </div>
            )
        } else {
            return ""
        }
    }

    renderTimeline() {
        if(this.state.postTitles.length === 0) {
            return (
                <div className="column is-12 is-not-quite-black rounded-corners post-column">
                    <b>{this.state.server.name}</b> has no posts...
                </div>
            )
        } else {
            const cards = []
            let key = 0
            const now = new Date()
            this.state.postTitles.forEach(e => {
                cards.push(
                    <div className="column is-12" key={key++} style={{padding: "0"}}>
                        <NavLink to={`/server/${this.props.match.params.id}/${e.id}`}>
                            <div className="is-flex is-not-quite-black rounded-corners post-column" style={{alignItems: "center", padding: "0.75em"}}>
                                <strong style={{marginRight: "0.25em"}}>{e.title}</strong>
                                by <img src={e.author.avatar} alt="" className="circle is-inline-block" style={{
                                    width: "16px", height: "16px", marginLeft: "0.25em", marginRight: "0.25em"
                                }} />{e.author.displayName}
                                <span style={{marginLeft: "auto", marginRight: "auto"}} />
                                {formatRelative(new Date(bigInt(e.id).shiftRight(22).valueOf() + MEWNA_EPOCH), now)}
                            </div>
                        </NavLink>
                    </div>
                )
            })
            return (
                cards
            )
        }
    }

    renderCurrentPost() {
        const now = new Date()
        return (
            <div className="column is-12 is-not-quite-black rounded-corners post-column">
                <div className="is-flex" style={{alignItems: "center", marginBottom: "0.5em"}}>
                    <h2 style={{marginBottom: "0"}}>{this.state.post.title}</h2>
                    <span style={{marginLeft: "auto", marginRight: "auto"}} />
                    {formatRelative(new Date(bigInt(this.state.post.id).shiftRight(22).valueOf() + MEWNA_EPOCH), now)}
                </div>
                <div className="is-flex" style={{alignItems: "center"}}>
                    by <a href={`/profile/${this.state.postAuthor.id}`} target="_blank" rel="noreferrer noopener" style={{display: "flex", alignItems: "center"}}>
                        <img src={this.state.postAuthor.avatar} alt="" className="circle is-inline-block" style={{
                            width: "16px", height: "16px", marginLeft: "0.25em", marginRight: "0.25em"
                        }} />{this.state.postAuthor.displayName}
                    </a>
                </div>
                <hr className="dark-hr" />
                <ReactMarkdown source={this.state.post.content} />
                {this.renderCurrentPostButtons()}
            </div>
        )
    }

    renderCurrentPostEditor() {
        return (
            <div className="column is-12 is-not-quite-black rounded-corners post-column">
                <PostEditor title={true} initial={{title: this.state.post.title, content: this.state.post.content}} 
                    nohr={true} buttons={(title, content) => this.renderCurrentPostButtons(title, content)} />
            </div>
        )
    }

    renderCurrentPostButtons(title, content) {
        if(this.state.post.author === this.props.profileId) {
            if(this.state.editingPost) {
                return (
                    <div>
                        <hr className="dark-hr" />
                        <a className="button is-primary" style={{marginRight: "0.5em"}} onClick={async (e) => {
                            e.preventDefault()
                            const res = await axios.put(`${BACKEND_URL}/api/v1/blog/server/${this.props.match.params.id}/post/${this.props.match.params.post}`,
                                {title: title, content: content},
                                {headers: {"Authorization": this.getAuth().getToken()}})
                            this.getLogger().debug(res.data)
                            await this.fetchPost()
                            this.setState({editingPost: false})
                        }}>Save Changes</a>
                        <a className="button is-primary" onClick={async (e) => {
                            this.setState({editingPost: false})
                        }}>Cancel</a>
                    </div>
                )
            } else {
                return (
                    <div>
                        <hr className="dark-hr" />
                        <a className="button is-primary" style={{marginRight: "0.5em"}} onClick={async (e) => {
                            this.setState({editingPost: true})
                        }}>Edit</a>
                        <a className="button is-primary" onClick={async (e) => {
                            e.preventDefault()
                            await axios.delete(`${BACKEND_URL}/api/v1/blog/server/${this.props.match.params.id}/post/${this.props.match.params.post}`,
                                {headers: {"Authorization": this.getAuth().getToken()}})
                            this.props.history.push(`/server/${this.props.match.params.id}`)
                        }}>Delete</a>
                    </div>
                )
            }
        } else if(this.state.manages) {
            return (
                <div>
                    <hr className="dark-hr" />
                    <a className="button is-primary" onClick={async (e) => {
                        e.preventDefault()
                        await axios.delete(`${BACKEND_URL}/api/v1/blog/server/${this.props.match.params.id}/post/${this.props.match.params.post}`,
                            {headers: {"Authorization": this.getAuth().getToken()}})
                        this.props.history.push(`/server/${this.props.match.params.id}`)
                    }}>Delete</a>
                </div>
            )
        } else {
            return (
                ""
            )
        }
    }

    render() {
        if(this.state.server && this.state.server.id) {
            if(this.props.match.params.post && this.state.post && this.state.postAuthor) {
                if(this.state.post.id) {
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
                                            {this.state.editingPost ? this.renderCurrentPostEditor() : this.renderCurrentPost()}
                                        </div>
                                    </div>
                                </div>
                            </VHContainer>
                        </div>
                    )
                } else {
                    return (
                        <NotFound />
                    )
                }
            } else {
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
            }
        } else if(this.state.server) {
            return (
                <NotFound />
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
