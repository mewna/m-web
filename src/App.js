import React from 'react'
import {BrowserRouter, Route} from "react-router-dom"

import {IndexRedux} from "./page/Index"
import {Dashboard} from "./page/Dashboard"
import {NoAuth} from "./page/NoAuth"
import {Provider} from 'react-redux'
import {ProfilePageRedux} from './page/profile/ProfilePage'

import {MComponent} from "./MComponent"
import {NavbarRedux} from "./comp/Navbar"
import {MainWrapper} from './page/MainWrapper';

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
                            <NavbarRedux />
                            <Route exact path="/" render={() => {
                                return (
                                    <MainWrapper>
                                        <IndexRedux />
                                    </MainWrapper>
                                )
                            }} />
                            <Route exact path="/dashboard*" component={Dashboard} />
                            <Route exact path="/profile/:id" component={ProfilePageRedux} />
                            <Route exact path="/noauth" render={() => {
                                return (
                                    <MainWrapper>
                                        <NoAuth />
                                    </MainWrapper>
                                )
                            }} />
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
