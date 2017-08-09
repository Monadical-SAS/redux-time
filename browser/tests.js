(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RepeatSequence = exports.Sequential = exports.Reverse = exports.Repeat = exports.Rotate = exports.Opacity = exports.TranslateTo = exports.Translate = exports.AnimateCSS = exports.Animate = exports.Become = undefined;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _util = require('./util.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var unit_tick = function unit_tick(_ref, key) {
    var start_time = _ref.start_time,
        end_time = _ref.end_time,
        duration = _ref.duration,
        start_state = _ref.start_state,
        end_state = _ref.end_state,
        amt = _ref.amt,
        _ref$curve = _ref.curve,
        curve = _ref$curve === undefined ? 'linear' : _ref$curve,
        _ref$unit = _ref.unit,
        unit = _ref$unit === undefined ? null : _ref$unit;

    var _checked_animation_am = checked_animation_amt({ start_state: start_state, end_state: end_state, amt: amt, key: key }),
        start_state = _checked_animation_am.start_state,
        amt = _checked_animation_am.amt,
        end_state = _checked_animation_am.end_state;

    var _checked_animation_du = checked_animation_duration({ start_time: start_time, end_time: end_time, duration: duration }),
        start_time = _checked_animation_du.start_time,
        end_time = _checked_animation_du.end_time,
        duration = _checked_animation_du.duration;

    var curve_func = _util.EasingFunctions[curve];

    return function (delta) {
        var new_state = void 0;
        // These over-boundary cases happen because we need to render
        // an extra frame before/after start/end times to finish off
        // animations who's (durations) % (frame rate) != 0.
        if (delta < 0) {
            new_state = start_state;
        } else if (delta >= duration) {
            new_state = end_state;
        } else {
            // tick progression function, the core math at the heart of animation
            new_state = start_state + curve_func(delta / duration) * amt;
        }
        return unit ? '' + new_state + unit : new_state;
    };
};

var checked_animation_duration = function checked_animation_duration(_ref2) {
    var start_time = _ref2.start_time,
        duration = _ref2.duration,
        end_time = _ref2.end_time;

    if ([start_time, end_time, duration].filter(function (a) {
        return typeof a == 'number';
    }).length < 2) {
        console.log({ start_time: start_time, end_time: end_time, duration: duration });
        throw 'Need at least 2/3 to calculate animation: start_time, end_time, duration';
    }

    if (start_time === undefined) start_time = end_time - duration;
    if (end_time === undefined) end_time = start_time + duration;
    if (duration === undefined) duration = end_time - start_time;

    if (start_time + duration != end_time) {
        console.log({ start_time: start_time, end_time: end_time, duration: duration });
        throw 'Conflicting values, Animation end_time != start_time + duration';
    }
    return { start_time: start_time, duration: duration, end_time: end_time };
};

var checked_animation_amt = function checked_animation_amt(_ref3) {
    var key = _ref3.key,
        start_state = _ref3.start_state,
        end_state = _ref3.end_state,
        amt = _ref3.amt;

    if (typeof start_state === 'number') {
        if ([start_state, end_state, amt].filter(function (a) {
            return typeof a == 'number';
        }).length < 2) {
            console.log({ start_state: start_state, end_state: end_state, amt: amt });
            throw 'Need at least 2/3 to calculate animation: start_state, end_state, amt';
        }

        if (start_state === undefined) start_state = end_state - amt;
        if (end_state === undefined) end_state = start_state + amt;
        if (amt === undefined) amt = end_state - start_state;

        if (start_state + amt != end_state) {
            console.log({ start_state: start_state, end_state: end_state, amt: amt });
            throw 'Conflicting values, Animation end_state != start + amt';
        }

        return { start_state: start_state, end_state: end_state, amt: amt };
    } else {
        if (start_state === undefined) start_state = {};
        if (end_state === undefined) end_state = {};
        if (amt === undefined) amt = {};

        if (key !== undefined) return checked_animation_amt({ start_state: start_state[key], end_state: end_state[key], amt: amt[key] });

        if ((typeof start_state === 'undefined' ? 'undefined' : (0, _typeof3.default)(start_state)) !== 'object' || (typeof end_state === 'undefined' ? 'undefined' : (0, _typeof3.default)(end_state)) !== 'object' || (typeof amt === 'undefined' ? 'undefined' : (0, _typeof3.default)(amt)) !== 'object') {
            throw 'Incompatible types passed as {start_state, end_state, amt}, must all be objects or numbers';
        }

        var keys = (0, _keys2.default)(start_state);
        if (!keys.length) keys = (0, _keys2.default)(end_state);
        if (!keys.length) keys = (0, _keys2.default)(amt);

        return keys.reduce(function (acc, key) {
            var amts = checked_animation_amt({ start_state: start_state[key], end_state: end_state[key], amt: amt[key] });
            acc.start_state[key] = amts.start_state;
            acc.end_state[key] = amts.end_state;
            acc.amt[key] = amts.amt;
            return acc;
        }, { start_state: {}, end_state: {}, amt: {} });
    }
};

var KeyedAnimation = function KeyedAnimation(_ref4) {
    var type = _ref4.type,
        path = _ref4.path,
        key = _ref4.key,
        start_time = _ref4.start_time,
        end_time = _ref4.end_time,
        duration = _ref4.duration,
        start_state = _ref4.start_state,
        end_state = _ref4.end_state,
        amt = _ref4.amt,
        curve = _ref4.curve,
        unit = _ref4.unit;
    return Animate({
        type: type,
        path: path + '/' + key,
        key: key,
        start_time: start_time,
        end_time: end_time,
        duration: duration,
        start_state: start_state && start_state[key],
        end_state: end_state && end_state[key],
        amt: amt && amt[key],
        curve: curve, unit: unit
    });
};

var Become = exports.Become = function Become(_ref5) {
    var path = _ref5.path,
        state = _ref5.state,
        start_time = _ref5.start_time,
        _ref5$end_time = _ref5.end_time,
        end_time = _ref5$end_time === undefined ? Infinity : _ref5$end_time,
        _ref5$duration = _ref5.duration,
        duration = _ref5$duration === undefined ? Infinity : _ref5$duration;

    if (start_time === undefined) start_time = new Date().getTime();

    var _checked_animation_du2 = checked_animation_duration({ start_time: start_time, end_time: end_time, duration: duration }),
        start_time = _checked_animation_du2.start_time,
        end_time = _checked_animation_du2.end_time,
        duration = _checked_animation_du2.duration;

    if (start_time === undefined || path === undefined) {
        console.log({ path: path, state: state, start_time: start_time, end_time: end_time, duration: duration });
        throw 'Become animation must have a start_time and path defined.';
    }
    return {
        type: 'BECOME',
        path: path,
        state: state,
        start_time: start_time,
        end_time: end_time,
        duration: duration,
        tick: function tick(delta) {
            return state;
        }
    };
};

var Animate = exports.Animate = function Animate(_ref6) {
    var type = _ref6.type,
        path = _ref6.path,
        start_time = _ref6.start_time,
        end_time = _ref6.end_time,
        duration = _ref6.duration,
        start_state = _ref6.start_state,
        end_state = _ref6.end_state,
        amt = _ref6.amt,
        _ref6$curve = _ref6.curve,
        curve = _ref6$curve === undefined ? 'linear' : _ref6$curve,
        _ref6$unit = _ref6.unit,
        unit = _ref6$unit === undefined ? null : _ref6$unit,
        _ref6$tick = _ref6.tick,
        tick = _ref6$tick === undefined ? null : _ref6$tick;

    if (start_time === undefined) start_time = new Date().getTime();

    var animation = {
        type: type ? type : 'ANIMATE',
        path: path,
        start_time: start_time, end_time: end_time, duration: duration,
        start_state: start_state, end_state: end_state, amt: amt,
        curve: curve,
        unit: unit,
        tick: tick
    };

    if (path === undefined) {
        console.log(animation);
        throw 'Animate animation must have a path defined.';
    }

    try {
        if (typeof start_state === 'number' || typeof end_state === 'number' || typeof amt === 'number') {
            animation = (0, _extends3.default)({}, animation, checked_animation_amt({ start_state: start_state, end_state: end_state, amt: amt }));
        }
        if (typeof start_time === 'number' || typeof end_time === 'number' || typeof duration === 'number') {
            animation = (0, _extends3.default)({}, animation, checked_animation_duration({ start_time: start_time, end_time: end_time, duration: duration }));
        }
        if (!animation.tick) {
            animation.tick = unit_tick(animation);
        }
    } catch (e) {
        console.log('INVALID ANIMATION:', animation);
        throw 'Exception while creating animation object ' + type + ':\n  ' + e + ' ' + (e.message ? e.message : '');
    }

    // console.log(animation.type, animation)
    return animation;
};

var AnimateCSS = exports.AnimateCSS = function AnimateCSS(_ref7) {
    var name = _ref7.name,
        path = _ref7.path,
        start_time = _ref7.start_time,
        end_time = _ref7.end_time,
        _ref7$duration = _ref7.duration,
        duration = _ref7$duration === undefined ? 1000 : _ref7$duration,
        _ref7$curve = _ref7.curve,
        curve = _ref7$curve === undefined ? 'linear' : _ref7$curve;

    if (start_time === undefined) start_time = new Date().getTime();

    var _checked_animation_du3 = checked_animation_duration({ start_time: start_time, end_time: end_time, duration: duration }),
        start_time = _checked_animation_du3.start_time,
        end_time = _checked_animation_du3.end_time,
        duration = _checked_animation_du3.duration;

    var start_state = { name: name, duration: duration, curve: curve, delay: 0, playState: 'paused' };
    var end_state = { name: name, duration: duration, curve: curve, delay: duration, playState: 'paused' };

    return Animate({
        type: 'CSS_' + (name ? name.toUpperCase() : 'END'),
        path: path + '/style/animation/' + name,
        start_time: start_time,
        end_time: end_time,
        duration: duration,
        curve: curve,
        start_state: start_state,
        end_state: end_state,
        amt: { delay: duration },
        tick: function tick(delta) {
            if (delta <= 0) {
                return start_state;
            } else if (delta >= duration) {
                return end_state;
            } else {
                return { name: name, duration: duration, curve: curve, delay: delta, playState: 'paused' };
            }
        }
    });
};

var Translate = exports.Translate = function Translate(_ref8) {
    var path = _ref8.path,
        start_time = _ref8.start_time,
        end_time = _ref8.end_time,
        _ref8$duration = _ref8.duration,
        duration = _ref8$duration === undefined ? 1000 : _ref8$duration,
        start_state = _ref8.start_state,
        end_state = _ref8.end_state,
        amt = _ref8.amt,
        _ref8$curve = _ref8.curve,
        curve = _ref8$curve === undefined ? 'linear' : _ref8$curve,
        _ref8$unit = _ref8.unit,
        unit = _ref8$unit === undefined ? 'px' : _ref8$unit;

    if (start_time === undefined) start_time = new Date().getTime();
    if (start_state === undefined) start_state = { top: 0, left: 0 };
    path = path + '/style/transform/translate';
    var type = 'TRANSLATE';

    var animation = { type: type, path: path, start_time: start_time, end_time: end_time, duration: duration, start_state: start_state, end_state: end_state, amt: amt, curve: curve, unit: unit };

    var left_tick = unit_tick(animation, 'left', 0); //  TODO: change left => /left to keep state selectors consistent
    var top_tick = unit_tick(animation, 'top', 0);

    animation.tick = function (delta) {
        return {
            left: left_tick(delta),
            top: top_tick(delta)
        };
    };
    return Animate(animation);
};

var TranslateTo = exports.TranslateTo = function TranslateTo(_ref9) {
    var path = _ref9.path,
        start_time = _ref9.start_time,
        end_time = _ref9.end_time,
        _ref9$duration = _ref9.duration,
        duration = _ref9$duration === undefined ? 1000 : _ref9$duration,
        start_state = _ref9.start_state,
        end_state = _ref9.end_state,
        amt = _ref9.amt,
        _ref9$curve = _ref9.curve,
        curve = _ref9$curve === undefined ? 'linear' : _ref9$curve,
        _ref9$unit = _ref9.unit,
        unit = _ref9$unit === undefined ? 'px' : _ref9$unit;

    var anims = [];
    if (start_state.left || end_state.left || amt.left) {
        anims = [].concat((0, _toConsumableArray3.default)(KeyedAnimation({
            type: 'TRANSLATE_TO_LEFT',
            path: path + '/style',
            key: 'left',
            start_time: start_time, end_time: end_time, duration: duration,
            start_state: start_state, end_state: end_state, amt: amt,
            curve: curve, unit: unit
        })));
    }
    if (start_state.top || end_state.top || amt.top) {
        anims = [].concat((0, _toConsumableArray3.default)(anims), (0, _toConsumableArray3.default)(KeyedAnimation({
            type: 'TRANSLATE_TO_TOP',
            path: path + '/style',
            key: 'top',
            start_time: start_time, end_time: end_time, duration: duration,
            start_state: start_state, end_state: end_state, amt: amt,
            curve: curve, unit: unit
        })));
    }
    return anims;
};

var Opacity = exports.Opacity = function Opacity(_ref10) {
    var path = _ref10.path,
        start_time = _ref10.start_time,
        end_time = _ref10.end_time,
        duration = _ref10.duration,
        start_state = _ref10.start_state,
        end_state = _ref10.end_state,
        amt = _ref10.amt,
        _ref10$curve = _ref10.curve,
        curve = _ref10$curve === undefined ? 'linear' : _ref10$curve,
        _ref10$unit = _ref10.unit,
        unit = _ref10$unit === undefined ? null : _ref10$unit;
    return Animate({
        type: 'OPACITY',
        path: path + '/style/opacity',
        start_time: start_time,
        end_time: end_time,
        duration: duration,
        start_state: start_state,
        end_state: end_state,
        amt: amt,
        curve: curve,
        unit: unit
    });
};

var Rotate = exports.Rotate = function Rotate(_ref11) {
    var path = _ref11.path,
        start_time = _ref11.start_time,
        end_time = _ref11.end_time,
        duration = _ref11.duration,
        start_state = _ref11.start_state,
        end_state = _ref11.end_state,
        amt = _ref11.amt,
        _ref11$curve = _ref11.curve,
        curve = _ref11$curve === undefined ? 'linear' : _ref11$curve,
        _ref11$unit = _ref11.unit,
        unit = _ref11$unit === undefined ? 'deg' : _ref11$unit;
    return Animate({
        type: 'ROTATE',
        path: path + '/style/transform/rotate',
        start_time: start_time,
        end_time: end_time,
        duration: duration,
        start_state: start_state,
        end_state: end_state,
        amt: amt,
        curve: curve,
        unit: unit
    });
};

// repeat a single animation (which may be composed of several objects)
var Repeat = exports.Repeat = function Repeat(animation) {
    var repeat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;

    (0, _util.checkIsValidAnimation)(animation);
    var tick = animation.tick,
        start_time = animation.start_time,
        duration = animation.duration;

    if (start_time === undefined) start_time = new Date().getTime();
    var repeated_tick = function repeated_tick(delta) {
        return tick((0, _util.mod)(delta, duration));
    };
    return (0, _extends3.default)({}, animation, {
        repeat: repeat,
        duration: duration * repeat,
        end_time: start_time + duration * repeat,
        tick: repeated_tick
    });
};

// reverse a single animation (which may be composed of several objects)
var Reverse = exports.Reverse = function Reverse(animation) {
    (0, _util.checkIsValidAnimation)(animation);
    var _tick = animation.tick,
        start_time = animation.start_time,
        duration = animation.duration;

    if (start_time === undefined) start_time = new Date().getTime();
    return (0, _extends3.default)({}, animation, {
        start_time: end_time,
        end_time: start_time,
        tick: function tick(delta) {
            return _tick(duration - delta);
        }
    });
};

// reverse a sequence of animations
// export const ReverseSequence = (animations) => {
// TODO
// }

// make each animation in a sequence start after the last one ends
var Sequential = exports.Sequential = function Sequential(animations, start_time) {
    (0, _util.checkIsValidSequence)(animations);
    if (start_time === undefined) start_time = new Date().getTime();
    var seq = [];
    var last_end = start_time;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)(animations), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var animation = _step.value;

            seq.push((0, _extends3.default)({}, animation, {
                start_time: last_end,
                end_time: last_end + animation.duration
            }));
            last_end = animation.duration == Infinity ? last_end + 1 : last_end + animation.duration;
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

    (0, _util.checkIsValidSequence)(seq);
    return seq;
};

