# Redux-Time: Javascript animations made easy.

▶️ [Intro](#intro) | [Walkthrough](#walkthrough-example) | [Info & Motivation](#info--motivation) | [Links](#links) | [Documentation](#documentation) | [Examples](https://monadical-sas.github.io/redux-time/examples/)

**[LIVE DEMOS](https://monadical-sas.github.io/redux-time/examples/)**

Redux-Time is a library that allows you to compute your state tree as a function of time.  It's primarily used for animations, but it can also be used for generically changing any redux state as time progresses.

Generally, there are two different categories of animations on websites:

 - content transitions (e.g. effects when adding/deleting a list item, hover effects, photo gallery transitions, etc)
 - **full-blown interactive dynamic animations** (like in games)

Redux-time is designed for the second case.  If you want simple CSS content transitions and aren't building complex videogame-style animations, check out [react-transition-group](https://facebook.github.io/react/docs/animation.html) instead.

```bash
yarn add redux-time
```
Check it out in action on the [demo](https://monadical-sas.github.io/redux-time/examples/demo.html) page, or follow the [walkthrough example](#walkthrough-example) below.  At [Monadical](https://monadical.com) we use `redux-time` for animating ethereum-backed browser-based poker ([come help us build it](https://monadical.com/apply)!).

<img src="examples/ball_screenshot.png" width="600px" alt="Ball Demo Screenshot"/>

## Key Features

- all state is a function of the current point in time
- time-travel debugging (e.g. slow down, reverse, jump to point in time)
- compose animations with pure functions e.g.: `Repeat(Rotate(...), 10)`
- define animations with a Javscript `tick` function or with CSS keyframes
- seamlessly animate existing React + Redux codebase without major changes
- animate any state tree value manually, or use provided Animation functions for common animations e.g.: `Translate`, `Rotate`, `Opacity`
- works in all browsers with `requestAnimationFrame` and in node with `setTimemout`

## Intro

Redux-time makes complex, interactive, composable animations possible by using the redux single-source-of-truth state tree model, and extending it with the idea of time.

Redux is already capable of time-travel currently, however you cant slow down the speed of time, reverse time, or jump to a specific point in time since redux only knows about the list of actions and has no first-class conept of time.  This library makes time a first-class concept, and gives you careful control over its progression.

What that means specifically, is that every time a `TICK` action is dispatched with a `current_timestamp` parameter, the `animations` reducer looks through the active animations in `animations.queue`, calls their respective `tick` functions with a `delta` parameter, and uses their output to render a state tree at that point in time.

The `AnimationHandler` dispatches a `TICK` action on every `requestAnimationFrame`, and as long as all your active tick functions complete in <20ms, the page can render thousands of simultaneous animations smoothly.  When used with `node` outside of a browser it uses `setTimout`, though you can easily turn off time progression and call `TICK` manually instead.

Every tick function is a pure function of the `start_state`, `end_state`, and delta from `start_time`.  This makes animations really easy to reason about compared to traditional solutions.  Debugging is also drastically simpler, since you can slow down and even **reverse** the flow of time to carefully inspect animtion progress!

## Walkthrough Example

1. First we create a redux store, and an `AnimationHandler` with our initial state
```javascript
import {createStore, combineReducers} from 'redux'
import {animations, startAnimations} from 'redux-time'

const initial_state = {
    ball: {
        style: {top: 0, left: 0},
    },
}
const store = createStore(combineReducers({animations}))
startAnimations(store, initial_state)
```

2. Then we create a redux component that uses this state to render
```javascript
const BallComponent = ({ball}) =>
    <div className="ball", style={ball.style}></div>

const mapStateToProps = ({animations}) => ({
    ball: animations.state.ball,
})

const Ball = connect(mapStateToProps)(BallComponent)
```

3. Then we dispatch an `ADD_ANIMATION` action to queue up an animation to move the ball
```javascript
import {Translate} from 'redux-time/animations'

store.dispatch({type: 'ADD_ANIMATION', animation: Translate({
    path: '/ball',
    start_state: {top: 0, left: 0},
    end_state: {top: 100, left: 0},
    start_time: (new Date).getTime(),
    duration: 1000,
    curve: 'easeOutQuad',
})})
```

4. The `AnimationHandler` will dispatch a `TICK` action on every `requestAnimationFrame`.  Then the `animations` reducer gets the `TICK` and looks in the queue to see which animations are active.  It then uses each `animtion.tick` function to calculates the new state that needs to be produced.
```javascript
// happens on every requestAnimationFrame
store.dispatch({type: 'TICK', current_timestamp: 1499000000})

// animatons reducer uses the Translate animation.tick(delta) to calculate its animated state, e.g.:

ball: {
    style: {top: 55, left: 0},
},
```

4. Redux re-renders the component automatcially whenever the state changes, so the new state is immediately rendered, and the position of the ball updates on the screen!  This process repeats, and the ball state changes on every `TICK` until the animtion finishes.

See the demo of this code in action here: [ball.html](https://monadical-sas.github.io/redux-time/examples/ball.html), and the full code for the example in [`examples/ball.js`](https://github.com/Monadical-SaS/redux-time/blob/master/examples/ball.js)

## Info & Motivation

After spending almost a year contemplating how to do React animations cleanly at [Monadical](https://monadical.com) (we're [hiring](https://monadical.com/apply)!), we realized that all state can be represented as composed functions that depend only on a delta from their start time.

On the way we tried almost every other solution out there, from using simple jQuery animations, to react-transition-group, to janky approaches in-between using `setTimout`.  Since all those are designed with content transitions in mind, nothing really "clicked" and felt like a clean way to do interactive game animations.

Finally, we settled on the state tree as a function of time approach, and our life has been much better every since!  We feel this is the best way currently available to do fast, videogame-style animations in a declarative React-friendly manner.

## Contributing

We'd love see PR's or issues opened if you have questions or suggestions!

If possible, when submitting an issue report, try to copy one of the `examples/` files and modify it to illustrate your reproduceable error.

## Links

- [React Docs on Animation](https://facebook.github.io/react/docs/animation.html)
- [React-Transition-Group](https://github.com/reactjs/react-transition-group/tree/v1-stable) library to add component lifecycle CSS transitions
- React-Transition-Group walkthrough article:  [UI Animations with React — The Right Way](https://medium.com/@joethedave/achieving-ui-animations-with-react-the-right-way-562fa8a91935)
- [GSAP](https://greensock.com/gsap): incredibly robust, stable, well-supported Javascript animations library
- [react-animations](https://github.com/FormidableLabs/react-animations) CSS animations usable with inline-style libraries like StyledComponents
- [react-animate](https://www.npmjs.com/package/react-animate) library for defining component transitions by extending the React.Component class
- React.rocks: [animation examples](https://react.rocks/tag/Animation)
- [Animate.css](https://github.com/daneden/animate.css/blob/master/animate.css): repository of great css animations (usable with redux-time)

# Documentation

Documentation is a work-in-progress, for now refer to the `examples/` to see how the library works.  The code is short, and easy to read!

## Basics

### Installation

### Getting Started

### Rendering Animated State

### Queueing Animations

## Advanced

### Time-Travel

### Writing Javscript Animations

**Composing Existing Animations**

**Custom JS Tick Functions**

### Writing CSS Animations

**JS Tick + CSS Transform**

**JS Tick + CSS Animation**

### Optimization

**React Optimization**

**Redux Optimization**

**Redux-Time Optimization**

## Troubleshooting

---
<img src="examples/static/jeremy.jpg" height="40px" style="float:right"/>

MIT License | [Monadical](https://monadical.com) SAS 2017 ([we're hiring!](https://monadical.com/apply))


