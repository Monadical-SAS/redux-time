'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.animations = exports.initial_state = exports.computeAnimatedState = exports.activeAnimations = exports.uniqueAnimations = exports.sortedAnimations = exports.futureAnimations = exports.currentAnimations = exports.pastAnimations = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _util = require('./util.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pastAnimations = exports.pastAnimations = function pastAnimations(anim_queue, timestamp) {
    return anim_queue.filter(function (_ref) {
        var start_time = _ref.start_time,
            duration = _ref.duration;
        return start_time + duration < timestamp;
    });
};

var currentAnimations = exports.currentAnimations = function currentAnimations(anim_queue, from_timestamp, to_timestamp) {
    return (
        // find all animations which began before current_time, and end after the last_timestamp (crucial to render final frame of animations)
        anim_queue.filter(function (_ref2) {
            var start_time = _ref2.start_time,
                duration = _ref2.duration;
            return start_time <= from_timestamp && start_time + duration >= to_timestamp;
        })
    );
};

var futureAnimations = exports.futureAnimations = function futureAnimations(anim_queue, timestamp) {
    return anim_queue.filter(function (_ref3) {
        var start_time = _ref3.start_time,
            duration = _ref3.duration;
        return start_time > timestamp;
    });
};

var sortedAnimations = exports.sortedAnimations = function sortedAnimations(anim_queue) {
    return [].concat((0, _toConsumableArray3.default)(anim_queue)).sort(function (a, b) {
        // sort by end time, if both are the same, sort by start time, properly handle infinity
        if (a.end_time == b.end_time) {
            return a.start_time - b.start_time;
        } else {
            if (a.end_time == Infinity) {
                return -1;
            } else if (b.end_time == Infinity) {
                return 1;
            } else {
                return a.end_time - b.end_time;
            }
        }
    });
};

// 0 /a /b /c       3
// 1 /a /b          2
// 2 /a /b /e /d    4

var parentExists = function parentExists(paths, path) {
    var parent = '';
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)(path.split('/').slice(1)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;
            // O(path.length)
            parent = parent + '/' + key;
            if (paths.has(parent)) {
                return true;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return false;
};

var uniqueAnimations = exports.uniqueAnimations = function uniqueAnimations(anim_queue) {
    var paths = new _set2.default();
    var uniq_anims = [];

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = (0, _getIterator3.default)((0, _util.reversed)(anim_queue)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var anim = _step2.value;
            // O(anim_que.length)
            if (!parentExists(paths, anim.path)) {
                uniq_anims.push(anim);
                paths.add(anim.path);
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return uniq_anims.reverse();
};

var activeAnimations = exports.activeAnimations = function activeAnimations(anim_queue, current_timestamp, last_timestamp) {
    var uniqueify = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    if (current_timestamp === undefined || last_timestamp === undefined) {
        throw 'Both current_timestamp and last_timestamp must be passed to get activeAnimations';
    }
    var anims = void 0;
    if (last_timestamp < current_timestamp) {
        // when playing forwards, find all animations which began before current_time, and end after the time of the last frame
        anims = sortedAnimations(currentAnimations(anim_queue, current_timestamp, last_timestamp));
    } else if (last_timestamp >= current_timestamp) {
        // when playing in reverse, flip the two times to keep start/end time calculation math the same
        anims = sortedAnimations(currentAnimations(anim_queue, last_timestamp, current_timestamp));
    }

    if (uniqueify) anims = uniqueAnimations(anims);

    return anims;
};

var computeAnimatedState = exports.computeAnimatedState = function computeAnimatedState(anim_queue, current_timestamp) {
    var last_timestamp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    last_timestamp = last_timestamp === null ? current_timestamp : last_timestamp;

    var active_animations = activeAnimations(anim_queue, current_timestamp, last_timestamp, false);
    var patches = [];

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = (0, _getIterator3.default)(active_animations), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var animation = _step3.value;

            try {
                var delta = current_timestamp - animation.start_time;
                var patch = animation.tick(delta);
                patches.push({
                    split_path: animation.split_path,
                    value: patch
                });
            } catch (e) {
                console.log(animation.type, 'Animation tick function threw an exception:', e.message, animation);
            }
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    return (0, _util.applyPatches)({}, patches);
};

// limit anim_queue to max_time_travel length
var trimmedAnimationQueue = function trimmedAnimationQueue(anim_queue, max_time_travel) {
    if (anim_queue.length > max_time_travel) {
        // console.log(
        //     '%c[i] Trimmed old animations from animations.queue', 'color:orange',
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
    last_timestamp: 0,
    current_timestamp: 0,
    max_time_travel: 3000, // maximum length of the queue before items get trimmed
    queue: [],
    state: {}
};

var animations = exports.animations = function animations() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initial_state;
    var action = arguments[1];

    switch (action.type) {
        case 'CLEAR_ANIMATIONS':
            var only_initial_state = state.queue.filter(function (anim) {
                return anim.start_time === 0;
            });
            return (0, _extends3.default)({}, initial_state, {
                current_timestamp: state.current_timestamp,
                last_timestamp: state.last_timestamp,
                queue: only_initial_state,
                state: computeAnimatedState(only_initial_state, state.current_timestamp, state.last_timestamp)
            });

        case 'ANIMATE':
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
            // add any missing fields
            var new_animation_objs = anim_objs.map(function (anim) {
                return (0, _extends3.default)({}, anim, {
                    split_path: anim.path.split('/').slice(1), // .split is expensive to do later, saves CPU on each TICK
                    start_time: anim.start_time === undefined ? // set to now if start_time is not provided
                    new Date().getTime() : anim.start_time
                });
            });
            return (0, _extends3.default)({}, state, {
                queue: [].concat((0, _toConsumableArray3.default)(trimmed_queue), (0, _toConsumableArray3.default)(new_animation_objs))
            });

        case 'SET_ANIMATION_SPEED':
            return (0, _extends3.default)({}, state, {
                speed: action.speed,
                last_timestamp: state.current_timestamp
            });

        case 'TICK':
            if (action.current_timestamp === undefined || action.last_timestamp === undefined) {
                throw 'TICK action must have a current_timestamp and last_timestamp';
            }
            var animated_state = computeAnimatedState(state.queue, action.current_timestamp, action.last_timestamp);

            return (0, _extends3.default)({}, state, {
                state: animated_state,
                speed: action.speed || state.speed,
                current_timestamp: action.current_timestamp,
                last_timestamp: action.last_timestamp
            });

        default:
            return state;
    }
};