// repeat a sequential list of animations
var RepeatSequence = exports.RepeatSequence = function RepeatSequence(animations, repeat, start_time) {
    (0, _util.checkIsValidSequence)(animations);

    var repeated = (0, _util.range)(repeat).reduce(function (acc, val) {
        return acc = [].concat((0, _toConsumableArray3.default)(acc), (0, _toConsumableArray3.default)(animations));
    }, []);
    return Sequential(repeated, start_time);
};

},{"./util.js":4,"babel-runtime/core-js/get-iterator":6,"babel-runtime/core-js/object/keys":8,"babel-runtime/helpers/extends":12,"babel-runtime/helpers/toConsumableArray":13,"babel-runtime/helpers/typeof":14}],2:[function(require,module,exports){
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

// window.parentExists = parentExists
// window.currentAnimations = currentAnimations
// window.sortedAnimations = sortedAnimations
// window.uniqueAnimations = uniqueAnimations
// window.activeAnimations = activeAnimations


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
                patches.push({ 'split_path': animation.split_path, 'value': animation.tick(delta) });
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

},{"./util.js":4,"babel-runtime/core-js/get-iterator":6,"babel-runtime/core-js/set":9,"babel-runtime/helpers/extends":12,"babel-runtime/helpers/toConsumableArray":13}],3:[function(require,module,exports){
(function (process){
'use strict';

var _redux = require('redux');

var _reducers = require('./reducers.js');

var _animations = require('./animations.js');

var assert = function assert(val, error_msg) {
    if (!val) {
        console.log('[X] AssertionError: ' + error_msg + ' (' + val + ')');
    } else {
        process ? process.stdout.write('.') : console.log('.');
    }
};

// const initial_state = {
//     test: {text: 'initial_state'}
// }

// const test = (state=initial_state.test, action) => {
//     switch(action.type) {
//         default:
//             return state
//     }
// }

// const store = createStore(
//     combineReducers({test, animations}),
//     initial_state,
// )
// assert(store.getState().animations.current_time == 0,                       'Initial current_time should be 0.')


// // ANIMATION HANDLER SETUP
// const handler = new AnimationHandler(store)
// const {animatedStore} = handler

// assert(
//        (animatedStore.getState().test.text == store.getState().test.text)
//     && (animatedStore.getState().test.text == initial_state.test.text),     'Initial state is wrong')


// // WARPED TIME SETUP
// assert(store.getState().animations.speed == 1,                              'Initial animation speed should be 1.')
// assert(store.getState().animations.current_time == 0,                       'current_time before first TICK should be 0.')
// store.dispatch({type: 'TICK', timestamp: handler.time.getWarpedTime()})
// assert(store.getState().animations.current_time > 0,                        'current_time after first TICK should be >0.')

// store.dispatch({type: 'SET_ANIMATION_SPEED', speed: 2})
// assert(store.getState().animations.speed == 2,                            'Animation speed was not set after SET_ANIMATION_SPEED.')


// // INITIAL STATE SETUP
// assert(
//        (animatedStore.getState().test.text == store.getState().test.text)
//     && (animatedStore.getState().test.text == initial_state.test.text),
//     'Initial state is wrong')

// assert(store.getState().animations.queue.length == 0,                       'Initial animation queue should be empty.')
// assert(JSON.stringify(store.getState().animations.state) == '{}',           'Initial animation state should be empty.')

// const start_time = handler.time.getWarpedTime()


// // ADDING STATE CHANGES
// store.dispatch({type: 'ANIMATE', animation: Become({path: '/test/text', state: '2nd state', start_time})})
// assert(store.getState().animations.queue.length == 1,                       'Animation was not added to queue.')


// // RUNNING STATE CHANGES
// store.dispatch({type: 'TICK', timestamp: start_time + 1})
// assert(animatedStore.getState().test.text == '2nd state',                   '2nd State was not set after Become.')
// store.dispatch({type: 'TICK', timestamp: start_time + 2})
// assert(animatedStore.getState().test.text == '2nd state',                   '2nd State was not consistent after Become.')


// // OVERLAPPING STATE CHANGES
// store.dispatch({type: 'ANIMATE', animation: Become({path: '/test/text', state: '3rd state', start_time: start_time + 3})})
// assert(store.getState().animations.queue.length == 2,                       'Animation was not added to queue.')

// store.dispatch({type: 'TICK', timestamp: start_time + 4})
// assert(animatedStore.getState().test.text == '3rd state',                   '3rd State was not reset after Become.')
// store.dispatch({type: 'TICK', timestamp: start_time + 5})
// assert(animatedStore.getState().test.text == '3rd state',                   '3rd State was not consistent after Become.')


// // ANIMATED STATE CHANGES
// store.dispatch({type: 'ANIMATE', animation: Animate({path: '/test/text', start_state: 0, end_state: 100, start_time: start_time + 6, duration: 1000})})
// assert(store.getState().animations.queue.length == 3,                       'Animation was not added to queue.')
// store.dispatch({type: 'TICK', timestamp: start_time + 7})
// assert(animatedStore.getState().test.text > 0,                              '3rd State was not reset after Become.')
// store.dispatch({type: 'TICK', timestamp: start_time + 900})
// assert(animatedStore.getState().test.text < 100,                            'Animation moved too fast.')
// store.dispatch({type: 'TICK', timestamp: start_time + 1007})
// assert(animatedStore.getState().test.text == '3rd state',                   'State was not reset after animation finished.')


// // OVERLAPPING ANIMATED STATE CHANGES
// store.dispatch({type: 'ANIMATE', animation: Become({path: '/test/text', state: 0, start_time: start_time + 2000})})
// store.dispatch({type: 'ANIMATE', animation: Animate({path: '/test/text', start_state: 0, amt: 100, start_time: start_time + 2100, duration: 1000})})
// store.dispatch({type: 'ANIMATE', animation: Animate({path: '/test/text', start_state: 200, amt: 100, start_time: start_time + 2200, duration: 2000})})
// store.dispatch({type: 'ANIMATE', animation: Animate({path: '/test/text', start_state: 400, amt: 100, start_time: start_time + 2300, duration: 1000})})
// store.dispatch({type: 'TICK', timestamp: start_time + 2050})
// assert(animatedStore.getState().test.text == 0,                             'State 0 was not applied after Become.')
// store.dispatch({type: 'TICK', timestamp: start_time + 2150})
// assert(animatedStore.getState().test.text > 0,                              '0-100 overlapping animation was not applied.')
// store.dispatch({type: 'TICK', timestamp: start_time + 2250})
// assert(animatedStore.getState().test.text > 200,                            '200-300 overlapping animation was not applied.')
// store.dispatch({type: 'TICK', timestamp: start_time + 2350})
// assert(animatedStore.getState().test.text > 400,                            '400-500 overlapping animation was not applied.')
// store.dispatch({type: 'TICK', timestamp: start_time + 3500})
// assert(animatedStore.getState().test.text < 300,                            '400-500 overlapping animation was not unapplied after it finished.')
// store.dispatch({type: 'TICK', timestamp: start_time + 4500})
// assert(animatedStore.getState().test.text == 0,                             'State did not revert to 0 after all animations finished.')


// // REPEATED ANIMATIONS
// store.dispatch({type: 'ANIMATE', animation: Repeat(Animate({path: '/test/text', start_state: 600, amt: 100, start_time: start_time + 5000, duration: 200}), 5)})
// store.dispatch({type: 'TICK', timestamp: start_time + 5050})
// assert(animatedStore.getState().test.text > 600,                             'State 600-700 was not animated.')
// store.dispatch({type: 'TICK', timestamp: start_time + 5500})
// assert(animatedStore.getState().test.text > 600,                             'State 600-700 did not repeat.')
// store.dispatch({type: 'TICK', timestamp: start_time + 6050})
// assert(animatedStore.getState().test.text == 0,                              'State did not revert to 0 after repeated animation.')


// // RUNLOOP MECHANICS
// store.dispatch({type: 'ANIMATE', animation: Animate({path: '/test/text', start_state: 600, amt: 100, start_time: start_time + 8000, duration: 200})})
// let queue = store.getState().animations.queue

// assert(currentAnimations(queue, start_time + 7000).length > 0,               'currentAnimations was empty despite queued infinite animations.')
// assert(futureAnimations(queue, start_time + 7000).length > 0,                'futureAnimations was empty despite queued future animations.')
// assert(pastAnimations(queue, start_time + 7000).length > 0,                  'pastAnimations was empty despite queued finished animations.')
// assert(uniqueAnimations(queue, start_time + 7000).length > 0,                'uniqueAnimations was empty despite multiple unique animations.')
// assert(handler.shouldAnimate(start_time + 7000),                             'shouldAnimate returned false when queue contained items.')
// assert(handler.animating,                                                    'animation runloop was not running despite queued animations.')


// // FULL INTEGRATION TEST

// store.dispatch({type: 'CLEAR_ANIMATIONS'})
// assert(store.getState().animations.queue.length == 0,                        'Animation queue failed to clear after CLEAR_ANIMATIONS.')
// assert(JSON.stringify(store.getState().animations.state) == '{}',            'Animation state failed to clear after CLEAR_ANIMATIONS.')

// const seq = [
//     Become({path: '/test/text', start_time: start_time + 9000, state: 'integration test'}),
//     Translate({path: '/test', start_time: start_time + 9000, duration: 1000, start_state: {top: 100, left: 100}, end_state: {top: 200, left: 200}}),
//     Opacity({path: '/test', start_time: start_time + 9000, duration: 1000, start_state: 0, end_state: 1}),
//     Rotate({path: '/test', start_time: start_time + 9000, duration: 1000, start_state: 0, end_state: 360}),
//     Become({path: '/test/text', start_time: start_time + 10000, state: null}),
// ]
// seq.map((animation => store.dispatch({type: 'ANIMATE', animation})))
// queue = store.getState().animations.queue

// assert(currentAnimations(queue, start_time + 9001).length == seq.length - 1,        'Queue was not the right length after adding several animations.')
// assert(uniqueAnimations(currentAnimations(queue, start_time + 20000)).length == 1,  'Unique current queue was not the right length after animations finished.')


// store.dispatch({type: 'TICK', timestamp: start_time + 9001})
// assert(animatedStore.getState().test.style.transform.indexOf('translate(') != -1,   'Translate animation failed to change style left state.')
// assert(animatedStore.getState().test.style.opacity > 0,                             'Opacity animation failed to change style opacity state.')
// assert(animatedStore.getState().test.style.transform.indexOf('rotate(') != -1,      'Rotate animation failed to change style rotation state.')
// store.dispatch({type: 'TICK', timestamp: start_time + 10001})
// assert(!animatedStore.getState().test.style,                                        'Animations left some dirty style state after completing.')


// ANIMATION UNIQUIFICATION
var anim_queue = [{ path: '/a/b' }, { path: '/a/b/c/d' }, { path: '/a/b/c/d/e' }, { path: '/a/b/f' }, { path: '/a/b' }, { path: '/a/b/x' }, { path: '/a/b/x/y' }, { path: '/a/b/x' }];

var uniq_anims = (0, _reducers.uniqueAnimations)(anim_queue);
assert(uniq_anims.length == 2, 'uniqueAnimations did not remove overwritten child paths');
assert(uniq_anims[0].path == '/a/b' && uniq_anims[1].path == '/a/b/x', 'uniqueAnimations removed wrong parent/child paths');

console.log('');
process.exit(0);

}).call(this,require('_process'))
},{"./animations.js":1,"./reducers.js":2,"_process":121,"redux":127}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.flattenStyles = exports.setDifference = exports.setIntersection = exports.flattened = exports.flipObj = exports.deepCopy = exports.range = exports.mod = exports.EasingFunctions = exports.checkIsValidSequence = exports.checkIsValidAnimation = undefined;

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.reversed = reversed;
exports.isBaseType = isBaseType;
exports.deepMerge = deepMerge;
exports.select = select;
exports.patch = patch;
exports.applyPatches = applyPatches;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [reversed].map(_regenerator2.default.mark);

var checkIsValidAnimation = exports.checkIsValidAnimation = function checkIsValidAnimation(animation) {
    if (Array.isArray(animation)) {
        console.log('%cINVALID ANIMATION:', 'color:red', animation);
        console.log('Got an array instead of a single animation object, did you double-nest somthing by forgetting to use ...?');
        throw 'Animation must be passed in as a single Animation object!';
    }
    if (!(animation.type && animation.path)) {
        console.log('%cINVALID ANIMATION:', 'color:red', animation);
        console.log('Got unrecognized aniamtion object missing a type or path.');
        throw 'Animation must be passed in as a single Animation object!';
    }
};

var checkIsValidSequence = exports.checkIsValidSequence = function checkIsValidSequence(animations) {
    if (!Array.isArray(animations)) {
        console.log('%cINVALID ANIMATION:', 'color:red', animations);
        console.log('Got something other than an array.');
        throw 'Sequence must be passed in as an array of Animation objects!';
    }
    if (animations.length && Array.isArray(animations[0])) {
        console.log('%cINVALID ANIMATION:', 'color:red', animations);
        console.log('Got double-nested animation array instead of just an array of objects.');
        throw 'Sequence must be passed in as an array of Animation objects!';
    }
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)(animations), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var animation = _step.value;

            checkIsValidAnimation(animation);
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

    return true;
};

