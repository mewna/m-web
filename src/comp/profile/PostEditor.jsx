import React from 'react'
import {MComponent} from '../../MComponent'
import ReactMarkdown from 'react-markdown'

const MAX_CHARS = 10000

export class PostEditor extends MComponent {
    constructor(props) {
        super("POSTEDITOR", props)
        this.state = {
            textareaValue: "",
            charsLeft: MAX_CHARS,
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
            charsLeft: MAX_CHARS - input.length,
            textareaValue: input,
        })
    }

    renderPreview() {
        if(!this.state.textareaValue || this.state.textareaValue === "") {
            return (
                "You haven't written anything yet!"
            )
        } else {
            return (
                <ReactMarkdown source={this.state.textareaValue} />
            )
        }
    }

    renderEditor() {
        let error = ""
        if(this.state.error) {
            error = (
                <div style={{marginBottom: "1.5em"}}>
                    {this.state.error}
                </div>
            )
        }
        return (
            <div>
                <div className="textarea-container">
                    <textarea onChange={(e) => this.handleEditorChange(e)} className={"dark-textarea"} rows={this.state.rows} min-rows={this.state.minRows}
                        value={this.state.textareaValue} />
                    <div className="textarea-counter">{MAX_CHARS - this.state.charsLeft}/{MAX_CHARS}</div>
                </div>
                <hr className="dark-hr" />
                {error}
                <a className="button is-primary" onClick={e => {
                    e.preventDefault()
                    if(this.state.textareaValue && this.state.textareaValue.length && this.state.textareaValue.length >= 100) {
                        this.props.callback && this.props.callback(this.state.textareaValue)
                    } else {
                        this.setState({error: `Please write a little more (${100 - this.state.textareaValue.length} more characters).`},
                            () => {
                                setTimeout(() => {
                                    this.setState({error: null})
                                }, 5000)
                            })
                    }
                }}>Post</a>
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
            <div className="column is-12 is-not-quite-black rounded-corners post-column is-flex" style={{flexDirection: "column"}}>
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
