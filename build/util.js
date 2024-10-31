'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.computeAnimatedState = exports.activeAnimations = exports.uniqueAnimations = exports.futureAnimations = exports.pastAnimations = exports.finalFrameAnimations = exports.currentAnimations = exports.flattenStyles = exports.nested_key = exports.setDifference = exports.setIntersection = exports.flattened = exports.mapObj = exports.flipObj = exports.deepCopy = exports.range = exports.mod = exports.EasingFunctions = exports.checkIsValidSequence = exports.checkIsValidAnimation = exports.assertSortedObjsInOrder = exports.findMissingKey = exports.assertEqual = exports.assertThrows = exports.assert = exports.print = exports.immutify = undefined;

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.reversed = reversed;
exports.isBaseType = isBaseType;
exports.deepMerge = deepMerge;
exports.select = select;
exports.patch = patch;
exports.applyPatches = applyPatches;

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

var _lodash = require('lodash.isequal');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(reversed);

var immutify = exports.immutify = function immutify(obj) {
    return (0, _keys2.default)(obj).reduce(function (new_obj, key) {
        var val = obj[key];
        if (typeof val === 'function') {
            val.inspect = val.toString;
        }
        (0, _defineProperty2.default)(new_obj, key, {
            enumerable: true,
            configurable: false,
            writable: false,
            value: val
        });
        return new_obj;
    }, {});
};

var print = exports.print = function print(msg) {
    process ? process.stdout.write(msg) : console.log(msg);
};

var assert = exports.assert = function assert(val) {
    var error_msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    if (!val) {
        var call_stack = new Error().stack;
        print('[X] AssertionError: ' + error_msg + ' (' + val + ')');
        print(call_stack);
        process.exit(1);
    } else {
        process ? process.stdout.write('.') : console.log('.');
    }
};

var assertThrows = exports.assertThrows = function assertThrows(func) {
    try {
        func();
        assert(false, func.toString() + ' should have thrown an error');
    } catch (err) {
        assert(true);
    }
};

var assertEqual = exports.assertEqual = function assertEqual(val1, val2) {
    assert((0, _lodash2.default)(val1, val2), (0, _stringify2.default)(val1) + ' !== ' + (0, _stringify2.default)(val2));
};

