import {MComponent} from "../../MComponent"
import React from "react"
import {connect} from 'react-redux'
import {VHContainer} from "../VHContainer"
import BubblePreloader from 'react-bubble-preloader'
import Modal from 'react-modal'
import {DebouncedTextarea} from "../../comp/DebouncedTextarea"
import axios from 'axios'
import {BACKEND_URL, MEWNA_EPOCH} from "../../const"
import {NotFound} from '../NotFound'
import bigInt from "big-integer"
import {formatRelative} from 'date-fns'
import { DebouncedText } from "../../comp/DebouncedText";

class BackgroundCard extends MComponent {
    constructor(props) {
        super("BACKGROUNDCARD", props)
    }

    render() {
        return (
            <div className="profile-background-image-wrapper rounded-corners hover"
                onMouseOver={() => this.props.backgroundMouseOver(this.props.src.replace(".png", "").replace("/thumbs", ""))}
                onMouseOut={() => this.props.backgroundMouseOut()}>
                <a onClick={() => {
                    if(!this.props.locked) {
                        this.props.backgroundOnClick(this.props.name, this.props.pack, this.props.src)
                    }
                }}>
                    {/* TODO: On-click animation registering use */}
                    <div className="profile-background-image-container">
                        <img src={this.props.src} alt={this.props.alt}
                            className={
                                "profile-background-image profile-background-image-thumb"
                                + (this.props.locked ? " profile-background-image-locked" : "")
                            } />
                        {this.props.locked ?
                            <div className="profile-background-image-locked">
                                <i className="fas fa-lock"></i>
                            </div>
                            : ""}
                    </div>
                </a>
            </div>
        )
    }
}

class ProfileSettingsModal extends MComponent {
    constructor(props) {
        super("PROFILESETTINGSMODAL", props)
        this.state = {aboutText: this.props.player().aboutText}
    }

    handleCheckoutButton(e, sku) {
        e.preventDefault()
        window.open(`/paypal-checkout/${this.props.player().id}/${sku}`, "PayPal Checkout", "resizable=no,menubar=no,scrollbars=yes,status=no,height=640,width=480")
    }

    pathToThumb(path) {
        let s = path.substr(1).split("/")
        return '/' + s[0] + '/' + s[1] + '/thumbs/' + s[2]
    }

    renderPacks() {
        // fucking retarded deepcopy :tada:
        const packs = JSON.parse(JSON.stringify(this.props.packs))
        // Take default pack first
        const containers = []
        let cards = []
        let key = 0
        cards.push(<div className="column is-12" key={key++}>
            <p className="modal-title is-size-6">DEFAULT</p>
        </div>)
        let cardCounter = 0
        packs["default"].forEach(bg => {
            cards.push(
                <div className="column is-4 is-paddingless-top" key={key++}>
                    <BackgroundCard src={this.pathToThumb(bg.path)} alt={bg.name} pack={bg.pack} name={bg.name}
                        backgroundMouseOver={this.props.backgroundMouseOver}
                        backgroundMouseOut={this.props.backgroundMouseOut}
                        backgroundOnClick={this.props.backgroundOnClick}
                    />
                </div>
            )
            ++cardCounter
        })
        let len = cardCounter % 3
        if(len !== 0) {
            for(let i = 0; i < len; i++) {
                cards.push(
                    <div className="column is-4" key={key++} />
                )
            }
        }
        containers.push(
            <div className="columns is-multiline" key={key++}>
                {cards}
            </div>
        )
        cards = []
        // Do the rest
        Object.keys(packs).filter(e => e !== "default").forEach(e => {
            const packLocked = this.props.player().ownedBackgroundPacks.filter(p => e === p).length === 0
            const manifest = this.props.manifest.filter(m => m.sku === "Background-Pack-" + e)[0]
            cards.push(<div className="column is-12" key={key++}>
                <p className="modal-title is-size-6">
                    {packLocked ? <span style={{marginRight: "0.5em"}}><i className="fas fa-lock" /></span> : ""}
                    {e.toUpperCase().replace("_", " ")}
                </p>
            </div>)
            let counter = 0
            packs[e].forEach(bg => {
                let columnClass = "column is-4 is-paddingless-top"
                if(packLocked) {
                    columnClass += " profile-background-image-locked"
                }
                cards.push(
                    <div className={columnClass} key={key++}>
                        <BackgroundCard src={this.pathToThumb(bg.path)} alt={bg.name} pack={bg.pack} name={bg.name}
                            backgroundMouseOver={this.props.backgroundMouseOver}
                            backgroundMouseOut={this.props.backgroundMouseOut}
                            backgroundOnClick={this.props.backgroundOnClick}
                            locked={packLocked} />
                    </div>
                )
                ++counter
            })
            let len = counter % 3
            if(len !== 0) {
                for(let i = 0; i < len; i++) {
                    cards.push(
                        <div className="column is-4" key={key++} />
                    )
                }
            }
            let lockCover = ""
            if(packLocked) {
                lockCover = (
                    <div className="column is-12 profile-background-pack-locked-cover">
                        <a style={{marginLeft: "1em"}} className="button is-primary hover" onClick={(e) => this.handleCheckoutButton(e, manifest.sku)}>
                            <i className="fab fa-paypal" style={{marginRight: "0.5em"}} />Unlock for ${manifest.cents / 100} with PayPal
                        </a>
                    </div>
                )
            }
            let containerClass = "columns is-multiline profile-background-pack-container"
            if(packLocked) {
                containerClass += " profile-background-pack-container-locked"
            }
            containers.push(
                <div key={key++} className={containerClass}>
                    {cards}
                    {lockCover}
                </div>
            )
            cards = []
        })
        return containers
    }

