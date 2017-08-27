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
    var has_left = (start_state || end_state || amt).left !== undefined;
    var has_top = (start_state || end_state || amt).top !== undefined;
    if (has_left) {
        anims = [KeyedAnimation({
            type: 'TRANSLATE_TO_LEFT',
            path: path + '/style',
            key: 'left',
            start_time: start_time, end_time: end_time, duration: duration,
            start_state: start_state, end_state: end_state, amt: amt,
            curve: curve, unit: unit
        })];
    }
    if (has_top) {
        anims = [].concat((0, _toConsumableArray3.default)(anims), [KeyedAnimation({
            type: 'TRANSLATE_TO_TOP',
            path: path + '/style',
            key: 'top',
            start_time: start_time, end_time: end_time, duration: duration,
            start_state: start_state, end_state: end_state, amt: amt,
            curve: curve, unit: unit
        })]);
    }
    if (!has_left && !has_top) throw 'TranslateTo start_state and end_state must have {left or top}';
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