var findMissingKey = exports.findMissingKey = function findMissingKey(obj1, obj2) {
    var both_ways = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(obj1)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            if (!(0, _keys2.default)(obj2).includes(key)) {
                return key;
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

    if (both_ways) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = (0, _getIterator3.default)((0, _keys2.default)(obj2)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _key = _step2.value;

                if (!(0, _keys2.default)(obj1).includes(_key)) {
                    return _key;
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
    }
    return null;
};

var assertSortedObjsInOrder = exports.assertSortedObjsInOrder = function assertSortedObjsInOrder(arr, sort_function, expected_order) {
    var arr_with_keys = arr.map(function (obj, idx) {
        return (0, _extends3.default)({}, obj, {
            idx: idx
        });
    });
    var sorted_objs = sort_function(arr_with_keys);
    var sorted_order = sorted_objs.map(function (obj) {
        return obj.idx;
    });
    expected_order.forEach(function (expected_idx, idx) {
        assertEqual(expected_idx, sorted_order[idx]);
    });
};

var checkIsValidAnimation = exports.checkIsValidAnimation = function checkIsValidAnimation(animation) {
    if (Array.isArray(animation)) {
        console.log('%cINVALID ANIMATION:', 'color:red', animation);
        console.log('Got an array instead of a single animation object, did you double-nest somthing by forgetting to use ...?');
        throw 'Animation must be passed in as a single Animation object!';
    }
    if (!(animation.type && animation.path)) {
        console.log('%cINVALID ANIMATION:', 'color:red', animation);
        console.log('Got unrecognized animation object missing a type or path.');
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
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = (0, _getIterator3.default)(animations), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var animation = _step3.value;

            checkIsValidAnimation(animation);
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

var mod = exports.mod = function mod(num, delta_state) {
    return (num % delta_state + delta_state) % delta_state;
};

var range = exports.range = function range(num) {
    return [].concat((0, _toConsumableArray3.default)(Array(num).keys()));
};

var deepCopy = exports.deepCopy = function deepCopy(obj) {
    return (0, _extend2.default)(true, {}, obj);
}; // TODO: remove jquery

var flipObj = exports.flipObj = function flipObj(obj) {
    return (0, _keys2.default)(obj).reduce(function (acc, key) {
        var val = obj[key];
        acc[val] = key;
        return acc;
    }, {});
};

// equivalent to {key: func(key, val) for key, val in obj.items()}
var mapObj = exports.mapObj = function mapObj(obj, func) {
    return (0, _keys2.default)(obj).reduce(function (acc, key) {
        acc[key] = func(key, obj[key]);
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
    }, _marked, this);
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

// uniformly populates a tree of size (branching_factor, depth)
//  used in benchmarks. see unit tests for examples
var nested_key = exports.nested_key = function nested_key(i, bf, d) {
    var l = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    // populates a tree uniformly. see tests below for examples
    if (l === 0) {
        return '';
    } else if (!l) {
        var cropped_i = i % Math.pow(bf, d);
        return nested_key(cropped_i, bf, d, d);
    } else {
        return nested_key(Math.floor(i / bf), bf, d, l - 1) + '/' + i;
    }
};

function select(obj, selector) {
    // ({a: {b: 2}}, '/a/b') => 2
    //  Get obj at specified addr (works with array indicies)
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
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
        for (var _iterator4 = (0, _getIterator3.default)(keys), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var key = _step4.value;

            if (obj === undefined) {
                return undefined;
            }
            obj = obj[key];
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

    return obj;
}

function patch(obj, selector, new_val) {
    var merge = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var mkpath = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    var deepcopy = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;

    // ({a: {b: 2}}, '/a/b', 4) => {a: {b: 4}}
    //  Set obj at specified addr (works with array indicies)
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
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
        for (var _iterator5 = (0, _getIterator3.default)(keys), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var key = _step5.value;

            // create path if any point is missing
            if (mkpath && (parent[key] === undefined || parent[key] === null) || isBaseType(parent[key], false)) {
                parent[key] = {};
            }
            parent = parent[key];
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

    if (merge) {
        parent[last_key] = deepMerge(parent[last_key], new_val);
    } else {
        parent[last_key] = new_val;
    }
    return deepcopy ? (0, _extend2.default)(true, {}, obj) : obj;
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
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
        for (var _iterator6 = (0, _getIterator3.default)((0, _keys2.default)(transform)), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var key = _step6.value;

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

    return css_transform_funcs.filter(Boolean).join(' ');
};

var flattenAnimation = function flattenAnimation(animation) {
    // WARNING: optimized code, do not convert to map() without profiling
    // flatten animations from a dict to a string
    // converts {style: {animations: {blinker: {name: blinker, duration: 1000, curve: 'linear', delay: 767}, ...}}}
    //      =>  {style: {animation: blinker 1000ms linear -767ms paused, ...}}

    var css_animation_funcs = [];
    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
        for (var _iterator7 = (0, _getIterator3.default)((0, _keys2.default)(animation)), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var key = _step7.value;

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

    return css_animation_funcs.filter(Boolean).join(', ');
};

var flattenIfNotFlattened = function flattenIfNotFlattened(state, path, flatten_func) {
    var state_slice = select(state, path);
    if (state_slice === undefined || state_slice === null) {
        // State no longer exists because it was overwritten by a later patch
        return;
    }
    if (typeof state_slice !== 'string') {
        patch(state, path, flatten_func(state_slice), false, false, false);
    }
};

var flattenStyles = exports.flattenStyles = function flattenStyles(state, paths_to_flatten) {
    // TODO: profile and see if this is slow

    // WARNING: optimized code, profile before changing anything
    // this converts the styles stored as dicts in the state tree, to the strings
    // that react components expect as CSS style values
    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
        for (var _iterator8 = (0, _getIterator3.default)(paths_to_flatten), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var path = _step8.value;

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

    return state;
};

var shouldFlatten = function shouldFlatten(split_path) {
    // check to see if a given path introduces some CSS state that needs
    // to be converted from an object to a css string, e.g.
    // {style: transform: translate: {top: 0, left: 0}}
    var style_key_pos = split_path.lastIndexOf('style');
    return style_key_pos != -1 && (split_path[style_key_pos + 1] == 'transform' || split_path[style_key_pos + 1] == 'animation');
};

function applyPatches(obj, patches) {
    var flatten_styles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    // WARNING: optimized code, profile before changing anything
    var output = {};
    var paths_to_flatten = [];

    // O(n) application of patches onto a single object
    var _iteratorNormalCompletion9 = true;
    var _didIteratorError9 = false;
    var _iteratorError9 = undefined;

    try {
        for (var _iterator9 = (0, _getIterator3.default)(patches), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
            var _patch = _step9.value;

            // deepcopy to prevent later patches from mutating previous object values
            var patch_val = _patch.value;
            if (patch_val !== null && (typeof patch_val === 'undefined' ? 'undefined' : (0, _typeof3.default)(patch_val)) === 'object') {
                // unfortunately this is not very optimizable since dont know
                // the structure beforehand. Do not use JSON.stringify+parse because
                // Date, function, and Infinity objects dont get safely converted.
                // jQuery is significantly faster than lodash cloneDeep
                patch_val = (0, _extend2.default)(true, {}, patch_val);
            }
            var keys = [].concat((0, _toConsumableArray3.default)(_patch.split_path));

            // record this path for later post-processing if it's a css transform or animation path
            if (flatten_styles && shouldFlatten(keys)) paths_to_flatten.push(keys);

            var final_key = keys.pop();
            // iterate down the path to the last object
            var parent = output;
            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
                for (var _iterator10 = (0, _getIterator3.default)(keys), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                    var key = _step10.value;

                    // create any level as an empty object if it doesn't exist yet
                    if (parent[key] === undefined || parent[key] === null || isBaseType(parent[key], false)) {
                        parent[key] = {};
                    }
                    parent = parent[key];
                }
                // update the parent of the last item to reference our new value
            } catch (err) {
                _didIteratorError10 = true;
                _iteratorError10 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion10 && _iterator10.return) {
                        _iterator10.return();
                    }
                } finally {
                    if (_didIteratorError10) {
                        throw _iteratorError10;
                    }
                }
            }

            parent[final_key] = patch_val;
        }

        // final post-processing to transform the special object values into
        // strings that css expects
    } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion9 && _iterator9.return) {
                _iterator9.return();
            }
        } finally {
            if (_didIteratorError9) {
                throw _iteratorError9;
            }
        }
    }

    if (flatten_styles) return flattenStyles(output, paths_to_flatten);

    return output;
}

var currentAnimations = exports.currentAnimations = function currentAnimations(_ref7) {
    var anim_queue = _ref7.anim_queue,
        warped_time = _ref7.warped_time;
    return anim_queue.filter(function (_ref8) {
        var start_time = _ref8.start_time,
            end_time = _ref8.end_time;

        var started_already = start_time <= warped_time;
        var has_not_ended = end_time > warped_time;
        return started_already && has_not_ended;
    });
};

var finalFrameAnimations = exports.finalFrameAnimations = function finalFrameAnimations(_ref9) {
    var anim_queue = _ref9.anim_queue,
        warped_time = _ref9.warped_time,
        former_time = _ref9.former_time;

    var is_between = function is_between(anim) {
        if (warped_time >= former_time) {
            // traveling forward in time or standing still
            return former_time <= anim.end_time && anim.end_time <= warped_time;
        } else {
            // traveling backward in time
            return warped_time <= anim.start_time && anim.start_time <= former_time;
        }
    };

    return anim_queue.filter(function (anim) {
        return is_between(anim);
    });
};

var pastAnimations = exports.pastAnimations = function pastAnimations(_ref10) {
    var anim_queue = _ref10.anim_queue,
        warped_time = _ref10.warped_time;
    return anim_queue.filter(function (_ref11) {
        var start_time = _ref11.start_time,
            duration = _ref11.duration;
        return start_time + duration < warped_time;
    });
};

var futureAnimations = exports.futureAnimations = function futureAnimations(_ref12) {
    var anim_queue = _ref12.anim_queue,
        warped_time = _ref12.warped_time;
    return anim_queue.filter(function (_ref13) {
        var start_time = _ref13.start_time,
            duration = _ref13.duration;
        return start_time > warped_time;
    });
};

// 0 /a /b /c       3
// 1 /a /b          2
// 2 /a /b /e /d    4

var parentExists = function parentExists(paths, path) {
    var parent = '';
    var _iteratorNormalCompletion11 = true;
    var _didIteratorError11 = false;
    var _iteratorError11 = undefined;

    try {
        for (var _iterator11 = (0, _getIterator3.default)(path.split('/').slice(1)), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
            var key = _step11.value;
            // O(path.length)
            parent = parent + '/' + key;
            if (paths.has(parent)) {
                return true;
            }
        }
    } catch (err) {
        _didIteratorError11 = true;
        _iteratorError11 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion11 && _iterator11.return) {
                _iterator11.return();
            }
        } finally {
            if (_didIteratorError11) {
                throw _iteratorError11;
            }
        }
    }

    return false;
};

var uniqueAnimations = exports.uniqueAnimations = function uniqueAnimations(anim_queue) {
    var paths = new _set2.default();
    var uniq_anims = [];

    var _iteratorNormalCompletion12 = true;
    var _didIteratorError12 = false;
    var _iteratorError12 = undefined;

    try {
        for (var _iterator12 = (0, _getIterator3.default)(reversed(anim_queue)), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
            var anim = _step12.value;
            // O(anim_que.length)
            if (!parentExists(paths, anim.path)) {
                uniq_anims.push(anim);
                paths.add(anim.path);
            }
        }
    } catch (err) {
        _didIteratorError12 = true;
        _iteratorError12 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion12 && _iterator12.return) {
                _iterator12.return();
            }
        } finally {
            if (_didIteratorError12) {
                throw _iteratorError12;
            }
        }
    }

    return uniq_anims.reverse();
};