    render() {
        return (
            <Modal
                isOpen={this.props.isModalOpen()}
                onAfterOpen={this.props.afterOpenModal()}
                onRequestClose={() => {
                    // If we don't do this, stack overflow somehow.
                    // yeah idgi either :I
                    if(this.props.isModalOpen()) {
                        this.props.backgroundMouseOut()
                        this.props.closeModal()
                    }
                }}
                className="mewna-modal"
                overlayClassName="mewna-modal-overlay"
                ariaHideApp={false}>
                {/* ^^^ I have no fucking clue how to do this right ;-; */}
                <div className="modal-container">
                    <p className="is-size-4 has-text-white has-text-weight-semibold modal-header">
                        Custom Background
                    </p>
                    <div className="modal-body">
                        {/*<div>
                            <p className="modal-title">About</p>
                            <DebouncedTextarea maxChars={150} rows={3} min-rows={3} value={this.state.aboutText} callback={(e) => {
                                const val = e.textarea_value.replace(/\r?\n|\r/g, "")
                                axios.post(BACKEND_URL + `/api/v1/data/account/${this.props.player().id}/update`,
                                    {aboutText: val, id: this.props.player().id}, {headers: {"Authorization": this.getAuth().getToken()}})
                                    .then(e => {
                                        this.props.onAboutUpdate(val)
                                        this.setState({aboutText: this.props.player().aboutText})
                                    })
                            }} />
                        </div>
                        <br />*/}
                        <div>
                            {/*<p className="modal-title">Custom Background</p>*/}
                            {this.renderPacks()}
                        </div>
                    </div>
                    <p className="modal-footer">
                        <a className="button is-primary hover is-size-6" onClick={this.props.closeModal}>
                            Finish
                        </a>
                    </p>
                </div>
            </Modal>
        )
    }
}

export class ProfilePage extends MComponent {
    constructor(props) {
        super("PROFILEPAGE", props)
        this.state = {
            settingsModalOpen: false,
            player: null,
            packs: null,
            background: null,
            user: null,
            invalid: false,
            posts: [],
            manifest: null,
            editing: false,
            editState: {
                displayName: "",
                aboutText: "",
                backgroundImage: "",
            }
        }
    }

    componentDidMount() {
        this.tryLoad()
        window.addEventListener("message", this.handleShopMessage.bind(this))
    }

    componentWillUnmount() {
        window.removeEventListener("message", this.handleShopMessage.bind(this))
    }

