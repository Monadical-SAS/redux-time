'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RepeatSequence = exports.Sequential = exports.Reverse = exports.Repeat = exports.Rotate = exports.Opacity = exports.Translate = exports.AnimateCSS = exports.Style = exports.Animate = exports.computeTheOther = exports.Become = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _util = require('./util.js');

var _lodash = require('lodash.isequal');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fmtWithUnit = function fmtWithUnit(val, unit) {
    return unit ? '' + val + unit : val;
};

var tick_func = function tick_func(_ref) {
    var duration = _ref.duration,
        start_state = _ref.start_state,
        delta_state = _ref.delta_state,
        end_state = _ref.end_state,
        _ref$curve = _ref.curve,
        curve = _ref$curve === undefined ? 'linear' : _ref$curve,
        _ref$unit = _ref.unit,
        unit = _ref$unit === undefined ? null : _ref$unit;


    var curve_func = _util.EasingFunctions[curve];

    return function (time_elapsed) {
        if (time_elapsed < 0) {
            return start_state;
        }
        if (time_elapsed > duration) {
            return end_state;
        }
        var curve_value = curve_func(time_elapsed / duration);
        var new_state = start_state + curve_value * delta_state;

        return fmtWithUnit(new_state, unit);
    };
};

var Become = exports.Become = function Become(_ref2) {
    var path = _ref2.path,
        state = _ref2.state,
        start_time = _ref2.start_time,
        end_time = _ref2.end_time,
        duration = _ref2.duration;

    if (start_time === undefined) start_time = Date.now();

    if (end_time === undefined && duration === undefined) {
        duration = Infinity;
        end_time = Infinity;
    }

    if (end_time !== Infinity || duration !== Infinity) {
        if (exactlyOneIsUndefined(duration, end_time)) {
            var _computeTheOther = computeTheOther(start_time, duration, end_time);

            var _computeTheOther2 = (0, _slicedToArray3.default)(_computeTheOther, 2);

            duration = _computeTheOther2[0];
            end_time = _computeTheOther2[1];
        } else {
            // console.log({path, state, start_time, end_time, duration})
            throw 'Invalid call to Become: you may define end_time or duration, but not both.';
        }
    }

    return Animate({
        type: 'BECOME',
        path: path,
        start_state: state,
        delta_state: null,
        end_state: null,
        start_time: start_time,
        end_time: end_time,
        duration: duration,
        tick: function tick(_) {
            return state;
        }
    });
};

var computeTheOther = exports.computeTheOther = function computeTheOther(start, delta, end) {
    // assumes start and one of (delta, end) are defined.
    // error checking is done before this point is reached

    // console.log({start, delta, end})
    if ((typeof start === 'undefined' ? 'undefined' : (0, _typeof3.default)(start)) === 'object') {
        var new_delta = delta ? (0, _extends3.default)({}, delta) : {};
        var new_end = end ? (0, _extends3.default)({}, end) : {};
        if (delta === undefined) {
            (0, _keys2.default)(start).forEach(function (key) {
                var _computeTheOther3 = computeTheOther(start[key], new_delta[key], new_end[key]),
                    _computeTheOther4 = (0, _slicedToArray3.default)(_computeTheOther3, 2),
                    _delta = _computeTheOther4[0],
                    _end = _computeTheOther4[1];

                new_delta[key] = _delta;
                new_end[key] = _end;
            });
        } else {
            var delta_keys = (0, _keys2.default)(delta);
            (0, _keys2.default)(start).forEach(function (key) {
                if (delta_keys.includes(key)) {
                    var _computeTheOther5 = computeTheOther(start[key], new_delta[key], new_end[key]),
                        _computeTheOther6 = (0, _slicedToArray3.default)(_computeTheOther5, 2),
                        _delta = _computeTheOther6[0],
                        _end = _computeTheOther6[1];

                    new_delta[key] = _delta;
                    new_end[key] = _end;
                } else {
                    new_end[key] = start[key];
                }
            });
        }
        return [new_delta, new_end];
    }
    if (typeof start === 'number') {
        if (end === undefined && delta !== undefined) {
            return [delta, start + delta];
        } else if (end !== undefined && delta === undefined) {
            return [end - start, end];
        } else {
            throw 'computeTheOther was expecting one of (delta, end) to be defined, but not both';
        }
    }
    throw 'computeTheOther got (' + start + ', ' + delta + ', ' + end + ') as args and didn\'t know what to do';
};