var EasingFunctions = exports.EasingFunctions = {
    // no easing, no acceleration
    linear: function linear(t) {
        return t;
    },
    // accelerating from zero velocity
    easeInQuad: function easeInQuad(t) {
        return t * t;
    },
    // decelerating to zero velocity
    easeOutQuad: function easeOutQuad(t) {
        return t * (2 - t);
    },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function easeInOutQuad(t) {
        return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    // accelerating from zero velocity
    easeInCubic: function easeInCubic(t) {
        return t * t * t;
    },
    // decelerating to zero velocity
    easeOutCubic: function easeOutCubic(t) {
        return --t * t * t + 1;
    },
    // acceleration until halfway, then deceleration
    easeInOutCubic: function easeInOutCubic(t) {
        return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    // accelerating from zero velocity
    easeInQuart: function easeInQuart(t) {
        return t * t * t * t;
    },
    // decelerating to zero velocity
    easeOutQuart: function easeOutQuart(t) {
        return 1 - --t * t * t * t;
    },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function easeInOutQuart(t) {
        return t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    // accelerating from zero velocity
    easeInQuint: function easeInQuint(t) {
        return t * t * t * t * t;
    },
    // decelerating to zero velocity
    easeOutQuint: function easeOutQuint(t) {
        return 1 + --t * t * t * t * t;
    },
    // acceleration until halfway, then deceleration
    easeInOutQuint: function easeInOutQuint(t) {
        return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    }
};

var mod = exports.mod = function mod(num, amt) {
    return (num % amt + amt) % amt;
};

var range = exports.range = function range(num) {
    return [].concat((0, _toConsumableArray3.default)(Array(num).keys()));
};

var deepCopy = exports.deepCopy = function deepCopy(obj) {
    return $.extend(true, {}, obj); // TODO: remove jquery
};

var flipObj = exports.flipObj = function flipObj(obj) {
    return (0, _keys2.default)(obj).reduce(function (acc, key) {
        var val = obj[key];
        acc[val] = key;
        return acc;
    }, {});
};

function reversed(iterator) {
    var idx;
    return _regenerator2.default.wrap(function reversed$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    idx = iterator.length - 1;

                case 1:
                    if (!(idx >= 0)) {
                        _context.next = 7;
                        break;
                    }

                    _context.next = 4;
                    return iterator[idx];

                case 4:
                    idx--;
                    _context.next = 1;
                    break;

                case 7:
                case 'end':
                    return _context.stop();
            }
        }
    }, _marked[0], this);
}

