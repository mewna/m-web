import React from 'react'
import {BrowserRouter, Route} from "react-router-dom"

import {IndexRedux} from "./page/Index"
import {Dashboard} from "./page/Dashboard"
import {NoAuth} from "./page/NoAuth"
import {Provider} from 'react-redux'
import {ProfilePageRedux} from './page/profile/ProfilePage'

import {MComponent} from "./MComponent"
import {NavbarRedux} from "./comp/Navbar"
import {VHContainer} from './page/VHContainer'
import {NotFound} from './page/NotFound';
import Switch from 'react-router/Switch';

class App extends MComponent {
    constructor(props) {
        super("APP", props)
    }

    render() {
        return (
            <Provider store={this.getStore().getStore()}>
                <div>
                    <BrowserRouter>
                        <div>
                            {/* See note in Dashboard.jsx#render() for WHY we do this like this. */}
                            <NavbarRedux />
                            <Switch>
                                <Route exact path="/" render={() => {
                                    return (
                                        <VHContainer>
                                            <IndexRedux />
                                        </VHContainer>
                                    )
                                }} />
                                <Route exact path="/discord/dashboard*" component={Dashboard} />
                                <Route exact path="/profile/:id" component={ProfilePageRedux} />
                                <Route exact path="/noauth" render={() => {
                                    return (
                                        <VHContainer>
                                            <NoAuth />
                                        </VHContainer>
                                    )
                                }} />
                                <Route component={NotFound} />
                            </Switch>
                        </div>
                    </BrowserRouter>
                    <div className="main container">
                    </div>
                    <footer className="footer">
                        <div className="container">
                            <div className="content has-text-centered">
                                <small>
                                    (c) amy 2018 - present
                                </small>
                            </div>
                        </div>
                    </footer>
                </div>
            </Provider>
        )
    }
}

export default App
