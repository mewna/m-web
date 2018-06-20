import {MComponent} from "../../MComponent"
import React from "react"
import {connect} from 'react-redux'
import {VHContainer} from "../VHContainer"
import BubblePreloader from 'react-bubble-preloader'
import Modal from 'react-modal'
import {DebouncedTextarea} from "../../comp/DebouncedTextarea"
import axios from 'axios'
import {BACKEND_URL} from "../../const"

class BackgroundCard extends MComponent {
    constructor(props) {
        super("BACKGROUNDCARD", props)
    }

    render() {
        return (
            <div className="profile-background-image-wrapper rounded-corners hover"
                onMouseOver={() => this.props.backgroundMouseOver(this.props.src.replace(".png", ""))}
                onMouseOut={() => this.props.backgroundMouseOut()}>
                <a onClick={() => this.props.backgroundOnClick(this.props.name, this.props.pack, this.props.src)}>
                    {/* TODO: On-click animation registering use */}
                    <div className="profile-background-image-container">
                        <img src={this.props.src} alt={this.props.alt} className="profile-background-image" />
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
        this.state = {aboutText: this.props.player.aboutText}
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
                    <BackgroundCard src={bg.path} alt={bg.name} pack={bg.pack} name={bg.name}
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
            const packLocked = this.props.player.ownedBackgroundPacks.filter(p => e === p).length === 0
            cards.push(<div className="column is-12" key={key++}>
                <p className="modal-title is-size-6">
                    {packLocked ? <span style={{marginRight: "0.5em"}}><i className="fas fa-lock" /></span> : ""}
                    {e.toUpperCase().replace("_", " ")}
                    {packLocked ? <span style={{marginLeft: "0.5em"}} className="has-text-primary">500 <i className="fab fa-bitcoin" /></span> : ""}
                </p>
            </div>)
            let counter = 0
            packs[e].forEach(bg => {
                cards.push(
                    <div className="column is-4 is-paddingless-top" key={key++}>
                        <BackgroundCard src={bg.path} alt={bg.name} pack={bg.pack} name={bg.name}
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
            containers.push(
                <div className="columns is-multiline" key={key++}>
                    {cards}
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
                        this.props.closeModal()
                    }
                }}
                className="mewna-modal"
                overlayClassName="mewna-modal-overlay"
                ariaHideApp={false}>
                {/* ^^^ I have no fucking clue how to do this right ;-; */}
                <div className="modal-container">                    
                    <p className="is-size-4 has-text-white has-text-weight-semibold modal-header">
                        Profile Settings
                    </p>
                    <div className="modal-body">
                        <div>
                            <p className="modal-title">About</p>
                            <DebouncedTextarea maxChars={150} rows={3} min-rows={3} value={this.state.aboutText} callback={(e) => {
                                const val = e.textarea_value.replace(/\r?\n|\r/g, "")
                                axios.post(BACKEND_URL + `/api/v1/data/player/${this.props.user.id}`, {aboutText: val}, {headers: {"Authorization": this.getAuth().getToken()}})
                                    .then(e => this.props.onAboutUpdate(val))
                            }} />
                        </div>
                        <br />
                        <div>
                            <p className="modal-title">Custom Background</p>
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
        this.state = {settingsModalOpen: false, player: null, packs: null, background: null}
    }

    getAvatar() {
        const base = `https://cdn.discordapp.com/avatars/${this.props.user.id}`
        if(this.props.user.avatar) {
            const avatar = this.props.user.avatar
            if(avatar.startsWith("a_")) {
                return `${base}/${avatar}.gif`
            } else {
                return `${base}/${avatar}.png`
            }
        } else {
            const avatar = parseInt(this.props.user.discriminator, 10) % 5
            return `${base}/${avatar}.png`
        }
    }

    renderEdit() {
        if(this.props.match.params.id === this.props.user.id) {
            return (
                <a className="button is-primary" onClick={() => this.setState({settingsModalOpen: true})}>Edit</a>
            )
        } else {
            return ""
        }
    }

    // Try to load the player until we have everything needed from redux
    tryLoad() {
        setTimeout(() => {
            if(this.props.user && this.props.user.id) {
                axios.get(BACKEND_URL + "/api/v1/data/player/" + this.props.user.id).then(e => {
                    let data = JSON.parse(e.data)
                    this.getLogger().debug("fetched player =>", data)
                    this.setState({player: data, background: data.customBackground})
                })
                axios.get(BACKEND_URL + "/api/v1/metadata/backgrounds/packs").then(e => {
                    let data = e.data
                    this.getLogger().debug("fetched packs =>", data)
                    this.setState({packs: data})
                })
            } else {
                this.tryLoad()
            }
        }, 100)
    }

    componentDidMount() {
        this.tryLoad()
    }

    render() {
        if(this.props.user && this.props.user.username && this.state.player && this.state.packs) {
            return (
                <div>
                    <section className="section is-medium profile-background-section" style={{backgroundImage: `url(${this.state.background}.png)`}} />
                    <VHContainer style={{paddingLeft: "8px", paddingRight: "8px"}}>
                        <ProfileSettingsModal
                            isModalOpen={() => this.state.settingsModalOpen}
                            afterOpenModal={() => {}}
                            closeModal={() => {this.setState({settingsModalOpen: false})}}
                            packs={this.state.packs}
                            user={this.props.user}
                            player={this.state.player}
                            onAboutUpdate={(text) => {
                                this.getLogger().debug("Update aboutText =>", text)
                                let player = Object.assign({}, this.state.player)
                                player.aboutText = text
                                this.setState({player: player})
                            }}
                            backgroundMouseOver={bg => this.setState({background: bg}, () => this.getLogger().debug("Switched background to hover"))}
                            backgroundMouseOut={() => this.setState({background: this.state.player.customBackground}, () => this.getLogger().debug("Switched background back"))}
                            backgroundOnClick={(name, pack, src) => {
                                const bg = `${pack}/${name}`
                                axios.post(BACKEND_URL + `/api/v1/data/player/${this.props.user.id}`, {customBackground: bg}, {headers: {"Authorization": this.getAuth().getToken()}})
                                    .then(e => {
                                        this.getLogger().debug("Update customBackground =>", bg)
                                        let player = Object.assign({}, this.state.player)
                                        player.customBackground = src.replace(".png", "")
                                        this.setState({background: player.customBackground, player: player})
                                    })
                            }}
                        />
                        <div className="profile-top-spacer" />
                        <div className="columns">
                            <div className="column is-3 profile-column is-not-quite-black rounded-corners" style={{minHeight: "11em", height: "11em"}}>
                                <div>
                                    <img src={this.getAvatar()} alt="avatar" className="profile-avatar" />
                                    <div className="profile-name">
                                        {this.props.user.username}'s profile<span style={{marginRight: "0.25em"}} />{this.renderEdit()}
                                    </div>
                                    <p className="has-text-white is-size-3 has-text-weight-semibold">About</p>
                                    {this.state.player.aboutText}
                                </div>
                            </div>
                            <div className="column is-12 is-hidden-tablet" />
                            <div className="column is-9 profile-column rounded-corners">
                                <div className="columns is-multiline">
                                    {/*
                                    <div className="column is-12 is-not-quite-black rounded-corners">
                                        <b>{this.props.user.name}</b> hasn't done anything notable yet...
                                    </div>
                                    */}
                                    <div className="column is-12 is-not-quite-black rounded-corners post-column is-flex flex-row">
                                        <span style={{marginRight: "0.25em"}}><i className="far fa-money-bill-alt"></i></span>
                                        <span><b>{this.props.user.username}</b> donated for the first time.</span>
                                        <span style={{marginLeft: "auto", marginRight: "0.5em"}} />
                                        <span>1 minute ago</span>
                                    </div>
                                    <div className="column is-12 is-not-quite-black rounded-corners post-column is-flex flex-row">
                                        <span style={{marginRight: "0.25em"}}><i className="fas fa-trophy"></i></span>
                                        <span><b>{this.props.user.username}</b> hit level 10 for the first time.</span>
                                        <span style={{marginLeft: "auto", marginRight: "0.5em"}} />
                                        <span>5 minutes ago</span>
                                    </div>
                                    <div className="column is-12 is-not-quite-black rounded-corners post-column is-flex flex-row">
                                        <span style={{marginRight: "0.25em"}}><i className="fas fa-trophy"></i></span>
                                        <span><b>{this.props.user.username}</b> hit level 1 for the first time.</span>
                                        <span style={{marginLeft: "auto", marginRight: "0.5em"}} />
                                        <span>29 minutes ago</span>
                                    </div>
                                    <div className="column is-12 is-not-quite-black rounded-corners post-column is-flex flex-row">
                                        <span style={{marginRight: "0.25em"}}><i className="fas fa-paint-brush"></i></span>
                                        <span><b>{this.props.user.username}</b> changed their background for the first time.</span>
                                        <span style={{marginLeft: "auto", marginRight: "0.5em"}} />
                                        <span>30 minutes ago</span>
                                    </div>
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
        user: state.user
    }
}

export const ProfilePageRedux = connect(mapStateToProps)(ProfilePage)