import React from 'react'
import {BrowserRouter, Route} from "react-router-dom"

import {IndexRedux} from "./page/Index"
import {Dashboard} from "./page/Dashboard"
import {NoAuth} from "./page/NoAuth"
import {Provider} from 'react-redux'

import {MComponent} from "./MComponent"
import {NavbarRedux} from "./comp/Navbar";

class App extends MComponent {
    constructor(props) {
        super("APP", props)
    }

    render() {
        return (
            <Provider store={this.getStore().getStore()}>
                <div className="main container">
                    <BrowserRouter>
                        <div>
                            <NavbarRedux/>
                            <div className={"columns"}>
                                <div className={"column is-12"}>
                                    <main className="content">
                                        <Route exact path="/" component={IndexRedux}/>
                                        <Route exact path="/dashboard*" component={Dashboard}/>
                                        {/*
                                        <Route exact path="/dashboard/:id" component={Dashboard}/>
                                        <Route exact path="/dashboard/:id/:page" component={Dashboard}/>
                                        */}
                                        <Route exact path="/noauth" component={NoAuth}/>
                                    </main>
                                </div>
                            </div>
                        </div>
                    </BrowserRouter>
                </div>
            </Provider>
        )
    }
}

export default App
