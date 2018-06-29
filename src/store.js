import {applyMiddleware, createStore} from 'redux'

const UPDATE_USER = "UPDATE_USER"
const UPDATE_PROFILE_ID = "UPDATE_PROFILE_ID"
const UPDATE_GUILDS = "UPDATE_GUILDS"
const CLEAR = "CLEAR"

const initialState = {
    user: null,
    guilds: null,
    profileId: null,
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
            case UPDATE_PROFILE_ID: {
                let new_state = Object.assign({}, state, {
                    profileId: action.payload
                })
                return new_state
            }
            case UPDATE_GUILDS: {
                let new_state = Object.assign({}, state, {
                    guilds: action.payload
                })
                return new_state
            }
            case CLEAR: {
                return initialState
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

    updateProfileId(id) {
        this.store.dispatch({type: UPDATE_PROFILE_ID, payload: id})
    }

    getProfileId() {
        return this.store.getState().profileId
    }

    clear() {
        this.store.dispatch({type: CLEAR, payload: null})
    }
}

const store = new Store()

export default store;