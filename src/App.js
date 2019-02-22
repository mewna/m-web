import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import { IndexRedux } from "./page/Index";
import { Dashboard } from "./page/Dashboard";
import { NoAuth } from "./page/NoAuth";
import { Provider } from "react-redux";
import { ProfilePageRedux } from "./page/profile/ProfilePage";

import { MComponent } from "./MComponent";
import { NavbarRedux } from "./comp/Navbar";
import { VHContainer } from "./page/VHContainer";
import { NotFound } from "./page/NotFound";
import Switch from "react-router/Switch";
import { DiscordLeaderboards } from "./page/discord/DiscordLeaderboards";
import { PaypalCheckout } from "./page/paypal/PaypalCheckout";
import { Features } from "./page/Features";
import { Commands } from "./page/discord/Commands";
// import { ServerPageRedux } from "./page/server/ServerPage";

class App extends MComponent {
  constructor(props) {
    super("APP", props);
  }

  render() {
    return (
      <Provider store={this.getStore().getStore()}>
        <div>
          <BrowserRouter>
            <div>
              <NavbarRedux />
              <Switch>
                <Route exact path="/" component={IndexRedux} />
                <Route exact path="/features" component={Features} />
                <Route exact path="/discord/dashboard*" component={Dashboard} />
                <Route exact path="/profile/:id" component={ProfilePageRedux} />
                {/*<Route exact path="/server/:id/:post?" component={ServerPageRedux} />*/}
                <Route
                  exact
                  path="/noauth"
                  render={() => {
                    return (
                      <VHContainer>
                        <NoAuth />
                      </VHContainer>
                    );
                  }}
                />
                <Route exact path="/discord/commands" component={Commands} />
                <Route
                  exact
                  path="/discord/leaderboards/:id"
                  component={DiscordLeaderboards}
                />
                <Route
                  exact
                  path="/paypal-checkout/:id/:sku"
                  component={PaypalCheckout}
                />
                <Route component={NotFound} />
              </Switch>
            </div>
          </BrowserRouter>
          <footer className="footer">
            <div className="container">
              <div className="content has-text-centered">
                <small>(c) amy 2018 - present</small>
              </div>
            </div>
          </footer>
        </div>
      </Provider>
    );
  }
}

export default App;