var flattened = exports.flattened = function flattened(array) {
    return [].concat.apply([], array);
};

var setIntersection = exports.setIntersection = function setIntersection(set1, set2) {
    return [].concat((0, _toConsumableArray3.default)(set1)).filter(function (x) {
        return set2.has(x);
    });
};
var setDifference = exports.setDifference = function setDifference(set1, set2) {
    return [].concat((0, _toConsumableArray3.default)(set1)).filter(function (x) {
        return !set2.has(x);
    });
};

var base_types = ['string', 'number', 'boolean', 'symbol', 'function'];
function isBaseType(item) {
    var array_is_basetype = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    // false if item is a dict, true for everything else
    if (item === null || item === undefined) {
        return true;
    } else if (base_types.indexOf(typeof item === 'undefined' ? 'undefined' : (0, _typeof3.default)(item)) != -1) {
        return true;
    } else if (array_is_basetype && Array.isArray(item)) {
        return true;
    }
    return false;
}

function deepMerge(obj1, obj2) {
    var merge_vals = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    if (isBaseType(obj1) || isBaseType(obj2)) {
        return obj2;
    } else {
        var obj1_keys = new _set2.default((0, _keys2.default)(obj1));
        var obj2_keys = new _set2.default((0, _keys2.default)(obj2));
        var both_keys = setIntersection(obj1_keys, obj2_keys);
        var only_obj1 = setDifference(obj1_keys, obj2_keys);
        var only_obj2 = setDifference(obj2_keys, obj1_keys);

        var new_obj = {};

        // merge any values that are in both dicts
        if (merge_vals) {
            both_keys.reduce(function (new_obj, key) {
                new_obj[key] = deepMerge(obj1[key], obj2[key]);
                return new_obj;
            }, new_obj);
        }

        // add values only in obj1
        only_obj1.reduce(function (new_obj, key) {
            new_obj[key] = obj1[key];
            return new_obj;
        }, new_obj);

        // add values only in obj2
        only_obj2.reduce(function (new_obj, key) {
            new_obj[key] = obj2[key];
            return new_obj;
        }, new_obj);

        return new_obj;
    }
}

