/*
    Usage:
        window.store = createStore(combineReducers({time, ...}))

        window.time = new WarpedTime(window.store)

        time.getWarpedTime() => 3241
        window.store.dispatch({type: 'SET_TIME_WARP', speed: -1})
        time.getWarpedTime() = 3100

*/

import {select} from './reducers.js'


export class WarpedTime {
    constructor(store=null, speed=1) {
        this._lastTime = (new Date).getTime()
        this._currTime = this._lastTime
        this.speed = speed
        if (store) {
            this.store = store
            this.store.subscribe(this.handleStateChange.bind(this))
        }
    }

    setSpeed(speed) {
        this.speed = speed
    }

    getWarpedTime(timestamp) {
        const actualTime = timestamp === undefined ? this.getActualTime() : timestamp
        this._currTime += (actualTime - this._lastTime) * this.speed
        this._lastTime = actualTime
        return this._currTime
    }

    getActualTime() {
        return (new Date).getTime()
    }

    handleStateChange() {
        this.setSpeed(select(this.store.getState()).speed)
    }
}
