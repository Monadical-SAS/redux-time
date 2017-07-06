# Redux-Time Examples:

 - Full Demo Page: [**Live Demo**](https://monadical-sas.github.io/redux-time/examples/demo.html) | **Source:** [`examples/demo.js`](demo.js)
 
    A fully featured example page that demonstrates the usage of:

        - instant state transitions
        - javscript animations
        - CSS keyframe animations
        - time travel
        - animation composition

 - Interactive Ball Demo: [**Live Demo**](https://monadical-sas.github.io/redux-time/examples/ball.html) | **Source:** [`examples/ball.js`](ball.js)
 
    A basic demonstration of interactive animations, including:

        - left-click dispatches a bounce animation
        - right-click makes the ball follow the mouse around in real-time
        - time travel

 - Stress Test: [**Live Demo**](https://monadical-sas.github.io/redux-time/examples/stress-test.html) | **Source:** [`examples/stress-test.js`](stress-test.js)
 
    A frame with a button to incrementally add more elements while watching the frame-rate, demonstrates:

        - cpu use is low until many elements are added
        - library is easily capable of running 1000+ simulatneous animations
        - render speed is limited by React & the browser before redux-time
        - time travel doesn't affect render speed negatively
        - pausing time also pauses rendering (saves battery in background)
    
 - Warped-time: [**Live Demo**](https://monadical-sas.github.io/redux-time/warped-time/examples/demo.html) | **Source:** [`warped-time/examples/demo.js`](../warped-time/examples/demo.js)
 
    Simple demonstration of the warped-time library, independed of redux-time, demonstrates:

        - starting/stopping time
        - jumping to various speeds from -100x to +100x
        - difference in progression between actual time and warped time
        - framerate-calucation accounts for warped time properly 

---

![Ball Demo Screenshot](ball_screenshot.png)