var exactlyOneIsUndefined = function exactlyOneIsUndefined(val1, val2) {
    return (val1 === undefined || val2 === undefined) && !(val1 === undefined && val2 === undefined);
};

var isNumber = function isNumber(val) {
    return typeof val === 'number';
};

var applyDefaultsAndValidateTimes = function applyDefaultsAndValidateTimes(start_time, duration, end_time) {
    if (start_time === undefined) start_time = Date.now();

    if (duration === undefined && end_time === undefined) {
        duration = 1000; // removing this semi-colon results in a gnarly parse error

        var _computeTheOther7 = computeTheOther(start_time, duration, end_time);

        var _computeTheOther8 = (0, _slicedToArray3.default)(_computeTheOther7, 2);

        duration = _computeTheOther8[0];
        end_time = _computeTheOther8[1];
    } else if (exactlyOneIsUndefined(duration, end_time)) {
        var _computeTheOther9 = computeTheOther(start_time, duration, end_time);

        var _computeTheOther10 = (0, _slicedToArray3.default)(_computeTheOther9, 2);

        duration = _computeTheOther10[0];
        end_time = _computeTheOther10[1];
    } else {
        throw 'only one of (duration, end_time) should be passed in, not both.';
    }

    if (start_time > end_time) {
        throw 'start_time (' + start_time + ') > end_time (' + end_time + ')';
    }
    return [start_time, duration, end_time];
};

var validateAnimation = function validateAnimation(animation) {
    var end_time = animation.end_time;
    var end_state = animation.end_state;

    var computed_end_state = (0, _util.computeAnimatedState)({
        animations: [animation],
        warped_time: end_time
    });
    if (!(0, _lodash2.default)(computed_end_state, end_state)) {
        throw 'Invalid Animate: end_state !== computed_end_state for animation:' + ('\n' + (0, _stringify2.default)(animation, null, '  ') + ':') + ((0, _stringify2.default)(computed_end_state, null, '  ') + ' !==') + ('' + (0, _stringify2.default)(end_state, null, '  '));
    }
};

var Animate = exports.Animate = function Animate(_ref3) {
    var type = _ref3.type,
        path = _ref3.path,
        start_time = _ref3.start_time,
        end_time = _ref3.end_time,
        duration = _ref3.duration,
        start_state = _ref3.start_state,
        end_state = _ref3.end_state,
        delta_state = _ref3.delta_state,
        _ref3$merge = _ref3.merge,
        merge = _ref3$merge === undefined ? false : _ref3$merge,
        _ref3$curve = _ref3.curve,
        curve = _ref3$curve === undefined ? 'linear' : _ref3$curve,
        _ref3$unit = _ref3.unit,
        unit = _ref3$unit === undefined ? null : _ref3$unit,
        _ref3$tick = _ref3.tick,
        tick = _ref3$tick === undefined ? null : _ref3$tick;


    var throw_msg = function throw_msg(msg) {
        return 'Invalid call to Animate w/path ' + path + ': ' + msg;
    };

    var _start_time = void 0,
        _end_time = void 0,
        _duration = void 0,
        _end_state = void 0,
        _delta_state = void 0,
        _tick = void 0,
        _split_path = void 0,
        _type = void 0;

    _start_time = start_time === undefined ? Date.now() : start_time;
    if (exactlyOneIsUndefined(duration, end_time)) {
        var _computeTheOther11 = computeTheOther(_start_time, duration, end_time);

        var _computeTheOther12 = (0, _slicedToArray3.default)(_computeTheOther11, 2);

        _duration = _computeTheOther12[0];
        _end_time = _computeTheOther12[1];
    } else {
        _duration = duration;
        _end_time = end_time;
    }

    if (exactlyOneIsUndefined(delta_state, end_state)) {
        var _computeTheOther13 = computeTheOther(start_state, delta_state, end_state);

        var _computeTheOther14 = (0, _slicedToArray3.default)(_computeTheOther13, 2);

        _delta_state = _computeTheOther14[0];
        _end_state = _computeTheOther14[1];
    } else {
        _delta_state = delta_state;
        _end_state = end_state;
    }

    if (_start_time > _end_time) {
        throw throw_msg('start_time (' + start_time + ') > end_time (' + end_time + ').');
    }

    _split_path = path.split('/').slice(1);

    if (_split_path.slice(-1) == '') {
        throw throw_msg('path has a trailing slash');
    }

    var animation = {
        type: type || 'ANIMATE',
        split_path: _split_path,
        start_time: _start_time,
        end_time: _end_time,
        duration: _duration,
        end_state: _end_state,
        delta_state: _delta_state,

        start_state: start_state,
        path: path,
        curve: curve,
        unit: unit,
        merge: merge
    };
    _tick = tick || tick_func(animation);
    animation.tick = _tick;

    return (0, _util.immutify)(animation);
};

