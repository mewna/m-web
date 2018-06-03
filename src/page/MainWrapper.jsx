import {Component} from 'react'
import React from 'react'

export class MainWrapper extends Component {
    render() {
        return (
            <div className="main container">
                <main className="content">
                    {this.props.children}
                </main>
            </div>
        )
    }
}