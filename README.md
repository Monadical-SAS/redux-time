# Redux-Time

Redux-Time is a library that allows you to represent your redux state tree as a function of time.  It's primarily used for animations, but it can also be used generically for chaging any redux state as time progresses.

```bash
yarn add redux-time
```

---

## Features

- all state is a function of the current point in time
- time-travel debugging (e.g. slow down, reverse, jump to point in time)
- compose animations with pure functions e.g.: `Repeat(Rotate(...), 10)`
- define animations with a Javscript `tick` function or with CSS keyframes
- seamlessly animate existing React + Redux codebase without major changes
- animate any state tree value manually, or use provided Animation functions for common animations e.g.: `Translate`, `Rotate`, `Opacity`
- works in all browsers with `requestAnimationFrame` and in node with `setTimemout`

## Intro

Generally, there are two different categories of animations on websites:

 - content transitions (e.g. effects when adding/deleting a list item, hover effects, photo gallery transitions, etc)
 - **full-blown interactive dynamic animations** (like in games)

Redux-time is designed for the second case.  If you want simple CSS content transitions and aren't building complex videogame-style animations, check out [css-transition-group](http://react-component.github.io/animate/) instead. 

Redux-time makes complex, interactive, composable animations possible by using the redux single-source-of-truth state tree model, and extending it with the idea of time.

Redux is already capable of time-travel currently, however you cant slow down the speed of time, reverse time, or jump to a specific point in time since redux only knows about the list of actions and has no first-class conept of time.  This library makes time a first-class concept, and allows you careful control over its progression.

What that means specifically, is that every time a `TICK` action is dispatched with a `current_timestamp` parameter, the `animations` reducer looks through the active animations in `animations.queue`, calls their respective `tick` functions with a `delta` parameter, and uses their output to render a state tree at that point in time.

The `AnimationHandler` dispatches a `TICK` action on every `requestAnimationFrame`, and as long as all your active tick functions complete in <20ms, the page can render thousands of simultaneous animations smoothly.  When used with `node` outside of a browser it uses `setTimout`, though you can easily turn off time progression and call `TICK` manually instead.

Every tick function is a pure function of the `start_state`, `end_state`, and delta from `start_time`.  This makes animations really easy to reason about compared to traditional solutions.  Debugging is also drastically simpler, since you can slow down and even **reverse** the flow of time to carefully inspect animtion progress!

## Walkthrough Example

![Ball Demo Screenshot](examples/ball_screenshot.png)

1. First we create a redux store, and an `AnimationHandler` with our initial state
```javascript
const initial_state = {ball: {style: {top: 0, left: 0}}}
const store = createStore(combineReducers({animations}))
const animationHandler = new AnimationHandler(store, initial_state)
```

2. Then we create a redux component with uses this state to render
```javascript
const BallComponent = ({style}) =>
    <div className="ball", style={style}></div>

const mapStateToProps = ({animations}) => ({
    style: animations.state.ball.style
})

const Ball = connect(mapStateToProps)(BallComponent)
```

3. Then we dispatch an `ADD_ANIMATION` action to queue up an animation to move the ball
```javascript
store.dispatch({type: 'ADD_ANIMATION', animation: Translate({
    path: '/ball',
    start_state: {top: 0, left: 0},
    end_state: {top: 100, left: 0},
    start_time: (new Date).getTime(),
    duration: 1000,
    curve: 'easeOutQuad',
})})
```

4. requestAnimation will dispatch a `TICK` action, then the `animations` reducer gets the TICK and looks in the queue and calculates the state that needs to be produced for all active animations
```javascript
store.dispatch({type: 'TICK', current_timestamp: 1499000000})
// animatons reducer uses the Translate animation.tick(delta) to calculate its animated state:
{
    ball: {style: {top: 55, left: 0}}
}
```

4. Redux re-renders the component automatcially whenever the state changes, so the new state is immediately rendered, and the position of the ball updates on the screen!  This process repeats, and the ball state changes on every `TICK` until the animtion finishes.

See the demo of this code in action here: [ball.html](https://monadical-sas.github.io/redux-time/examples/ball.html), and the full code for the example in [`examples/ball.js`](`https://github.com/Monadical-SaS/redux-time/blob/master/examples/ball.js`)
