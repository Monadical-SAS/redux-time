'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.animationsReducer = exports.initial_state = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _util = require('./util.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// limit anim_queue to max_time_travel length
var trimmedAnimationQueue = function trimmedAnimationQueue(anim_queue, max_time_travel) {
    if (anim_queue.length > max_time_travel) {
        // console.log(
        //     '%c[i] Trimmed old animations from animations.queue',
        //     'color:orange',
        //     `(queue was longer than ${max_time_travel} items)`
        // )
        var keep_from = anim_queue.length - max_time_travel;
        var keep_to = -1;

        var new_queue = anim_queue.slice(keep_from, keep_to);

        // always keep first BECOME animation
        if ((keep_from != 0 || new_queue.length == 0) && anim_queue.length) {
            new_queue = [anim_queue[0]].concat((0, _toConsumableArray3.default)(new_queue));
        }

        return new_queue;
    }
    return anim_queue;
};

var initial_state = exports.initial_state = {
    speed: 1,
    former_time: 0,
    warped_time: 0,
    // maximum length of the queue before items get trimmed
    max_time_travel: 3000,
    queue: [],
    state: {}
};

var animationsReducer = exports.animationsReducer = function animationsReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initial_state;
    var action = arguments[1];

    switch (action.type) {
        case 'CLEAR_ANIMATIONS':
            var only_initial_state = state.queue.filter(function (anim) {
                return anim.start_time === 0;
            });
            return (0, _extends3.default)({}, initial_state, {
                warped_time: state.warped_time,
                former_time: state.former_time,
                queue: only_initial_state,
                state: (0, _util.computeAnimatedState)({
                    animations: only_initial_state,
                    warped_time: state.warped_time,
                    former_time: state.former_time
                })
            });

        case 'ANIMATE':
            // Adds animations to the queue
            var anim_objs = void 0;
            // validate new animations are correctly typed
            if (action.animation && !action.animations) {
                // if single animation
                (0, _util.checkIsValidAnimation)(action.animation);
                anim_objs = [action.animation];
            } else if (action.animations && !action.animation) {
                // if animation sequence
                (0, _util.checkIsValidSequence)(action.animations);
                anim_objs = action.animations;
            } else {
                console.log('%cINVALID ANIMATE ACTION:', action);
                throw 'ANIMATE action must be passed either an animation sequence: [{}, {}, ...] or a single animation: {}';
            }
            // trim queue to max_time_travel length
            var trimmed_queue = trimmedAnimationQueue(state.queue, state.max_time_travel);
            return (0, _extends3.default)({}, state, {
                queue: [].concat((0, _toConsumableArray3.default)(trimmed_queue), (0, _toConsumableArray3.default)(anim_objs))
            });

        case 'SET_SPEED':
            return (0, _extends3.default)({}, state, {
                speed: action.speed,
                former_time: state.warped_time
            });

        case 'TICK':
            if (action.warped_time === undefined || action.former_time === undefined) {
                throw 'TICK action must have a warped_time and former_time';
            }
            var animated_state = (0, _util.computeAnimatedState)({
                animations: state.queue,
                warped_time: action.warped_time,
                former_time: action.former_time
            });

            return (0, _extends3.default)({}, state, {
                state: animated_state,
                speed: action.speed || state.speed,
                warped_time: action.warped_time,
                former_time: action.former_time
            });

        default:
            return state;
    }
};
