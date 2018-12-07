/* eslint jsx-a11y/anchor-is-valid: 0 */

import React from 'react'
import {MComponent} from '../../MComponent'
import ReactMarkdown from 'react-markdown'

const MAX_CHARS = 10000
const MAX_TITLE_CHARS = 128

export class PostEditor extends MComponent {
    constructor(props) {
        super("POSTEDITOR", props)
        const initial = this.props.initial || {}
        const title = initial.title || ""
        const content = initial.content || ""
        this.state = {
            postBodyValue: content,
            postCharsLeft: MAX_CHARS,
            postTitleValue: title,
            rows: 8,
            minRows: 8,
            editMode: true,
            error: null,
        }
    }

    handleEditorChange(e) {
        // noinspection JSUnresolvedVariable
        let input = e.target.value
        if(input.length > MAX_CHARS) {
            input = input.substring(0, MAX_CHARS)
        }
        this.setState({
            postCharsLeft: MAX_CHARS - input.length,
            postBodyValue: input,
        })
    }

    handleTitleChange(e) {
        const input = e.target.value
        this.setState({postTitleValue: input})
    }

    renderPreview() {
        if(!this.state.postBodyValue || this.state.postBodyValue === "") {
            return (
                "You haven't written anything yet!"
            )
        } else {
            return (
                <div>
                    <h2>{this.state.postTitleValue}</h2>
                    <ReactMarkdown source={this.state.postBodyValue} />
                </div>
            )
        }
    }

    renderEditor() {
        let error = ""
        if(this.state.error) {
            const cards = []
            let key = 0
            for(const err of this.state.error) {
                cards.push(<div className="notification is-primary" key={key++}>
                    {err}
                </div>)
            }
            error = (
                <div style={{marginBottom: "1.5em"}}>
                    {cards}
                </div>
            )
        }
        let title = ""
        if(this.props.title) {
            title = (
                <div>
                    Title
                    <input type="text" className="input" placeholder="Post title (3 characters minimum)" maxLength={MAX_TITLE_CHARS}
                        style={{marginBottom: "2em"}} value={this.state.postTitleValue} onChange={(e) => this.handleTitleChange(e)}
                        />
                </div>
            )
        }
        let buttons = (
            <div>
                {!this.props.nohr ? <hr className="dark-hr" /> : ""}
                <div style={{marginBottom: "1.5em"}}>
                    Supports Reddit-style markdown, as well as <code>![images](url)</code>.
                </div>
                <a className="button is-primary" onClick={e => {
                    e.preventDefault()
                    if(this.state.postBodyValue && this.state.postBodyValue.length && this.state.postBodyValue.length >= 100 
                        && (!this.props.title || this.state.postTitleValue.length >= 3)) {
                        this.props.callback && this.props.callback(this.state.postTitleValue, this.state.postBodyValue)
                    } else {
                        let error = [`Please write a little more (${100 - this.state.postBodyValue.length} more characters).`]
                        if(this.props.title ** this.state.postTitleValue.length < 3) {
                            error.push(`Please make sure your title is at least 3 characters.`)
                        }
                        this.setState({error: error},
                            () => {
                                setTimeout(() => {
                                    this.setState({error: null})
                                }, 5000)
                            })
                    }
                }}>Post</a>
            </div>
        )
        if(this.props.buttons) {
            buttons = this.props.buttons(this.state.postTitleValue, this.state.postBodyValue)
        }
        return (
            <div>
                {error}
                {title}
                <div className="textarea-container">
                    Post
                    <textarea onChange={(e) => this.handleEditorChange(e)} className={"dark-textarea"} rows={this.state.rows} min-rows={this.state.minRows}
                        value={this.state.postBodyValue} placeholder="Your post goes here" />
                    <div className="textarea-counter">{MAX_CHARS - this.state.postCharsLeft}/{MAX_CHARS}</div>
                </div>
                {buttons}
            </div>
        )
    }

    render() {
        let data
        if(this.state.editMode) {
            data = this.renderEditor()
        } else {
            data = this.renderPreview()
        }
        return (
            <div>
                <div className="is-flex flex-row editor-tabs">
                    <a className={"editor-tab-link" + (this.state.editMode ? " is-active" : "")} onClick={() => this.setEdit(true)}>Editor</a>
                    <a className={"editor-tab-link" + (this.state.editMode ? "" : " is-active")} onClick={() => this.setEdit(false)}>Preview</a>
                </div>
                <hr className="dark-hr" />
                {data}
            </div>
        )
    }

    setEdit(state) {
        this.setState({editMode: !!state})
    }
}