    handleShopMessage(e) {
        let data = e.data || e.data.data
        if(data) {
            if(!data.source || data.source.indexOf("react-devtools") === -1) {
                this.getLogger().debug(data)
            }
            if(data.mode === "store") {
                this.getLogger().debug("store ->", data)
                if(data.finished) {
                    axios.get(BACKEND_URL + `/api/v1/data/account/${this.props.match.params.id}/profile`).then(e => {
                        let data = JSON.parse(e.data)
                        this.getLogger().debug("fetched player =>", data)
                        if(data.error) {
                            // Probably an invalid thing, say something
                            this.setState({invalid: true})
                        } else {
                            this.setState({player: data, background: data.customBackground})
                        }
                    })
                }
            }
        }
    }

    renderEdit() {
        if(this.props.match.params.id === this.props.profileId) {
            /*
            return (
                <a className="button is-primary" onClick={() => this.setState({settingsModalOpen: true})}>Edit</a>
            )*/
            if(this.state.editing) {
                return (
                    <div>
                        <a className="button is-primary" 
                            onClick={() => {
                                const update = {
                                    id: this.state.player.id,
                                    customBackground: this.state.editState.customBackground.replace("/backgrounds/", ""),
                                    displayName: this.state.editState.displayName,
                                    aboutText: this.state.editState.aboutText
                                }
                                this.getLogger().debug("Updating account with data:", update)
                                axios.post(BACKEND_URL + `/api/v1/data/account/${this.state.player.id}/update`,
                                        update,
                                        {headers: {"Authorization": this.getAuth().getToken()}})
                                    .then(e => {
                                        this.fetchPlayer()
                                        this.fetchPosts()
                                        this.setState({
                                            editing: false
                                        })
                                    })
                            }}>
                            Save
                        </a>
                        <span style={{marginLeft: "0.25em", marginRight: "0.25em"}} />
                        <a className="button is-primary is-outlined" 
                            onClick={() => this.setState({
                                    editing: false,
                                    editState: {
                                        displayName: this.state.player.displayName,
                                        aboutText: this.state.player.aboutText,
                                        customBackground: this.state.player.customBackground,
                                    }
                                })}>
                            Cancel
                        </a>
                    </div>
                )
            } else {
                return (
                    <a className="button is-primary" onClick={() => this.setState({editing: true})}>Edit</a>
                )
            }
        } else {
            return ""
        }
    }

    componentDidUpdate() {
        if(this.state.id && this.props.match.params.id) {
            if(this.props.match.params.id !== this.state.id) {
                this.tryLoad()
            }
        }
    }

    fetchPlayer() {
        axios.get(BACKEND_URL + `/api/v1/data/account/${this.props.match.params.id}/profile`).then(e => {
            let data = e.data
            this.getLogger().debug("fetched player =>", data)
            if(data.error) {
                // Probably an invalid thing, say something
                this.setState({invalid: true})
            } else {
                this.setState({
                    player: data,
                    background: data.customBackground,
                    editState: {
                        displayName: data.displayName,
                        aboutText: data.aboutText,
                        customBackground: data.customBackground,
                    }
                })
            }
        })
    }

    fetchPosts() {
        axios.get(BACKEND_URL + `/api/v1/data/account/${this.props.match.params.id}/posts`).then(e => {
            let data = e.data
            this.getLogger().debug("fetched posts =>", data)
            this.setState({posts: data})
        })
    }

    // Try to load the player until we have everything needed
    tryLoad() {
        setTimeout(() => {
            if(this.props.match.params.id) {
                this.setState({id: this.props.match.params.id})
                this.fetchPlayer()
                axios.get(BACKEND_URL + "/api/v1/metadata/backgrounds/packs").then(e => {
                    let data = e.data
                    this.getLogger().debug("fetched packs =>", data)
                    this.setState({packs: data})
                })
                this.fetchPosts()
                axios.get(BACKEND_URL + `/api/v1/data/store/manifest`).then(e => {
                    let data = e.data
                    this.getLogger().debug("fetched manifest =>", data)
                    this.setState({manifest: data})
                })
            } else {
                this.tryLoad()
            }
        }, 100)
    }

