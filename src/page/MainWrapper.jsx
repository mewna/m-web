import {Component} from 'react'
import React from 'react'

export class Container extends Component {
    render() {
        return (
            <div className="container">
                <main className="content">
                    {this.props.children}
                </main>
            </div>
        )
    }
}