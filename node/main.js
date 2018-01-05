'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AnimationsHandler = exports.startAnimation = exports.animationsReducer = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _warpedTime = require('warped-time');

var _reducers = require('./reducers.js');

var _animations = require('./animations.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var shouldAnimate = function shouldAnimate(anim_queue, timestamp, speed) {
    return anim_queue.length && speed;

    // timestamp = timestamp === undefined ? this.time.getWarpedTime() : timestamp

    // // if going forward in time, and future animations exist
    // if (this.time.speed > 0) {
    //     return (currentAnimations(animations.queue, timestamp, animations.former_time).length
    //             || futureAnimations(animations.queue, timestamp).length)
    // }
    // else if (this.time.speed < 0) {
    //     return (currentAnimations(animations.queue, timestamp, animations.former_time).length
    //             || pastAnimations(animations.queue, timestamp).length)
    // }
    // return false
};

var AnimationsHandler = function () {
    function AnimationsHandler(_ref) {
        var store = _ref.store,
            initial_state = _ref.initial_state,
            _ref$autostart_animat = _ref.autostart_animating,
            autostart_animating = _ref$autostart_animat === undefined ? true : _ref$autostart_animat,
            _ref$requestFrame = _ref.requestFrame,
            requestFrame = _ref$requestFrame === undefined ? null : _ref$requestFrame;
        (0, _classCallCheck3.default)(this, AnimationsHandler);

        if (requestFrame === null) {
            if (global.DEBUG) console.log('Running animations in browser');
            this.requestFrame = function (func) {
                return window.requestAnimationFrame.call(window, func);
            };
        } else {
            if (global.DEBUG) console.log('Running animations with custom requestFrame');
            this.requestFrame = requestFrame;
        }

        var speed = store.getState().animations.speed;
        this.animating = !autostart_animating;
        this.store = store;
        this.time = new _warpedTime.WarpedTime({ speed: speed });
        store.subscribe(this.handleStateChange.bind(this));
        if (initial_state) {
            this.initState(initial_state);
        }
    }

    (0, _createClass3.default)(AnimationsHandler, [{
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
            if (true === animations.force) {
                this.time.setWarpedTime(animations.warped_time);
            }
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

            var _store$getState2 = this.store.getState(),
                animations = _store$getState2.animations;

            var new_timestamp = this.time.getWarpedTime();

            if (new_timestamp < this.time.genesis_time) {
                new_timestamp = this.time.genesis_time;
                animations.speed = 0;
            }

            if (shouldAnimate(animations.queue, new_timestamp, animations.speed)) {
                global.nextFrameId = this.requestFrame(this.tick.bind(this));
            } else {
                this.animating = false;
            }

            this.store.dispatch({
                type: 'TICK',
                // TODO: duplicating code from WarpedTime.getWarpedTime
                former_time: animations.warped_time || 0,
                warped_time: new_timestamp,
                speed: animations.speed
            });
        }
    }]);
    return AnimationsHandler;
}();

var startAnimation = function startAnimation(store, initial_state) {
    var autostart_animating = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var handler = new AnimationsHandler({
        store: store,
        initial_state: initial_state,
        autostart_animating: autostart_animating
    });
    return handler.time;
};

exports.animationsReducer = _reducers.animationsReducer;
exports.startAnimation = startAnimation;
exports.AnimationsHandler = AnimationsHandler;