    computePostStyle(post) {
        if(post.content.data) {
            switch(post.content.data.type) {
                case "event.account.background": {
                    return {
                        background: `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url("${post.content.data.bg}.png")`
                    }
                }
                default: {
                    return {}
                }
            }
        } else {
            return {}
        }
    }

    renderSystemPostText(post) {
        if(post.content.data) {
            switch(post.content.data.type) {
                case "event.levels.global": {
                    return `reached level ${post.content.data.level}.`
                }
                case "event.money": {
                    return `earned ${post.content.data.balance} money.`
                }
                case "event.account.background": {
                    return `changed their background.`
                }
                case "event.account.description": {
                    return `updated their description.`
                }
                case "event.account.displayName": {
                    return (
                        <span>
                            changed their name from <b>{post.content.data.old}</b> to <b>{post.content.data.new}</b>.
                        </span>
                    )
                }
                case "event.social.twitch": {
                    switch(post.content.data.streamMode) {
                        case "start": {
                            return `started streaming on Twitch.`
                        }
                        case "end": {
                            return `finished streaming on Twitch.`
                        }
                        default: {
                            return `did something awesome on Twitch, but we don't know what.`
                        }
                    }
                }
                default: {
                    return `did something awesome, but we don't know what.`
                }
            }
        } else {
            return post.content.text
        }
    }

    renderTimeline() {
        if(this.state.posts && this.state.posts.length > 0) {
            let posts = []

            let key = 0
            const now = new Date()
            this.state.posts.forEach(post => {
                if(post.system) {
                    posts.push(
                        <div className="column is-12 is-not-quite-black rounded-corners post-column is-flex flex-row" key={key++} style={this.computePostStyle(post)}>
                            <span><b>{this.state.player.displayName}</b> {this.renderSystemPostText(post)}</span>
                            <span style={{marginLeft: "auto", marginRight: "0.5em"}} />
                            <span>{formatRelative(new Date(bigInt(post.id).shiftRight(22).valueOf() + MEWNA_EPOCH), now)}</span>
                        </div>
                    )
                } else {
                    posts.push(
                        <div className="column is-12 is-not-quite-black rounded-corners post-column is-flex flex-row" key={key++}>
                            <span><b>{this.state.player.displayName}</b> {post.content.text}</span>
                            <span style={{marginLeft: "auto", marginRight: "0.5em"}} />
                            <span>{formatRelative(new Date(bigInt(post.id).shiftRight(22).valueOf() + MEWNA_EPOCH), now)}</span>
                        </div>
                    )
                }
            })
            return posts
        } else {
            return (
                <div className="column is-12 is-not-quite-black rounded-corners">
                    <b>{this.state.player.displayName}</b> hasn't done anything notable yet...
                </div>
            )
        }
    }

