# Redux-Time Examples:

 - Full: [live demo](https://monadical-sas.github.io/redux-time/examples/demo.html) [`examples/demo.js`](demo.js)
    A fully featured example page that demonstrates the usage of:
        - instant state transitions
        - javscript animations
        - CSS keyframe animations
        - time travel
        - animation composition

 - Ball: [live demo](https://monadical-sas.github.io/redux-time/examples/ball.html) [`examples/ball.js`](ball.js)
    A basic demonstration of interactive animations, including:
        - left-click dispatching a bounce animation
        - right-click making the ball follow the mouse around in real-time
        - time travel

 - Stress Test: [live demo](https://monadical-sas.github.io/redux-time/examples/stress-test.html) [`examples/stress-test.js`](stress-test.js)
    A frame with a button to incrementally add more elements while watching the frame-rate, demonstrates:
        - library is easily capable of running 1000+ simulatneous animations
        - render speed is limited by React & the browser before redux-time
        - time travel doesn't affect render speed negatively
        - pausing time also pauses rendering (saves battery in background)
    
 - Warped-time: [live demo](https://monadical-sas.github.io/redux-time/warped-time/examples/demo.html) [`warped-time/examples/demo.js`](../warped-time/examples/demo.js)
    Simple demonstration of the warped-time library, independed of redux-time, demonstrates:
        - starting/stopping time
        - jumping to various speeds from -100x to +100x
        - difference in progression between actual time and warped time
        - framerate-calucation accounts for warped time properly 