function select(obj, selector) {
    // ({a: {b: 2}}, '/a/b') => 2                   Get obj at specified addr (works with array indicies)
    var keys = void 0;
    if (typeof selector === 'string') {
        if (selector === '/') return obj;
        if (selector[0] !== '/') throw 'Invalid selector! ' + selector;
        keys = selector.split('/').slice(1);
    } else if (Array.isArray(selector)) {
        keys = selector;
    } else {
        throw 'Invalid selector, must be string /path or array of keys! ' + selector;
    }
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = (0, _getIterator3.default)(keys), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var key = _step2.value;

            obj = obj[key];
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

    return obj;
}

function patch(obj, selector, new_val) {
    var merge = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var mkpath = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    var deepcopy = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;

    // ({a: {b: 2}}, '/a/b', 4) => {a: {b: 4}}      Set obj at specified addr (works with array indicies)
    var keys = void 0;
    if (typeof selector === 'string') {
        if (selector === '/') return new_val;
        if (!selector || selector[0] !== '/') throw 'Invalid selector! ' + selector;
        keys = selector.split('/').slice(1);
    } else if (Array.isArray(selector)) {
        keys = [].concat((0, _toConsumableArray3.default)(selector));
    } else {
        throw 'Invalid selector, must be string /path or array of keys! ' + selector;
    }
    var last_key = keys.pop();
    if (last_key == '') {
        console.log({ obj: obj, selector: selector, new_val: new_val, merge: merge, mkpath: mkpath });
        throw 'Patch paths must not have trailing slashes or empty keys!';
    }
    var parent = obj;
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = (0, _getIterator3.default)(keys), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var key = _step3.value;

            // create path if any point is missing
            if (mkpath && (parent[key] === undefined || parent[key] === null) || isBaseType(parent[key], false)) {
                parent[key] = {};
            }
            parent = parent[key];
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

    if (merge) {
        parent[last_key] = deepMerge(parent[last_key], new_val);
    } else {
        parent[last_key] = new_val;
    }
    return deepcopy ? $.extend(true, {}, obj) : obj;
}

var css_transform_str = {
    scale: function scale(_scale) {
        return 'scale(' + _scale + ')';
    },
    perspective: function perspective(px) {
        return 'perspective(' + px + ')';
    },
    translate: function translate(_ref) {
        var left = _ref.left,
            top = _ref.top;
        return 'translate(' + left + ', ' + top + ')';
    },
    translate3d: function translate3d(_ref2) {
        var x = _ref2.x,
            y = _ref2.y,
            z = _ref2.z;
        return 'translate3d(' + x + ', ' + y + ', ' + z + ')';
    },
    rotate: function rotate(rotation) {
        return 'rotate(' + rotation + ')';
    },
    rotate3d: function rotate3d(_ref3) {
        var x = _ref3.x,
            y = _ref3.y,
            z = _ref3.z;
        return 'rotate3d(' + x + ', ' + y + ', ' + z + ')';
    },
    skew: function skew(_ref4) {
        var x = _ref4.x,
            y = _ref4.y;
        return 'skew(' + x + ', ' + y + ')';
    },
    scale3d: function scale3d(_ref5) {
        var x = _ref5.x,
            y = _ref5.y,
            z = _ref5.z;
        return 'scale3d(' + x + ', ' + y + ', ' + z + ')';
    }
    // TODO: add more css transform types?
};

var css_animation_str = function css_animation_str(_ref6) {
    var name = _ref6.name,
        duration = _ref6.duration,
        curve = _ref6.curve,
        delay = _ref6.delay,
        playState = _ref6.playState;
    return name + ' ' + duration + 'ms ' + curve + ' -' + delay + 'ms ' + playState;
};

var flattenTransform = function flattenTransform(transform) {
    // WARNING: optimized code, do not convert to map() without profiling
    // flatten transforms from a dict to a string
    // converts {style: {transform: {translate: {left: '0px', top: '10px'}, rotate: '10deg'}}}
    //      =>  {style: {transform: 'translate(0px, 10px) rotate(10deg)'}}

    var css_transform_funcs = [];
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
        for (var _iterator4 = (0, _getIterator3.default)((0, _keys2.default)(transform)), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var key = _step4.value;

            if (transform[key] === null) continue;
            var order = transform[key].order;
            if (typeof order === 'number') {
                // deterministic ordering via order: key
                css_transform_funcs[order] = css_transform_str[key](transform[key]);
            } else {
                css_transform_funcs.push(css_transform_str[key](transform[key]));
            }
        }
    } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
            }
        } finally {
            if (_didIteratorError4) {
                throw _iteratorError4;
            }
        }
    }

    return css_transform_funcs.filter(Boolean).join(' ');
};

var flattenAnimation = function flattenAnimation(animation) {
    // WARNING: optimized code, do not convert to map() without profiling
    // flatten animations from a dict to a string
    // converts {style: {animations: {blinker: {name: blinker, duration: 1000, curve: 'linear', delay: 767}, ...}}}
    //      =>  {style: {animation: blinker 1000ms linear -767ms paused, ...}}

    var css_animation_funcs = [];
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
        for (var _iterator5 = (0, _getIterator3.default)((0, _keys2.default)(animation)), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var key = _step5.value;

            if (animation[key] === null) continue;
            var order = animation[key].order;
            if (typeof order === 'number') {
                // deterministic ordering via order: key
                css_animation_funcs[order] = css_animation_str(animation[key]);
            } else {
                css_animation_funcs.push(css_animation_str(animation[key]));
            }
        }
    } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
            }
        } finally {
            if (_didIteratorError5) {
                throw _iteratorError5;
            }
        }
    }

    return css_animation_funcs.filter(Boolean).join(', ');
};

var flattenIfNotFlattened = function flattenIfNotFlattened(state, path, flatten_func) {
    var state_slice = select(state, path);
    if (typeof state_slice !== 'string') {
        patch(state, path, flatten_func(state_slice), false, false, false);
    }
};

var flattenStyles = exports.flattenStyles = function flattenStyles(state, paths_to_flatten) {
    // WARNING: highly optimized code, profile before changing anything
    // this converts the styles stored as dicts in the state tree, to the strings
    // that react components expect as CSS style values
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
        for (var _iterator6 = (0, _getIterator3.default)(paths_to_flatten), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var path = _step6.value;

            var transform_idx = path.lastIndexOf('transform');
            if (transform_idx != -1) {
                var path_to_transform = path.slice(0, transform_idx + 1);
                flattenIfNotFlattened(state, path_to_transform, flattenTransform);
                continue;
            }
            var animation_idx = path.lastIndexOf('animation');
            if (animation_idx != -1) {
                var path_to_animation = path.slice(0, animation_idx + 1);
                flattenIfNotFlattened(state, path_to_animation, flattenAnimation);
                continue;
            }
        }
    } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion6 && _iterator6.return) {
                _iterator6.return();
            }
        } finally {
            if (_didIteratorError6) {
                throw _iteratorError6;
            }
        }
    }

    return state;
};

var shouldFlatten = function shouldFlatten(split_path) {
    // WARNING: highly optimized code, profile before changing anything
    // check to see if a given path introduces some CSS state that needs to be
    // converted from an object to a css string, e.g. {style: transform: translate: {top: 0, left: 0}}
    var style_key = split_path.lastIndexOf('style');
    return style_key != -1 && (split_path[style_key + 1] == 'transform' || split_path[style_key + 1] == 'animation');
};

