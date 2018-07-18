import {MComponent} from "../MComponent"
import React from "react"
import {DiscordLoginButton} from "../comp/DiscordLoginButton"

export class Features extends MComponent {
    constructor(props) {
        super("FEATURES", props)
    }

    render() {
        return (
            <div>
                <div className={"index-top-spacer-div is-hidden-mobile"} />
                <div className="features-fullwidth features-container">
                    <div className="container" style={{position: "inherit"}}>
                        <div className="columns features-fullwidth">
                            <div className="column is-6 features-column-vcenter">
                                <section className="section is-medium has-text-left">
                                    <h1 className="title has-text-white is-size-4 has-text-weight-light">Keep up with your favourite streamers.</h1>
                                    Mewna gives you immediate notifications when streamers go live. No more waiting for some
                                    other bot; Mewna does it within seconds. 
                                </section>
                            </div>
                            <div className="column is-6 features-column-vcenter features-column-hcenter">
                                <section className="section is-medium has-text-supercentered">
                                    <div className="index-mewna-content">
                                        <div className="index-mewna-content-inner">
                                            <img src="/discord-box.png" alt="discord" className="index-mewna-floaty-box floaty-box-1" />
                                            <img src="/twitch-box.png" alt="twitch" className="index-mewna-floaty-box features-floaty-box-1" />
                                            <img src="/mewna-laptop.svg" alt="mewna" className="index-mewna-image" />
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="features-background-image-2 is-hidden-mobile" />

                <div className="is-not-quite-black features-fullwidth features-container">
                    <div className="container" style={{position: "inherit"}}>
                        <div className="columns features-column-reverse-mobile">
                            <div className="column is-6 features-column-vcenter features-column-hcenter">
                                <section className="section is-medium has-text-centered">
                                    <img src="/levels-example.png" alt="levels example" />
                                </section>
                            </div>
                            <div className="column is-6 features-column-vcenter">
                                <section className="section is-medium has-text-left">
                                    <h1 className="title has-text-white is-size-4 has-text-weight-light">Give your server some fun.</h1>
                                    With features from chat levels to currency, Mewna makes it easy to entertain people in 
                                    your server. 
                                </section>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="features-background-image-2 background-flipped is-hidden-mobile" />
                <div className="features-fullwidth features-container">
                    <div className="container" style={{position: "inherit"}}>
                        <div className="columns">
                            <div className="column is-6 features-column-vcenter">
                                <section className="section is-medium has-text-left">
                                    <h1 className="title has-text-white is-size-4 has-text-weight-light">All the cute kitties you could want.</h1>
                                    Let's be real - cute cats are an important part of the internet. Which is why Mewna brings 
                                    built-in support for all the random cat and dog pictures you could want. 
                                </section>
                            </div>
                            <div className="column is-6 features-column-vcenter features-column-hcenter">
                                <section className="section is-medium has-text-centered">
                                    <img src="/cat-example.png" alt="cat example" />
                                </section>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="has-text-centered features-fullwidth features-cta">
                    <section className="section is-medium">
                        <h1 className="title has-text-white is-size-4 has-text-weight-light">So what're you waiting for?</h1>
                        <DiscordLoginButton className="is-inline-block index-button hover" innerClass="button is-primary" text="Get started" />
                    </section>
                </div>
            </div>
        )
    }
}
