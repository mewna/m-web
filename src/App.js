import React from 'react'
import {BrowserRouter, Route} from "react-router-dom"

import {IndexRedux} from "./page/Index"
import {Dashboard} from "./page/Dashboard"
import {NoAuth} from "./page/NoAuth"
import {Provider} from 'react-redux'

import {MComponent} from "./MComponent"

class App extends MComponent {
    constructor(props) {
        super("APP", props)
    }

    render() {
        return (
            <Provider store={this.getStore().getStore()}>
                <div className="main">
                    <BrowserRouter>
                        <main className="content">
                            <div className="container">
                                <Route exact path="/" component={IndexRedux}/>
                                <Route exact path="/dashboard" component={Dashboard}/>
                                <Route exact path="/noauth" component={NoAuth}/>
                            </div>
                        </main>
                    </BrowserRouter>
                </div>
            </Provider>
        )
    }
}

export default App
