import {MComponent} from "../../MComponent"
import BubblePreloader from 'react-bubble-preloader'
import React from "react"
import axios from 'axios'
import {VHContainer} from "../VHContainer";
import {BACKEND_URL} from "../../const";
import translate from "../../translate"

export class Commands extends MComponent {
    constructor(props) {
        super("COMMANDS", props)
        this.state = {commands: null}
    }

    componentDidMount() {
        axios.get(BACKEND_URL + "/api/v1/metadata/commands").then(data => {
            let commands = data.data
            // {
            //   "name": "items", 
            //   "aliases": [ "inventory" ] 
            //   "desc": "View your items.", 
            //   "plugin": "Economy", 
            //   "usage": [ "items" ], 
            //   "examples": [ "items" ], 
            // }
            let x = {}
            for(let c of commands) {
                if(!x[c.plugin]) {
                    x[c.plugin] = []
                }
                x[c.plugin].push(c)
            }
            this.setState({commands: x})
        })
    }

    renderCommands() {
        let cards = []
        let key = 0
        for(let plugin of Object.keys(this.state.commands)) {
            cards.push(
                <div className="column is-12" key={key++}>
                    <h1 className="title has-text-white is-size-3">{plugin}</h1>
                </div>
            )
            let commands = this.state.commands[plugin]
            for(let c of commands) {
                let aliases = "none"
                if(c.aliases.length > 0) {
                    aliases = []
                    for(let alias of c.aliases) {
                        const comma = alias === c.aliases[c.aliases.length - 1] ? "" : ", "
                        aliases.push(
                            <span key={key++}><span className="has-text-grey">mew.</span><span>{alias}</span>{comma}</span>
                        )
                    }
                }
                let usage = []
                for(let use of c.usage) {
                    const comma = use === c.usage[c.usage.length - 1] ? "" : <br />
                    usage.push(
                        <span key={key++}><span className="has-text-grey">mew.</span><span>{use}</span>{comma}</span>
                    )
                }
                let examples = []
                for(let example of c.examples) {
                    const comma = example === c.examples[c.examples.length - 1] ? "" : <br />
                    examples.push(
                        <span key={key++}><span className="has-text-grey">mew.</span><span>{example}</span>{comma}</span>
                    )
                }
                cards.push(
                    <div key={key++} className="column is-4">
                        <div className="command-card">
                            <div className="is-size-5"><span className="has-text-grey">mew.</span>{c.name}</div>
                            <div className="is-size-6">
                                <strong>Aliases:</strong> {aliases}
                            </div>
                            <div className="is-size-6">
                                <em>{translate(c.desc)}</em>
                            </div>
                            <div className="is-size-6">
                                <strong>Usage:</strong><br />
                                {usage}
                            </div>
                            <div className="is-size-6">
                                <strong>Examples:</strong><br />
                                {examples}
                            </div>
                        </div>
                    </div>
                )
            }
            if(plugin !== Object.keys(this.state.commands)[Object.keys(this.state.commands).length - 1]) {
                cards.push(
                    <div className="column is-12" key={key++}>
                        <hr className="dark-hr" />
                    </div>
                )
            }
        }
        return cards
    }

    render() {
        if(this.state.commands && this.state.commands !== {}) {
            return (
                <div>
                    <section className="section is-small" />
                    <VHContainer>
                        <h1 className="title has-text-white is-size-2">Commands</h1>
                        <hr className="dark-hr" />
                        <div className="is-centered has-text-centered">
                            <div className="columns command-column is-multiline has-text-left">
                                {this.renderCommands()}
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