    renderDisplayName() {
        if(this.state.editing) {
            return (
                <div className="profile-name" style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    alignContent: "center",
                }}>
                    <DebouncedText value={this.state.editState.displayName} callback={(e) => {
                                    let editState = this.state.editState
                                    editState.displayName = e.value
                                    this.setState({editState: editState})
                                }} />
                </div>
            )
        } else {
            return (
                <div className="profile-name">
                    {this.state.player.displayName}
                </div>
            )
        }
    }

    renderAboutText() {
        if(this.state.editing) {
            return (
                <DebouncedTextarea value={this.state.editState.aboutText} maxChars={150} callback={(e) => {
                    let editState = this.state.editState
                    editState.aboutText = e.textarea_value
                    this.setState({editState: editState})
                }} />
            )
        } else {
            return (
                <p>{this.state.player.aboutText}<br /></p>
            )
        }
    }

    renderProfileColumn() {
        return (
            <div className="column is-3 profile-column profile-about-column">
                <div>
                    <img src={this.state.player.avatar} alt="avatar" className="profile-avatar" />
                    {this.renderDisplayName()}
                    <hr className="dark-hr" />
                    <p className="profile-about-text-title">About</p>
                    {this.renderAboutText()}
                    {/*
                    <strong className="has-text-white">OTHER STATS:</strong><br />
                    Will go here eventually I guess~
                    */}
                </div>
            </div>
        )
    }

    renderBackground() {
        if(this.state.editing) {
            return (
                <div className="profile-background-section">
                    <div
                        style={{
                            backgroundImage: `url(${this.state.editState.customBackground}.png)`,
                            width: "100%",
                            height: "100%",
                            backgroundSize: "cover",
                            backgroundPosition: "0% 35%",
                            filter: "brightness(0.5)"
                        }}
                    />
                    <div className="profile-background-section-editing" onClick={() => this.setState({settingsModalOpen: true})}>
                        Click to change background image.
                    </div>
                </div>
            )
        } else {
            return (
                <div className="profile-background-section">
                    <div
                        style={{
                            backgroundImage: `url(${this.state.background}.png)`,
                            width: "100%",
                            height: "100%",
                            backgroundSize: "cover",
                            backgroundPosition: "0% 35%"
                        }}
                    />
                </div>
            )
        }
    }

    render() {
        if(this.state.invalid) {
            return (
                <NotFound />
            )
        } else if(this.state.player && this.state.packs && this.state.manifest) {
            return (
                <div>
                    {this.renderBackground()}
                    <div className="profile-top-bar">
                        <div className="container is-4em-h">
                            <div className="columns profile-column-container is-4em-h is-flex" style={{flexDirection: "row", alignItems: "center"}}>
                                <div className="column is-3 profile-column is-4em-h" />
                                <div className="column is-9 profile-column is-4em-h profile-top-bar-inner">
                                    {/*<a className="profile-header-link">Timeline</a>
                                    <a className="profile-header-link">More info</a>*/}
                                    <span style={{marginLeft: "auto", marginRight: "1em"}} />
                                    <div>
                                        {this.renderEdit()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <VHContainer>
                        <ProfileSettingsModal
                            isModalOpen={() => this.state.settingsModalOpen}
                            afterOpenModal={() => {}}
                            closeModal={() => {this.setState({settingsModalOpen: false})}}
                            packs={this.state.packs}
                            manifest={this.state.manifest}
                            //user={this.state.user}
                            player={() => this.state.player}
                            onAboutUpdate={(text) => {
                                this.getLogger().debug("Update aboutText =>", text)
                                let player = Object.assign({}, this.state.player)
                                player.aboutText = text
                                this.setState({player: player})
                            }}
                            backgroundMouseOver={bg => {
                                /*
                                if(this.state.editState.customBackground !== bg) {
                                    let editState = Object.assign({}, this.state.editState)
                                    editState.customBackground = bg
                                    this.setState({editState: editState})
                                }
                                */
                            }}
                            backgroundMouseOut={() => {
                                /*
                                if(this.state.editState.customBackground !== this.state.player.customBackground) {
                                    let editState = Object.assign({}, this.state.editState)
                                    editState.customBackground = this.state.player.customBackground
                                    this.setState({editState: editState})
                                }
                                */
                            }}
                            backgroundOnClick={(name, pack, src) => {
                                /*
                                const bg = `${pack}/${name}`
                                axios.post(BACKEND_URL + `/api/v1/data/account/${this.state.player.id}/update`,
                                    {customBackground: bg, id: this.state.player.id},
                                    {headers: {"Authorization": this.getAuth().getToken()}})
                                    .then(e => {
                                        this.getLogger().debug("Update customBackground =>", bg)
                                        let player = Object.assign({}, this.state.player)
                                        player.customBackground = src.replace(".png", "")
                                        this.setState({background: player.customBackground, player: player})
                                    })
                                    */
                                const bg = `/backgrounds/${pack}/${name}`
                                this.getLogger().debug("Current =>", this.state.editState.customBackground, "New =>", bg)
                                let editState = Object.assign({}, this.state.editState)
                                editState.customBackground = bg
                                this.setState({editState: editState}, () => {
                                    this.getLogger().debug("EditState =>", this.state.editState)
                                })
                            }}
                        />
                        <div className="columns profile-column-container">
                            {this.renderProfileColumn()}
                            <div className="column is-12 is-hidden-tablet" />
                            <div className="column is-9 profile-column rounded-corners">
                                <div className="columns is-multiline">
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

export const ProfilePageRedux = connect(mapStateToProps)(ProfilePage)
