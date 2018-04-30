import {applyMiddleware, createStore} from 'redux'

const UPDATE_USER = "UPDATE_USER"
const UPDATE_GUILDS = "UPDATE_GUILDS"

const initialState = {
    user: null,
    guilds: null,
}

const createStoreWithMiddleware = applyMiddleware()(createStore);

export class Store {
    constructor() {
        this.store = createStoreWithMiddleware(this.reducer)
    }

    reducer(state = initialState, action) {
        switch(action.type) {
            case UPDATE_USER: {
                let new_state = Object.assign({}, state, {
                    user: action.payload
                })
                return new_state
            }
            case UPDATE_GUILDS: {
                let new_state = Object.assign({}, state, {
                    guilds: action.payload
                })
                return new_state
            }
            default: {
                return state
            }
        }
    }

    getStore() {
        return this.store
    }

    getState() {
        return this.getStore().getState()
    }

    updateUser(user) {
        this.store.dispatch({type: UPDATE_USER, payload: user})
    }

    getUser() {
        return this.store.getState().user
    }
}

const store = new Store()

export default store;