function applyPatches(obj, patches) {
    var flatten_styles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    // WARNING: highly optimized code, profile before changing anything
    var output = {};
    var paths_to_flatten = [];

    // O(n) application of patches onto a single object
    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
        for (var _iterator7 = (0, _getIterator3.default)(patches), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var _patch = _step7.value;

            // deepcopy to prevent later patches from mutating previous object values
            var patch_val = _patch.value;
            if (patch_val !== null && (typeof patch_val === 'undefined' ? 'undefined' : (0, _typeof3.default)(patch_val)) === 'object') {
                // unfortunately this is not very optimizable since dont know
                // the structure beforehand. Do not use JSON.stringify+parse because
                // Date, function, and Infinity objects dont get safely converted.
                // jQuery is significantly faster than lodash cloneDeep
                patch_val = $.extend(true, {}, patch_val);
            }
            var keys = [].concat((0, _toConsumableArray3.default)(_patch.split_path));

            if (flatten_styles && shouldFlatten(keys)) paths_to_flatten.push(keys);

            var final_key = keys.pop();
            // get to the end of the list of paths
            var parent = output;
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = (0, _getIterator3.default)(keys), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var key = _step8.value;

                    if (parent[key] === undefined || parent[key] === null || isBaseType(parent[key], false)) {
                        parent[key] = {};
                    }
                    parent = parent[key];
                }
            } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion8 && _iterator8.return) {
                        _iterator8.return();
                    }
                } finally {
                    if (_didIteratorError8) {
                        throw _iteratorError8;
                    }
                }
            }

            parent[final_key] = patch_val;
        }
    } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion7 && _iterator7.return) {
                _iterator7.return();
            }
        } finally {
            if (_didIteratorError7) {
                throw _iteratorError7;
            }
        }
    }

    if (flatten_styles) return flattenStyles(output, paths_to_flatten);
    return output;
}

},{"babel-runtime/core-js/get-iterator":6,"babel-runtime/core-js/object/keys":8,"babel-runtime/core-js/set":9,"babel-runtime/helpers/toConsumableArray":13,"babel-runtime/helpers/typeof":14,"babel-runtime/regenerator":15}],5:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/array/from"), __esModule: true };
},{"core-js/library/fn/array/from":16}],6:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/get-iterator"), __esModule: true };
},{"core-js/library/fn/get-iterator":17}],7:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":18}],8:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/keys"), __esModule: true };
},{"core-js/library/fn/object/keys":19}],9:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/set"), __esModule: true };
},{"core-js/library/fn/set":20}],10:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol"), __esModule: true };
},{"core-js/library/fn/symbol":21}],11:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol/iterator"), __esModule: true };
},{"core-js/library/fn/symbol/iterator":22}],12:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _assign = require("../core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};
},{"../core-js/object/assign":7}],13:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _from = require("../core-js/array/from");

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};
},{"../core-js/array/from":5}],14:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _iterator = require("../core-js/symbol/iterator");

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = require("../core-js/symbol");

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};
},{"../core-js/symbol":10,"../core-js/symbol/iterator":11}],15:[function(require,module,exports){
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":129}],16:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/es6.array.from');
module.exports = require('../../modules/_core').Array.from;
},{"../../modules/_core":37,"../../modules/es6.array.from":99,"../../modules/es6.string.iterator":105}],17:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.get-iterator');
},{"../modules/core.get-iterator":98,"../modules/es6.string.iterator":105,"../modules/web.dom.iterable":110}],18:[function(require,module,exports){
require('../../modules/es6.object.assign');
module.exports = require('../../modules/_core').Object.assign;
},{"../../modules/_core":37,"../../modules/es6.object.assign":101}],19:[function(require,module,exports){
require('../../modules/es6.object.keys');
module.exports = require('../../modules/_core').Object.keys;
},{"../../modules/_core":37,"../../modules/es6.object.keys":102}],20:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.set');
require('../modules/es7.set.to-json');
module.exports = require('../modules/_core').Set;
},{"../modules/_core":37,"../modules/es6.object.to-string":103,"../modules/es6.set":104,"../modules/es6.string.iterator":105,"../modules/es7.set.to-json":107,"../modules/web.dom.iterable":110}],21:[function(require,module,exports){
require('../../modules/es6.symbol');
require('../../modules/es6.object.to-string');
require('../../modules/es7.symbol.async-iterator');
require('../../modules/es7.symbol.observable');
module.exports = require('../../modules/_core').Symbol;
},{"../../modules/_core":37,"../../modules/es6.object.to-string":103,"../../modules/es6.symbol":106,"../../modules/es7.symbol.async-iterator":108,"../../modules/es7.symbol.observable":109}],22:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/web.dom.iterable');
module.exports = require('../../modules/_wks-ext').f('iterator');
},{"../../modules/_wks-ext":95,"../../modules/es6.string.iterator":105,"../../modules/web.dom.iterable":110}],23:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],24:[function(require,module,exports){
module.exports = function(){ /* empty */ };
},{}],25:[function(require,module,exports){
module.exports = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};
},{}],26:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":56}],27:[function(require,module,exports){
var forOf = require('./_for-of');

module.exports = function(iter, ITERATOR){
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

},{"./_for-of":47}],28:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject')
  , toLength  = require('./_to-length')
  , toIndex   = require('./_to-index');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};
},{"./_to-index":87,"./_to-iobject":89,"./_to-length":90}],29:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx      = require('./_ctx')
  , IObject  = require('./_iobject')
  , toObject = require('./_to-object')
  , toLength = require('./_to-length')
  , asc      = require('./_array-species-create');
module.exports = function(TYPE, $create){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX
    , create        = $create || asc;
  return function($this, callbackfn, that){
    var O      = toObject($this)
      , self   = IObject(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};
},{"./_array-species-create":31,"./_ctx":39,"./_iobject":53,"./_to-length":90,"./_to-object":91}],30:[function(require,module,exports){
var isObject = require('./_is-object')
  , isArray  = require('./_is-array')
  , SPECIES  = require('./_wks')('species');

module.exports = function(original){
  var C;
  if(isArray(original)){
    C = original.constructor;
    // cross-realm fallback
    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
    if(isObject(C)){
      C = C[SPECIES];
      if(C === null)C = undefined;
    }
  } return C === undefined ? Array : C;
};
},{"./_is-array":55,"./_is-object":56,"./_wks":96}],31:[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function(original, length){
  return new (speciesConstructor(original))(length);
};
},{"./_array-species-constructor":30}],32:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof')
  , TAG = require('./_wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./_cof":33,"./_wks":96}],33:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],34:[function(require,module,exports){
'use strict';
var dP          = require('./_object-dp').f
  , create      = require('./_object-create')
  , redefineAll = require('./_redefine-all')
  , ctx         = require('./_ctx')
  , anInstance  = require('./_an-instance')
  , defined     = require('./_defined')
  , forOf       = require('./_for-of')
  , $iterDefine = require('./_iter-define')
  , step        = require('./_iter-step')
  , setSpecies  = require('./_set-species')
  , DESCRIPTORS = require('./_descriptors')
  , fastKey     = require('./_meta').fastKey
  , SIZE        = DESCRIPTORS ? '_s' : 'size';

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        anInstance(this, C, 'forEach');
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)dP(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};
},{"./_an-instance":25,"./_ctx":39,"./_defined":40,"./_descriptors":41,"./_for-of":47,"./_iter-define":59,"./_iter-step":61,"./_meta":65,"./_object-create":67,"./_object-dp":68,"./_redefine-all":80,"./_set-species":82}],35:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = require('./_classof')
  , from    = require('./_array-from-iterable');
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};
},{"./_array-from-iterable":27,"./_classof":32}],36:[function(require,module,exports){
'use strict';
var global         = require('./_global')
  , $export        = require('./_export')
  , meta           = require('./_meta')
  , fails          = require('./_fails')
  , hide           = require('./_hide')
  , redefineAll    = require('./_redefine-all')
  , forOf          = require('./_for-of')
  , anInstance     = require('./_an-instance')
  , isObject       = require('./_is-object')
  , setToStringTag = require('./_set-to-string-tag')
  , dP             = require('./_object-dp').f
  , each           = require('./_array-methods')(0)
  , DESCRIPTORS    = require('./_descriptors');

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  if(!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    C = wrapper(function(target, iterable){
      anInstance(target, C, NAME, '_c');
      target._c = new Base;
      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
    });
    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','),function(KEY){
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))hide(C.prototype, KEY, function(a, b){
        anInstance(this, C, KEY);
        if(!IS_ADDER && IS_WEAK && !isObject(a))return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    if('size' in proto)dP(C.prototype, 'size', {
      get: function(){
        return this._c.size;
      }
    });
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F, O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};
},{"./_an-instance":25,"./_array-methods":29,"./_descriptors":41,"./_export":45,"./_fails":46,"./_for-of":47,"./_global":48,"./_hide":50,"./_is-object":56,"./_meta":65,"./_object-dp":68,"./_redefine-all":80,"./_set-to-string-tag":83}],37:[function(require,module,exports){
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],38:[function(require,module,exports){
'use strict';
var $defineProperty = require('./_object-dp')
  , createDesc      = require('./_property-desc');

module.exports = function(object, index, value){
  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};
},{"./_object-dp":68,"./_property-desc":79}],39:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./_a-function":23}],40:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],41:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":46}],42:[function(require,module,exports){
var isObject = require('./_is-object')
  , document = require('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":48,"./_is-object":56}],43:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');
},{}],44:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys')
  , gOPS    = require('./_object-gops')
  , pIE     = require('./_object-pie');
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};
},{"./_object-gops":73,"./_object-keys":76,"./_object-pie":77}],45:[function(require,module,exports){
var global    = require('./_global')
  , core      = require('./_core')
  , ctx       = require('./_ctx')
  , hide      = require('./_hide')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;
},{"./_core":37,"./_ctx":39,"./_global":48,"./_hide":50}],46:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],47:[function(require,module,exports){
var ctx         = require('./_ctx')
  , call        = require('./_iter-call')
  , isArrayIter = require('./_is-array-iter')
  , anObject    = require('./_an-object')
  , toLength    = require('./_to-length')
  , getIterFn   = require('./core.get-iterator-method')
  , BREAK       = {}
  , RETURN      = {};
var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator, result;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if(result === BREAK || result === RETURN)return result;
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    result = call(iterator, f, step.value, entries);
    if(result === BREAK || result === RETURN)return result;
  }
};
exports.BREAK  = BREAK;
exports.RETURN = RETURN;
},{"./_an-object":26,"./_ctx":39,"./_is-array-iter":54,"./_iter-call":57,"./_to-length":90,"./core.get-iterator-method":97}],48:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],49:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],50:[function(require,module,exports){
var dP         = require('./_object-dp')
  , createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_descriptors":41,"./_object-dp":68,"./_property-desc":79}],51:[function(require,module,exports){
module.exports = require('./_global').document && document.documentElement;
},{"./_global":48}],52:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function(){
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_descriptors":41,"./_dom-create":42,"./_fails":46}],53:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./_cof":33}],54:[function(require,module,exports){
// check on default Array iterator
var Iterators  = require('./_iterators')
  , ITERATOR   = require('./_wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
},{"./_iterators":62,"./_wks":96}],55:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};
},{"./_cof":33}],56:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],57:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./_an-object":26}],58:[function(require,module,exports){
'use strict';
var create         = require('./_object-create')
  , descriptor     = require('./_property-desc')
  , setToStringTag = require('./_set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./_hide":50,"./_object-create":67,"./_property-desc":79,"./_set-to-string-tag":83,"./_wks":96}],59:[function(require,module,exports){
'use strict';
var LIBRARY        = require('./_library')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , hide           = require('./_hide')
  , has            = require('./_has')
  , Iterators      = require('./_iterators')
  , $iterCreate    = require('./_iter-create')
  , setToStringTag = require('./_set-to-string-tag')
  , getPrototypeOf = require('./_object-gpo')
  , ITERATOR       = require('./_wks')('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./_export":45,"./_has":49,"./_hide":50,"./_iter-create":58,"./_iterators":62,"./_library":64,"./_object-gpo":74,"./_redefine":81,"./_set-to-string-tag":83,"./_wks":96}],60:[function(require,module,exports){
var ITERATOR     = require('./_wks')('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./_wks":96}],61:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],62:[function(require,module,exports){
module.exports = {};
},{}],63:[function(require,module,exports){
var getKeys   = require('./_object-keys')
  , toIObject = require('./_to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./_object-keys":76,"./_to-iobject":89}],64:[function(require,module,exports){
module.exports = true;
},{}],65:[function(require,module,exports){
var META     = require('./_uid')('meta')
  , isObject = require('./_is-object')
  , has      = require('./_has')
  , setDesc  = require('./_object-dp').f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !require('./_fails')(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};
},{"./_fails":46,"./_has":49,"./_is-object":56,"./_object-dp":68,"./_uid":93}],66:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = require('./_object-keys')
  , gOPS     = require('./_object-gops')
  , pIE      = require('./_object-pie')
  , toObject = require('./_to-object')
  , IObject  = require('./_iobject')
  , $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;
},{"./_fails":46,"./_iobject":53,"./_object-gops":73,"./_object-keys":76,"./_object-pie":77,"./_to-object":91}],67:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = require('./_an-object')
  , dPs         = require('./_object-dps')
  , enumBugKeys = require('./_enum-bug-keys')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":26,"./_dom-create":42,"./_enum-bug-keys":43,"./_html":51,"./_object-dps":69,"./_shared-key":84}],68:[function(require,module,exports){
