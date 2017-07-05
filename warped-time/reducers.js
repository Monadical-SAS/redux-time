
export const select = (state) => state.time

const initial_state = {
    speed: 1,
}

export const time = (state=initial_state, action) => {
    switch (action.type) {
        case 'SET_TIME_WARP':
            return {...state, speed: action.speed}
        default:
            return state
    }
}