var activeAnimations = exports.activeAnimations = function activeAnimations(_ref14) {
    var anim_queue = _ref14.anim_queue,
        warped_time = _ref14.warped_time,
        former_time = _ref14.former_time,
        uniqueify = _ref14.uniqueify;

    if (warped_time === undefined || former_time === undefined) {
        throw 'Both warped_time and former_time must be passed to get activeAnimations';
    }

    var anims = [].concat((0, _toConsumableArray3.default)(finalFrameAnimations({ anim_queue: anim_queue, former_time: former_time, warped_time: warped_time })), (0, _toConsumableArray3.default)(currentAnimations({ anim_queue: anim_queue, warped_time: warped_time })));

    if (uniqueify) return uniqueAnimations(anims);

    return anims;
};

var patchesFromAnimation = function patchesFromAnimation(animation, warped_time) {
    // console.log('patchesFromAnimation')
    // console.log({animation, warped_time})
    var patches = [];
    var delta = warped_time - animation.start_time;
    if (animation.merge) {
        var _patch2 = animation.tick(delta);
        (0, _keys2.default)(animation.start_state).forEach(function (key) {
            patches.push({
                split_path: [].concat((0, _toConsumableArray3.default)(animation.split_path), [key]),
                value: _patch2[key]
            });
        });
    } else {
        patches.push({
            split_path: animation.split_path,
            value: animation.tick(delta)
        });
    }
    return patches;
};