var anObject       = require('./_an-object')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , toPrimitive    = require('./_to-primitive')
  , dP             = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};
},{"./_an-object":26,"./_descriptors":41,"./_ie8-dom-define":52,"./_to-primitive":92}],69:[function(require,module,exports){
var dP       = require('./_object-dp')
  , anObject = require('./_an-object')
  , getKeys  = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};
},{"./_an-object":26,"./_descriptors":41,"./_object-dp":68,"./_object-keys":76}],70:[function(require,module,exports){
var pIE            = require('./_object-pie')
  , createDesc     = require('./_property-desc')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , has            = require('./_has')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};
},{"./_descriptors":41,"./_has":49,"./_ie8-dom-define":52,"./_object-pie":77,"./_property-desc":79,"./_to-iobject":89,"./_to-primitive":92}],71:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject')
  , gOPN      = require('./_object-gopn').f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":72,"./_to-iobject":89}],72:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = require('./_object-keys-internal')
  , hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};
},{"./_enum-bug-keys":43,"./_object-keys-internal":75}],73:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;
},{}],74:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = require('./_has')
  , toObject    = require('./_to-object')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};
},{"./_has":49,"./_shared-key":84,"./_to-object":91}],75:[function(require,module,exports){
var has          = require('./_has')
  , toIObject    = require('./_to-iobject')
  , arrayIndexOf = require('./_array-includes')(false)
  , IE_PROTO     = require('./_shared-key')('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};
},{"./_array-includes":28,"./_has":49,"./_shared-key":84,"./_to-iobject":89}],76:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = require('./_object-keys-internal')
  , enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};
},{"./_enum-bug-keys":43,"./_object-keys-internal":75}],77:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;
},{}],78:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export')
  , core    = require('./_core')
  , fails   = require('./_fails');
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};
},{"./_core":37,"./_export":45,"./_fails":46}],79:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],80:[function(require,module,exports){
var hide = require('./_hide');
module.exports = function(target, src, safe){
  for(var key in src){
    if(safe && target[key])target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};
},{"./_hide":50}],81:[function(require,module,exports){
module.exports = require('./_hide');
},{"./_hide":50}],82:[function(require,module,exports){
'use strict';
var global      = require('./_global')
  , core        = require('./_core')
  , dP          = require('./_object-dp')
  , DESCRIPTORS = require('./_descriptors')
  , SPECIES     = require('./_wks')('species');

module.exports = function(KEY){
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./_core":37,"./_descriptors":41,"./_global":48,"./_object-dp":68,"./_wks":96}],83:[function(require,module,exports){
var def = require('./_object-dp').f
  , has = require('./_has')
  , TAG = require('./_wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./_has":49,"./_object-dp":68,"./_wks":96}],84:[function(require,module,exports){
var shared = require('./_shared')('keys')
  , uid    = require('./_uid');
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};
},{"./_shared":85,"./_uid":93}],85:[function(require,module,exports){
var global = require('./_global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./_global":48}],86:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , defined   = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./_defined":40,"./_to-integer":88}],87:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./_to-integer":88}],88:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],89:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject')
  , defined = require('./_defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./_defined":40,"./_iobject":53}],90:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./_to-integer":88}],91:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./_defined":40}],92:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./_is-object":56}],93:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],94:[function(require,module,exports){
var global         = require('./_global')
  , core           = require('./_core')
  , LIBRARY        = require('./_library')
  , wksExt         = require('./_wks-ext')
  , defineProperty = require('./_object-dp').f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};
},{"./_core":37,"./_global":48,"./_library":64,"./_object-dp":68,"./_wks-ext":95}],95:[function(require,module,exports){
exports.f = require('./_wks');
},{"./_wks":96}],96:[function(require,module,exports){
var store      = require('./_shared')('wks')
  , uid        = require('./_uid')
  , Symbol     = require('./_global').Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;
},{"./_global":48,"./_shared":85,"./_uid":93}],97:[function(require,module,exports){
var classof   = require('./_classof')
  , ITERATOR  = require('./_wks')('iterator')
  , Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./_classof":32,"./_core":37,"./_iterators":62,"./_wks":96}],98:[function(require,module,exports){
var anObject = require('./_an-object')
  , get      = require('./core.get-iterator-method');
module.exports = require('./_core').getIterator = function(it){
  var iterFn = get(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};
},{"./_an-object":26,"./_core":37,"./core.get-iterator-method":97}],99:[function(require,module,exports){
'use strict';
var ctx            = require('./_ctx')
  , $export        = require('./_export')
  , toObject       = require('./_to-object')
  , call           = require('./_iter-call')
  , isArrayIter    = require('./_is-array-iter')
  , toLength       = require('./_to-length')
  , createProperty = require('./_create-property')
  , getIterFn      = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":38,"./_ctx":39,"./_export":45,"./_is-array-iter":54,"./_iter-call":57,"./_iter-detect":60,"./_to-length":90,"./_to-object":91,"./core.get-iterator-method":97}],100:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables')
  , step             = require('./_iter-step')
  , Iterators        = require('./_iterators')
  , toIObject        = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./_add-to-unscopables":24,"./_iter-define":59,"./_iter-step":61,"./_iterators":62,"./_to-iobject":89}],101:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', {assign: require('./_object-assign')});
},{"./_export":45,"./_object-assign":66}],102:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object')
  , $keys    = require('./_object-keys');

require('./_object-sap')('keys', function(){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./_object-keys":76,"./_object-sap":78,"./_to-object":91}],103:[function(require,module,exports){

},{}],104:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');

// 23.2 Set Objects
module.exports = require('./_collection')('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./_collection":36,"./_collection-strong":34}],105:[function(require,module,exports){
'use strict';
var $at  = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./_iter-define":59,"./_string-at":86}],106:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global         = require('./_global')
  , has            = require('./_has')
  , DESCRIPTORS    = require('./_descriptors')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , META           = require('./_meta').KEY
  , $fails         = require('./_fails')
  , shared         = require('./_shared')
  , setToStringTag = require('./_set-to-string-tag')
  , uid            = require('./_uid')
  , wks            = require('./_wks')
  , wksExt         = require('./_wks-ext')
  , wksDefine      = require('./_wks-define')
  , keyOf          = require('./_keyof')
  , enumKeys       = require('./_enum-keys')
  , isArray        = require('./_is-array')
  , anObject       = require('./_an-object')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , createDesc     = require('./_property-desc')
  , _create        = require('./_object-create')
  , gOPNExt        = require('./_object-gopn-ext')
  , $GOPD          = require('./_object-gopd')
  , $DP            = require('./_object-dp')
  , $keys          = require('./_object-keys')
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f  = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !require('./_library')){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
},{"./_an-object":26,"./_descriptors":41,"./_enum-keys":44,"./_export":45,"./_fails":46,"./_global":48,"./_has":49,"./_hide":50,"./_is-array":55,"./_keyof":63,"./_library":64,"./_meta":65,"./_object-create":67,"./_object-dp":68,"./_object-gopd":70,"./_object-gopn":72,"./_object-gopn-ext":71,"./_object-gops":73,"./_object-keys":76,"./_object-pie":77,"./_property-desc":79,"./_redefine":81,"./_set-to-string-tag":83,"./_shared":85,"./_to-iobject":89,"./_to-primitive":92,"./_uid":93,"./_wks":96,"./_wks-define":94,"./_wks-ext":95}],107:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = require('./_export');

$export($export.P + $export.R, 'Set', {toJSON: require('./_collection-to-json')('Set')});
},{"./_collection-to-json":35,"./_export":45}],108:[function(require,module,exports){
require('./_wks-define')('asyncIterator');
},{"./_wks-define":94}],109:[function(require,module,exports){
require('./_wks-define')('observable');
},{"./_wks-define":94}],110:[function(require,module,exports){
require('./es6.array.iterator');
var global        = require('./_global')
  , hide          = require('./_hide')
  , Iterators     = require('./_iterators')
  , TO_STRING_TAG = require('./_wks')('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}
},{"./_global":48,"./_hide":50,"./_iterators":62,"./_wks":96,"./es6.array.iterator":100}],111:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":118}],112:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    getRawTag = require('./_getRawTag'),
    objectToString = require('./_objectToString');

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

},{"./_Symbol":111,"./_getRawTag":115,"./_objectToString":116}],113:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],114:[function(require,module,exports){
var overArg = require('./_overArg');

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;

},{"./_overArg":117}],115:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

},{"./_Symbol":111}],116:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

},{}],117:[function(require,module,exports){
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;

},{}],118:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":113}],119:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],120:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    getPrototype = require('./_getPrototype'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;

},{"./_baseGetTag":112,"./_getPrototype":114,"./isObjectLike":119}],121:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],122:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = applyMiddleware;

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function (reducer, preloadedState, enhancer) {
      var store = createStore(reducer, preloadedState, enhancer);
      var _dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = _compose2['default'].apply(undefined, chain)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}
},{"./compose":125}],123:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = bindActionCreators;
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}
},{}],124:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports['default'] = combineReducers;

