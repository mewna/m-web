import {Component} from 'react'
import React from 'react'

export class VHContainer extends Component {
    render() {
        return (
            <div className="container" style={this.props.style}>
                <main className="content" style={{position: "relative"}}>
                    {this.props.children}
                </main>
            </div>
        )
    }
}