var Style = exports.Style = function Style(_ref4) {
    var path = _ref4.path,
        start_time = _ref4.start_time,
        end_time = _ref4.end_time,
        duration = _ref4.duration,
        start_state = _ref4.start_state,
        end_state = _ref4.end_state,
        delta_state = _ref4.delta_state,
        _ref4$curve = _ref4.curve,
        curve = _ref4$curve === undefined ? 'linear' : _ref4$curve,
        _ref4$unit = _ref4.unit,
        unit = _ref4$unit === undefined ? 'px' : _ref4$unit;


    // console.log({start_state, end_state, delta_state})
    try {
        var _applyDefaultsAndVali = applyDefaultsAndValidateTimes(start_time, duration, end_time);

        var _applyDefaultsAndVali2 = (0, _slicedToArray3.default)(_applyDefaultsAndVali, 3);

        start_time = _applyDefaultsAndVali2[0];
        duration = _applyDefaultsAndVali2[1];
        end_time = _applyDefaultsAndVali2[2];


        if ((typeof start_state === 'undefined' ? 'undefined' : (0, _typeof3.default)(start_state)) !== 'object') {
            throw 'expected an object for start_state but got ' + start_state;
        }
        if (exactlyOneIsUndefined(delta_state, end_state)) {
            if ((typeof delta_state === 'undefined' ? 'undefined' : (0, _typeof3.default)(delta_state)) === 'object') {
                var missing_key = (0, _util.findMissingKey)(delta_state, start_state, false);
                if (missing_key !== null) {
                    throw 'found key ' + missing_key + ' in delta_state but not start_state';
                }
            } else if ((typeof end_state === 'undefined' ? 'undefined' : (0, _typeof3.default)(end_state)) === 'object') {
                var _missing_key = (0, _util.findMissingKey)(start_state, end_state, true);
                if (_missing_key !== null) {
                    throw 'found key ' + _missing_key + ' in one of ' + '(start_state, end_state) but not the other';
                }
            } else {
                var msg = 'expected one of (delta_state, end_state) as object, ' + ('but got (' + delta_state + ', ' + end_state + ')');
                throw msg;
            }

            var _computeTheOther15 = computeTheOther(start_state, delta_state, end_state);

            var _computeTheOther16 = (0, _slicedToArray3.default)(_computeTheOther15, 2);

            delta_state = _computeTheOther16[0];
            end_state = _computeTheOther16[1];
        } else {
            var _msg = 'expected one of (delta_state, end_state) as object, ' + ('but got (' + delta_state + ', ' + end_state + ')');
            throw _msg;
        }
    } catch (err) {
        throw 'Invalid call to Style w/path \'' + path + '\': ' + err;
    }

    var tick_funcs = (0, _util.mapObj)(delta_state, function (key) {
        return tick_func({
            duration: duration,
            start_state: start_state[key],
            delta_state: delta_state[key],
            end_state: end_state[key],
            curve: curve,
            unit: unit
        });
    });
    var delta_keys = (0, _keys2.default)(delta_state);
    var tick = function tick(time_elapsed) {
        return (0, _util.mapObj)(start_state, function (key) {
            if (delta_keys.includes(key)) {
                return tick_funcs[key](time_elapsed);
            }
            return start_state[key];
        });
    };

    return Animate({
        path: path,
        start_time: start_time,
        duration: duration,
        end_time: end_time,
        start_state: start_state,
        delta_state: delta_state,
        end_state: end_state,
        curve: curve,
        unit: unit,
        tick: tick,
        merge: true
    });
};

