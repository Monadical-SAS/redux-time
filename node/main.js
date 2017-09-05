'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AnimationStateVisualizerComponent = exports.AnimationStateVisualizer = exports.AnimationControls = exports.AnimationHandler = exports.startAnimation = exports.animations = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _warpedTime = require('warped-time');

var _reducers = require('./reducers.js');

var _animations = require('./animations.js');

var _controls = require('./controls.js');

var _stateVisualizer = require('./state-visualizer.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var shouldAnimate = function shouldAnimate(anim_queue, timestamp, speed) {
    return anim_queue.length && speed;

    // timestamp = timestamp === undefined ? this.time.getWarpedTime() : timestamp

    // // if going forward in time, and future animations exist
    // if (this.time.speed > 0) {
    //     return (currentAnimations(animations.queue, timestamp, animations.last_timestamp).length
    //             || futureAnimations(animations.queue, timestamp).length)
    // }
    // else if (this.time.speed < 0) {
    //     return (currentAnimations(animations.queue, timestamp, animations.last_timestamp).length
    //             || pastAnimations(animations.queue, timestamp).length)
    // }
    // return false
};

var AnimationHandler = function () {
    function AnimationHandler(store, initial_state) {
        var autostart_animating = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        (0, _classCallCheck3.default)(this, AnimationHandler);

        if (global.requestAnimationFrame) {
            if (global.DEBUG) console.log('Running animations in a Browser.', { autostart_animating: autostart_animating });

            this.rAF = function (func) {
                return window.requestAnimationFrame.call(window, func);
            };
        } else {
            if (global.DEBUG) console.log('Running animations in Node.js.', { autostart_animating: autostart_animating });

            this.rAf = function (func) {
                return setTimeout(function () {
                    return func();
                }, 20);
            };
        }
        var speed = store.getState().animations.speed;
        this.animating = !autostart_animating;
        this.store = store;
        this.time = new _warpedTime.WarpedTime(null, speed);
        store.subscribe(this.handleStateChange.bind(this));
        if (initial_state) {
            this.initState(initial_state);
        }
    }

    (0, _createClass3.default)(AnimationHandler, [{
        key: 'initState',
        value: function initState(initial_state) {
            var animations = (0, _keys2.default)(initial_state).map(function (key) {
                return (0, _animations.Become)({
                    path: '/' + key,
                    state: initial_state[key],
                    start_time: 0
                });
            });
            this.store.dispatch({ type: 'ANIMATE', animations: animations });
        }
    }, {
        key: 'handleStateChange',
        value: function handleStateChange() {
            // console.log('RUNNING ANIMATION DISPATCHER')
            var _store$getState = this.store.getState(),
                animations = _store$getState.animations;

            this.time.setSpeed(animations.speed);
            var timestamp = this.time.getWarpedTime();
            if (!this.animating && shouldAnimate(animations.queue, timestamp, this.time.speed)) {
                if (global.DEBUG) {
                    console.log('[i] Starting Animation. Current time:', timestamp, ' Active Animations:', animations.queue);
                }
                this.tick();
            }
        }
    }, {
        key: 'tick',
        value: function tick(high_res_timestamp) {
            this.animating = true;
            // if (shouldAnimate(animations.queue, new_timestamp, this.time.speed)) {
            this.rAF(this.tick.bind(this));
            // } else {
            // this.animating = false
            // }

            if (high_res_timestamp) {
                this.start_time = this.start_time || this.time.getActualTime();
                high_res_timestamp = this.start_time + high_res_timestamp / 1000;
            }

            var _store$getState2 = this.store.getState(),
                animations = _store$getState2.animations;

            var new_timestamp = this.time.getWarpedTime();

            this.store.dispatch({
                type: 'TICK',
                last_timestamp: animations.current_timestamp || 0,
                current_timestamp: new_timestamp,
                speed: animations.speed
            });
        }
    }]);
    return AnimationHandler;
}();

var startAnimation = function startAnimation(store, initial_state) {
    var autostart_animating = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var handler = new AnimationHandler(store, initial_state, autostart_animating);
    return handler.time;
};

exports.animations = _reducers.animations;
exports.startAnimation = startAnimation;
exports.AnimationHandler = AnimationHandler;
exports.AnimationControls = _controls.AnimationControls;
exports.AnimationStateVisualizer = _stateVisualizer.AnimationStateVisualizer;
exports.AnimationStateVisualizerComponent = _stateVisualizer.AnimationStateVisualizerComponent;
