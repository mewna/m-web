import React from 'react'
import {MComponent} from '../MComponent'
import {TopBar} from './TopBar';

export class DashboardHeader extends MComponent {
    constructor(props) {
        super("DASHBOARDHEADER", props)
    }

    render() {
        let bg
        if(this.props.player) {
            bg = `${this.props.player.customBackground}.png`
        } else {
            bg = `/backgrounds/default/plasma.png`
        }
        const HEIGHT = "12em"
        return (
            <div>
                <div style={{overflow: "hidden", height: HEIGHT}}>
                    <section className={"section leaderboards-header-image"}
                        style={{
                            background: `url("${bg}") center / cover`,
                            height: HEIGHT
                        }}>
                    </section>
                </div>
                <TopBar noTitle={true}>
                    {this.props.children}
                </TopBar>
            </div>
        )
    }
}