var AnimateCSS = exports.AnimateCSS = function AnimateCSS(_ref5) {
    var name = _ref5.name,
        path = _ref5.path,
        start_time = _ref5.start_time,
        end_time = _ref5.end_time,
        duration = _ref5.duration,
        _ref5$curve = _ref5.curve,
        curve = _ref5$curve === undefined ? 'linear' : _ref5$curve;


    try {
        var _applyDefaultsAndVali3 = applyDefaultsAndValidateTimes(start_time, duration, end_time);

        var _applyDefaultsAndVali4 = (0, _slicedToArray3.default)(_applyDefaultsAndVali3, 3);

        start_time = _applyDefaultsAndVali4[0];
        duration = _applyDefaultsAndVali4[1];
        end_time = _applyDefaultsAndVali4[2];
    } catch (err) {
        throw 'Invalid call to AnimateCSS w/path \'' + path + '\': ' + err;
    }

    var start_state = {
        name: name,
        duration: duration,
        curve: curve,
        delay: 0,
        playState: 'paused'
    };
    var end_state = (0, _extends3.default)({}, start_state, {
        delay: duration
    });
    return Animate({
        type: 'CSS_' + (name ? name.toUpperCase() : 'END'),
        path: path + '/style/animation/' + name,
        start_time: start_time,
        end_time: end_time,
        duration: duration,
        curve: curve,
        start_state: start_state,
        end_state: end_state,
        delta_state: { delay: duration },
        tick: function tick(time_elapsed) {
            if (time_elapsed <= 0) {
                return start_state;
            } else if (time_elapsed >= duration) {
                return end_state;
            } else {
                return (0, _extends3.default)({}, start_state, { delay: time_elapsed });
            }
        }
    });
};