var computeAnimatedState = exports.computeAnimatedState = function computeAnimatedState(_ref15) {
    var animations = _ref15.animations,
        warped_time = _ref15.warped_time,
        _ref15$former_time = _ref15.former_time,
        former_time = _ref15$former_time === undefined ? null : _ref15$former_time;

    former_time = former_time === null ? warped_time : former_time;

    var active_animations = activeAnimations({ anim_queue: animations,
        warped_time: warped_time,
        former_time: former_time,
        uniqueify: false });
    var patches = [];
    // console.log({active_animations})
    var _iteratorNormalCompletion13 = true;
    var _didIteratorError13 = false;
    var _iteratorError13 = undefined;

    try {
        for (var _iterator13 = (0, _getIterator3.default)(active_animations), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
            var animation = _step13.value;

            if (global.DEBUG) try {
                patches = [].concat((0, _toConsumableArray3.default)(patches), (0, _toConsumableArray3.default)(patchesFromAnimation(animation, warped_time)));
            } catch (e) {
                console.log(animation.type, 'Animation tick function threw an exception:', e.stack, animation);
            } else {
                patches = [].concat((0, _toConsumableArray3.default)(patches), (0, _toConsumableArray3.default)(patchesFromAnimation(animation, warped_time)));
            }
        }
    } catch (err) {
        _didIteratorError13 = true;
        _iteratorError13 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion13 && _iterator13.return) {
                _iterator13.return();
            }
        } finally {
            if (_didIteratorError13) {
                throw _iteratorError13;
            }
        }
    }

    return applyPatches({}, patches);
};
