(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// import React from 'react'
// import ReactDOM from 'react-dom'

// import {createStore, combineReducers} from 'redux'
// import {Provider} from 'react-redux'

// import {
//     animationsReducer,
//     startAnimation,
//     AnimationControls,
//     AnimationTimeline,
//     AnimationStateVisualizer
// } from '../node/main.js'

// import {AnimationTester} from './test-component.js'


// window.initial_state = {
//     test_state: {
//         text: 'Animate Me!',
//         style: {color: 'black'},
//     },
// }

// window.store = createStore(combineReducers({animations: animationsReducer}))
// window.time = startAnimation(window.store, window.initial_state)

// ReactDOM.render(
//     <Provider store={window.store}>
//         <div>
//             <AnimationTester getTime={window.time.getWarpedTime.bind(window.time)} debug/>
//             <AnimationTimeline debug={true} expanded={true}/>
//             <AnimationControls debug/>
//             <AnimationStateVisualizer path="test_state" debug/>
//         </div>
//     </Provider>,
//     document.getElementById('react'),
// )
"use strict";

},{}]},{},[1]);