var _createStore = require('./createStore');

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _warning = require('./utils/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state. ' + 'If you want this reducer to hold no value, you can return null instead of undefined.';
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!(0, _isPlainObject2['default'])(inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });

  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });

  if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined. If you don\'t want to set a value for this reducer, ' + 'you can use null instead of undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined, but can be null.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        (0, _warning2['default'])('No reducer provided for key "' + key + '"');
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);

  var unexpectedKeyCache = void 0;
  if (process.env.NODE_ENV !== 'production') {
    unexpectedKeyCache = {};
  }

  var shapeAssertionError = void 0;
  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    if (process.env.NODE_ENV !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
      if (warningMessage) {
        (0, _warning2['default'])(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};
    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }
      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}
}).call(this,require('_process'))
},{"./createStore":126,"./utils/warning":128,"_process":121,"lodash/isPlainObject":120}],125:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports["default"] = compose;
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(undefined, arguments));
    };
  });
}
},{}],126:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.ActionTypes = undefined;
exports['default'] = createStore;

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _symbolObservable = require('symbol-observable');

var _symbolObservable2 = _interopRequireDefault(_symbolObservable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = exports.ActionTypes = {
  INIT: '@@redux/INIT'

  /**
   * Creates a Redux store that holds the state tree.
   * The only way to change the data in the store is to call `dispatch()` on it.
   *
   * There should only be a single store in your app. To specify how different
   * parts of the state tree respond to actions, you may combine several reducers
   * into a single reducer function by using `combineReducers`.
   *
   * @param {Function} reducer A function that returns the next state tree, given
   * the current state tree and the action to handle.
   *
   * @param {any} [preloadedState] The initial state. You may optionally specify it
   * to hydrate the state from the server in universal apps, or to restore a
   * previously serialized user session.
   * If you use `combineReducers` to produce the root reducer function, this must be
   * an object with the same shape as `combineReducers` keys.
   *
   * @param {Function} [enhancer] The store enhancer. You may optionally specify it
   * to enhance the store with third-party capabilities such as middleware,
   * time travel, persistence, etc. The only store enhancer that ships with Redux
   * is `applyMiddleware()`.
   *
   * @returns {Store} A Redux store that lets you read the state, dispatch actions
   * and subscribe to changes.
   */
};function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!(0, _isPlainObject2['default'])(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */
  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return { unsubscribe: unsubscribe };
      }
    }, _ref[_symbolObservable2['default']] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[_symbolObservable2['default']] = observable, _ref2;
}
},{"lodash/isPlainObject":120,"symbol-observable":131}],127:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports.compose = exports.applyMiddleware = exports.bindActionCreators = exports.combineReducers = exports.createStore = undefined;

var _createStore = require('./createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _combineReducers = require('./combineReducers');

var _combineReducers2 = _interopRequireDefault(_combineReducers);

var _bindActionCreators = require('./bindActionCreators');

var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);

var _applyMiddleware = require('./applyMiddleware');

var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

var _warning = require('./utils/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed() {}

if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  (0, _warning2['default'])('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}

exports.createStore = _createStore2['default'];
exports.combineReducers = _combineReducers2['default'];
exports.bindActionCreators = _bindActionCreators2['default'];
exports.applyMiddleware = _applyMiddleware2['default'];
exports.compose = _compose2['default'];
}).call(this,require('_process'))
},{"./applyMiddleware":122,"./bindActionCreators":123,"./combineReducers":124,"./compose":125,"./createStore":126,"./utils/warning":128,"_process":121}],128:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = warning;
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}
},{}],129:[function(require,module,exports){
(function (global){
// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g =
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this;

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = require("./runtime");

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./runtime":130}],130:[function(require,module,exports){
(function (global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],131:[function(require,module,exports){
module.exports = require('./lib/index');

},{"./lib/index":132}],132:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ponyfill = require('./ponyfill');

var _ponyfill2 = _interopRequireDefault(_ponyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var root; /* global window */


if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (typeof module !== 'undefined') {
  root = module;
} else {
  root = Function('return this')();
}

var result = (0, _ponyfill2['default'])(root);
exports['default'] = result;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./ponyfill":133}],133:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports['default'] = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
	var result;
	var _Symbol = root.Symbol;

	if (typeof _Symbol === 'function') {
		if (_Symbol.observable) {
			result = _Symbol.observable;
		} else {
			result = _Symbol('observable');
			_Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};
},{}]},{},[3]);