var Translate = exports.Translate = function Translate(_ref6) {
    var path = _ref6.path,
        start_time = _ref6.start_time,
        end_time = _ref6.end_time,
        duration = _ref6.duration,
        start_state = _ref6.start_state,
        end_state = _ref6.end_state,
        delta_state = _ref6.delta_state,
        _ref6$curve = _ref6.curve,
        curve = _ref6$curve === undefined ? 'linear' : _ref6$curve,
        _ref6$unit = _ref6.unit,
        unit = _ref6$unit === undefined ? 'px' : _ref6$unit;


    var translate_throw = function translate_throw(msg) {
        throw 'Invalid call to Translate w/path \'' + path + '\': ' + msg;
    };

    try {
        var _applyDefaultsAndVali5 = applyDefaultsAndValidateTimes(start_time, duration, end_time);

        var _applyDefaultsAndVali6 = (0, _slicedToArray3.default)(_applyDefaultsAndVali5, 3);

        start_time = _applyDefaultsAndVali6[0];
        duration = _applyDefaultsAndVali6[1];
        end_time = _applyDefaultsAndVali6[2];
    } catch (err) {
        translate_throw(err);
    }

    if (!exactlyOneIsUndefined(delta_state, end_state)) {
        translate_throw('expected exactly one of (delta_state, end_state) to be defined');
    }
    if ((typeof start_state === 'undefined' ? 'undefined' : (0, _typeof3.default)(start_state)) !== 'object') {
        translate_throw('expected an object for start_state but got ' + start_state);
    }
    if ((0, _keys2.default)(start_state).length === 0) {
        translate_throw('passed in an empty start_state!');
    }
    var expected_keys = ['top', 'left', 'bottom', 'right'];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(start_state)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            if (!expected_keys.includes(key)) {
                translate_throw('passed in key ' + key + ' to translate. Should be one of ' + '(\'top\', \'left\', \'bottom\', \'right\')');
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

    if (delta_state === undefined) {
        if ((typeof end_state === 'undefined' ? 'undefined' : (0, _typeof3.default)(end_state)) !== 'object') {
            translate_throw('expected an object for end_state but got ' + end_state);
        }
        var missing_key = (0, _util.findMissingKey)(end_state, start_state, true);
        if (missing_key !== null) {
            translate_throw('found key ' + missing_key + ' in one of (start_state, end_state) but not both');
        }
    } else {
        if ((typeof delta_state === 'undefined' ? 'undefined' : (0, _typeof3.default)(delta_state)) !== 'object') {
            translate_throw('expected an object for delta_state but got ' + delta_state);
        }
        var _missing_key2 = (0, _util.findMissingKey)(delta_state, start_state, true);
        if (_missing_key2 !== null) {
            translate_throw('found key ' + _missing_key2 + ' in one of (start_state, delta_state) but not both');
        }
    }

    var _computeTheOther17 = computeTheOther(start_state, delta_state, end_state);

    var _computeTheOther18 = (0, _slicedToArray3.default)(_computeTheOther17, 2);

    delta_state = _computeTheOther18[0];
    end_state = _computeTheOther18[1];


    path = path + '/style/transform/translate';
    var type = 'TRANSLATE';

    var animation = { type: type, path: path, start_time: start_time, end_time: end_time, duration: duration,
        start_state: start_state, end_state: end_state, delta_state: delta_state, curve: curve, unit: unit };

    var left_tick = tick_func({
        duration: duration,
        curve: curve,
        unit: unit,
        start_state: start_state['left'],
        delta_state: delta_state['left'],
        end_state: end_state['left']
    });
    var top_tick = tick_func({
        duration: duration,
        curve: curve,
        unit: unit,
        start_state: start_state['top'],
        delta_state: delta_state['top'],
        end_state: end_state['top']
    });

    animation.tick = function (time_elapsed) {
        return {
            left: left_tick(time_elapsed),
            top: top_tick(time_elapsed)
        };
    };
    return Animate(animation);
};

var Opacity = exports.Opacity = function Opacity(_ref7) {
    var path = _ref7.path,
        start_time = _ref7.start_time,
        end_time = _ref7.end_time,
        duration = _ref7.duration,
        start_state = _ref7.start_state,
        end_state = _ref7.end_state,
        delta_state = _ref7.delta_state,
        _ref7$curve = _ref7.curve,
        curve = _ref7$curve === undefined ? 'linear' : _ref7$curve,
        _ref7$unit = _ref7.unit,
        unit = _ref7$unit === undefined ? null : _ref7$unit;

    var opacity_throw = function opacity_throw(msg) {
        throw 'Invalid call to Opacity w/path \'' + path + '\': ' + msg;
    };
    try {
        var _applyDefaultsAndVali7 = applyDefaultsAndValidateTimes(start_time, duration, end_time);

        var _applyDefaultsAndVali8 = (0, _slicedToArray3.default)(_applyDefaultsAndVali7, 3);

        start_time = _applyDefaultsAndVali8[0];
        duration = _applyDefaultsAndVali8[1];
        end_time = _applyDefaultsAndVali8[2];
    } catch (err) {
        opacity_throw(err);
    }

    if (typeof start_state !== 'number') {
        opacity_throw('expceted a number for start_state but got ' + start_state);
    }
    if (!exactlyOneIsUndefined(end_state, delta_state)) {
        translate_throw('expected exactly one of (delta_state, end_state) to be defined');
    }
    if (end_state === undefined) {
        if (typeof delta_state !== 'number') {
            opacity_throw('expceted a number for delta_state but got ' + delta_state);
        }
    } else {
        if (typeof end_state !== 'number') {
            opacity_throw('expceted a number for end_state but got ' + end_state);
        }
    }

    var _computeTheOther19 = computeTheOther(start_state, delta_state, end_state);

    var _computeTheOther20 = (0, _slicedToArray3.default)(_computeTheOther19, 2);

    delta_state = _computeTheOther20[0];
    end_state = _computeTheOther20[1];


    if (start_state < 0 || start_state > 1) {
        opacity_throw('expected a start_state in the range of [0, 1], but got ' + start_state);
    }
    if (end_state < 0 || end_state > 1) {
        opacity_throw('expected a end_state in the range of [0, 1], but got ' + end_state);
    }

    return Animate({
        type: 'OPACITY',
        path: path + '/style/opacity',
        start_time: start_time,
        end_time: end_time,
        duration: duration,
        start_state: start_state,
        end_state: end_state,
        delta_state: delta_state,
        curve: curve,
        unit: unit
    });
};

var Rotate = exports.Rotate = function Rotate(_ref8) {
    var path = _ref8.path,
        start_time = _ref8.start_time,
        end_time = _ref8.end_time,
        duration = _ref8.duration,
        start_state = _ref8.start_state,
        end_state = _ref8.end_state,
        delta_state = _ref8.delta_state,
        _ref8$curve = _ref8.curve,
        curve = _ref8$curve === undefined ? 'linear' : _ref8$curve,
        _ref8$unit = _ref8.unit,
        unit = _ref8$unit === undefined ? 'deg' : _ref8$unit;


    var rotate_throw = function rotate_throw(msg) {
        throw 'Invalid call to Rotate w/path \'' + path + '\': ' + msg;
    };
    try {
        var _applyDefaultsAndVali9 = applyDefaultsAndValidateTimes(start_time, duration, end_time);

        var _applyDefaultsAndVali10 = (0, _slicedToArray3.default)(_applyDefaultsAndVali9, 3);

        start_time = _applyDefaultsAndVali10[0];
        duration = _applyDefaultsAndVali10[1];
        end_time = _applyDefaultsAndVali10[2];
    } catch (err) {
        rotate_throw(err);
    }

    if (typeof start_state !== 'number') {
        rotate_throw('expceted a number for start_state but got ' + start_state);
    }
    if (!exactlyOneIsUndefined(end_state, delta_state)) {
        translate_throw('expected exactly one of (delta_state, end_state) to be defined');
    }
    if (end_state === undefined) {
        if (typeof delta_state !== 'number') {
            rotate_throw('expceted a number for delta_state but got ' + delta_state);
        }
    } else {
        if (typeof end_state !== 'number') {
            rotate_throw('expceted a number for end_state but got ' + end_state);
        }
    }

    var _computeTheOther21 = computeTheOther(start_state, delta_state, end_state);

    var _computeTheOther22 = (0, _slicedToArray3.default)(_computeTheOther21, 2);

    delta_state = _computeTheOther22[0];
    end_state = _computeTheOther22[1];


    return Animate({
        type: 'ROTATE',
        path: path + '/style/transform/rotate',
        start_time: start_time,
        end_time: end_time,
        duration: duration,
        start_state: start_state,
        end_state: end_state,
        delta_state: delta_state,
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

    if (start_time === undefined) start_time = Date.now();
    var repeated_tick = function repeated_tick(time_elapsed) {
        return tick((0, _util.mod)(time_elapsed, duration));
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
    var _tick2 = animation.tick,
        start_time = animation.start_time,
        duration = animation.duration;

    if (start_time === undefined) start_time = Date.now();
    return (0, _extends3.default)({}, animation, {
        start_time: end_time,
        end_time: start_time,
        tick: function tick(time_elapsed) {
            return _tick2(duration - time_elapsed);
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
    if (start_time === undefined) start_time = Date.now();
    var seq = [];
    var last_end = start_time;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = (0, _getIterator3.default)(animations), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var animation = _step2.value;

            seq.push((0, _extends3.default)({}, animation, {
                start_time: last_end,
                end_time: last_end + animation.duration
            }));
            last_end = animation.duration == Infinity ? last_end + 1 : last_end + animation.duration;
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
