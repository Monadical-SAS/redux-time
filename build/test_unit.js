'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.run_unit_tests = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _util = require('./util.js');

var _animations = require('./animations.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var run_unit_tests = exports.run_unit_tests = function run_unit_tests() {

    (0, _util.assertEqual)((0, _util.nested_key)(0, 2, 2), '/0/0');
    (0, _util.assertEqual)((0, _util.nested_key)(1, 2, 2), '/0/1');
    (0, _util.assertEqual)((0, _util.nested_key)(2, 2, 2), '/1/2');
    (0, _util.assertEqual)((0, _util.nested_key)(3, 2, 2), '/1/3');
    (0, _util.assertEqual)((0, _util.nested_key)(4, 2, 2), '/0/0');

    (0, _util.assertEqual)((0, _util.nested_key)(15, 2, 1), '/1');
    (0, _util.assertEqual)((0, _util.nested_key)(15, 2, 2), '/1/3');
    (0, _util.assertEqual)((0, _util.nested_key)(15, 2, 3), '/1/3/7');
    (0, _util.assertEqual)((0, _util.nested_key)(15, 2, 4), '/1/3/7/15');
    (0, _util.assertEqual)((0, _util.nested_key)(15, 2, 5), '/0/1/3/7/15');
    (0, _util.assertEqual)((0, _util.nested_key)(15, 2, 6), '/0/0/1/3/7/15');

    (0, _util.assertEqual)((0, _util.nested_key)(15, 3, 3), '/1/5/15');

    ///////////////
    // Util tests
    var sort = function sort(x) {
        return x;
    };

    (0, _util.assertSortedObjsInOrder)([{ 0: 0 }, { 1: 1 }, { 2: 2 }], sort, [0, 1, 2]);

    var sort2 = function sort2(x) {
        var output = [].concat((0, _toConsumableArray3.default)(x));
        output.reverse();
        return output;
    };
    (0, _util.assertSortedObjsInOrder)([{ 0: 0 }, { 1: 1 }, { 2: 2 }], sort2, [2, 1, 0]);

    var animation_queue = [(0, _animations.Become)({
        path: '/danny_devito',
        state: 0,
        start_time: 0
    }), (0, _animations.Animate)({
        path: '/danny_devito',
        start_state: 1,
        end_state: 1,
        start_time: 50,
        end_time: 60
    }), (0, _animations.Animate)({
        path: '/danny_devito',
        start_state: 2,
        end_state: 2,
        start_time: 60,
        end_time: 70
    }), (0, _animations.Animate)({
        path: '/danny_devito',
        start_state: 3,
        end_state: 3,
        start_time: 65,
        end_time: 75
    })];

    // 3 is the last in the list, and is active @ warped_time
    var active_q = (0, _util.activeAnimations)({
        anim_queue: animation_queue,
        former_time: 64,
        warped_time: 66
    });
    (0, _util.assert)(active_q.pop().start_state == 3, 'Animation 3 should take precedence');

    // 3 is last in the list, but 2 is @ warped_time
    active_q = (0, _util.activeAnimations)({
        anim_queue: animation_queue,
        former_time: 71,
        warped_time: 60
    });
    (0, _util.assert)(active_q.pop().start_state == 2, 'Animation 2 should take precedence');

    // none of the animations take precedence over the BECOME. they all ended.
    active_q = (0, _util.activeAnimations)({
        anim_queue: animation_queue,
        former_time: 50,
        warped_time: 76
    });
    (0, _util.assert)(active_q.pop().start_state == 0, 'Animation 0 should take precedence');

    // same thing, but without the become gets Animation 3 in its last frame
    active_q = (0, _util.activeAnimations)({
        anim_queue: animation_queue.slice(1),
        former_time: 50,
        warped_time: 76
    });
    (0, _util.assert)(active_q.pop().start_state == 3, 'Animation 3 should take precedence');

    ///////////////
    // ANIMATION UNIQUIFICATION
    var anim_queue = [{ path: '/a/b' }, { path: '/a/b/c/d' }, { path: '/a/b/c/d/e' }, { path: '/a/b/f' }, { path: '/a/b' }, { path: '/a/b/x' }, { path: '/a/b/x/y' }, { path: '/a/b/x' }];

    var uniq_anims = (0, _util.uniqueAnimations)(anim_queue);
    (0, _util.assert)(uniq_anims.length == 2, 'uniqueAnimations did not remove overwritten child paths');
    (0, _util.assert)(uniq_anims[0].path == '/a/b' && uniq_anims[1].path == '/a/b/x', 'uniqueAnimations removed wrong parent/child paths');

    ///////////////
    // test immutify
    var immutable_obj = (0, _util.immutify)({ a: 1, b: 2 });
    (0, _util.assertThrows)(function () {
        immutable_obj.a = 5;
    });

    ///////////////
    // test computeTheOther on objects
    var start_state = {
        a: 0,
        b: 10
    };
    var delta_state = {
        a: 10,
        b: -10
    };
    var end_state = {
        a: 10,
        b: 0
    };

    var _computeTheOther = (0, _animations.computeTheOther)(start_state, undefined, end_state),
        _computeTheOther2 = (0, _slicedToArray3.default)(_computeTheOther, 2),
        calc_delta = _computeTheOther2[0],
        calc_end = _computeTheOther2[1];

    (0, _util.assertEqual)(calc_delta, delta_state);
    (0, _util.assertEqual)(calc_end, end_state);

    var _computeTheOther3 = (0, _animations.computeTheOther)(start_state, delta_state, undefined),
        _computeTheOther4 = (0, _slicedToArray3.default)(_computeTheOther3, 2),
        calc_delta2 = _computeTheOther4[0],
        calc_end2 = _computeTheOther4[1];

    (0, _util.assertEqual)(calc_delta2, delta_state);
    (0, _util.assertEqual)(calc_end2, end_state);

    ///////////////
    // Test Become
    var become1 = (0, _animations.Become)({
        path: '/abc/def',
        state: 'testme'
    });

    // end and delta states are always null
    (0, _util.assertEqual)(become1.end_state, null);
    (0, _util.assertEqual)(become1.delta_state, null);
    // start_time defaults to now()
    (0, _util.assert)(Date.now() - become1.start_time < 10);
    // duration & end_time default to Infinity
    (0, _util.assertEqual)(become1.duration, Infinity);
    (0, _util.assertEqual)(become1.end_time, Infinity);
    // state is calculated correctly
    (0, _util.assertEqual)((0, _util.computeAnimatedState)({ animations: [become1], warped_time: Date.now() + 1 }), { abc: { def: 'testme' } });

    // can define end_time or duration, not both
    (0, _util.assertThrows)(function () {
        return (0, _animations.Become)({
            path: '/a',
            state: 1,
            start_time: 10,
            end_time: 11,
            duration: 5
        });
    });

    // note: these are invariants across all Animate-types
    // cannot go backwards in time
    (0, _util.assertThrows)(function () {
        return (0, _animations.Become)({ path: '/r', state: 1, start_time: 10, end_time: 9 });
    });
    // trailing slashes not allowed
    (0, _util.assertThrows)(function () {
        return (0, _animations.Become)({ path: '/p/', state: 1 });
    });

    ///////////////
    // Test Style

    // exactly one of (delta_state, end_state) must be defined
    (0, _util.assertThrows)(function () {
        return (0, _animations.Style)({
            path: '/x',
            start_state: { a: 1 },
            delta_state: { a: 1 },
            end_state: { a: 2 }
        });
    });
    (0, _util.assertThrows)(function () {
        return (0, _animations.Style)({
            path: '/v',
            start_state: { a: 1 }
        });
    });

    // all provided states must be of type Object
    (0, _util.assertThrows)(function () {
        return (0, _animations.Style)({
            path: '/j',
            start_state: { a: 0 },
            delta_state: 100
        });
    });
    // start_state and end_state must have the same schema
    (0, _util.assertThrows)(function () {
        return (0, _animations.Style)({
            path: '/y',
            start_state: { a: 1 },
            end_state: { a: 2, b: 3 }
        });
    });

    // delta_state must not have any keys not present in start_state
    (0, _util.assertThrows)(function () {
        return (0, _animations.Style)({
            path: '/n',
            start_state: { a: 1, b: 0, c: 5 },
            delta_state: { a: 2, b: 3, d: 10 }
        });
    });
    // merges instead of overwriting
    var original_style = (0, _animations.Become)({
        path: '/qw/b',
        start_time: 0,
        state: 0
    });
    var restyle = (0, _animations.Style)({
        path: '/qw',
        start_time: 0,
        end_time: 1000,
        start_state: { top: 0, left: 0 },
        end_state: { top: 100, left: -100 },
        unit: ''
    });

    (0, _util.assertEqual)((0, _util.computeAnimatedState)({
        animations: [original_style, restyle],
        warped_time: 500
    }), { qw: { style: { top: 50, left: -50 }, b: 0 } });
    // it is possible to define a subset of keys in start_state for delta_state
    var restyle2 = (0, _animations.Style)({
        path: '/qw',
        start_time: 100,
        end_time: 200,
        start_state: { top: 0, left: 0 },
        delta_state: { top: 100 },
        unit: ''
    });
    (0, _util.assertEqual)((0, _util.computeAnimatedState)({
        animations: [original_style, restyle2],
        warped_time: 0
    }), { qw: { b: 0 } });
    (0, _util.assertEqual)((0, _util.computeAnimatedState)({
        animations: [original_style, restyle2],
        warped_time: 100
    }), { qw: { style: { top: 0, left: 0 }, b: 0 } });

    (0, _util.assertEqual)((0, _util.computeAnimatedState)({
        animations: [original_style, restyle2],
        warped_time: 150
    }), { qw: { style: { top: 50, left: 0 }, b: 0 } });
    (0, _util.assertEqual)((0, _util.computeAnimatedState)({
        animations: [original_style, restyle2],
        warped_time: 200,
        former_time: 199
    }), { qw: { style: { top: 100, left: 0 }, b: 0 } });

    ///////////////
    // Test AnimateCSS

    var css_animation = (0, _animations.AnimateCSS)({
        path: '/q',
        name: 'flipInX'
    });

    var default_start = Date.now();
    // defaults to starting now, with 1000 duration
    (0, _util.assert)(default_start - css_animation.start_time < 5);
    (0, _util.assert)(default_start + 1000 - css_animation.end_time < 5);

    css_animation = (0, _animations.AnimateCSS)({
        path: '/jj',
        name: 'flipInX',
        start_time: default_start,
        end_time: default_start + 1000
    });

    (0, _util.assertEqual)((0, _util.computeAnimatedState)({
        animations: [css_animation],
        warped_time: default_start + 0
    }), { jj: { style: { animation: 'flipInX 1000ms linear -' + 0 + 'ms paused' } } });

    (0, _util.assertEqual)((0, _util.computeAnimatedState)({
        animations: [css_animation],
        warped_time: default_start + 500
    }), { jj: { style: { animation: 'flipInX 1000ms linear -' + 500 + 'ms paused' } } });

    (0, _util.assertEqual)((0, _util.computeAnimatedState)({
        animations: [css_animation],
        warped_time: default_start + 1000
    }), { jj: { style: { animation: 'flipInX 1000ms linear -' + 1000 + 'ms paused' } } });

    ///////////////
    // Test Translate

    // all states must be objects
    (0, _util.assertThrows)(function () {
        return (0, _animations.Translate)({
            path: '/mandela',
            start_state: 10,
            end_state: 20,
            duration: 500
        });
    });
    // all states must have one of (top, left, bottom, right) as keys
    (0, _util.assertThrows)(function () {
        return (0, _animations.Translate)({
            path: '/napoleon',
            start_state: {},
            end_state: {},
            duration: 500
        });
    });
    // only (top, left, bottom, right) are allowed keys
    (0, _util.assertThrows)(function () {
        return (0, _animations.Translate)({
            path: '/cleopatra',
            start_state: { top: 10, something_else: 20 },
            end_state: { top: 10, something_else: 50 },
            duration: 500
        });
    });
    // all states must have the same schema
    (0, _util.assertThrows)(function () {
        return (0, _animations.Translate)({
            path: '/ghandi',
            start_state: { top: 10, left: 20 },
            delta_state: { top: 10, right: 50 },
            duration: 500
        });
    });
    (0, _util.assertThrows)(function () {
        return (0, _animations.Translate)({
            path: '/franklin',
            start_state: { top: 10, left: 20 },
            end_state: { top: 10, right: 50 },
            duration: 500
        });
    });
    // exactly one of delta_state, end_state must be defined
    (0, _util.assertThrows)(function () {
        return (0, _animations.Translate)({
            path: '/charlemagne',
            start_state: { top: 10, left: 20 },
            delta_state: { top: 10, left: 10 },
            end_state: { top: 20, left: 30 },
            duration: 500
        });
    });
    (0, _util.assertThrows)(function () {
        return (0, _animations.Translate)({
            path: '/catherine',
            start_state: { top: 10, left: 20 },
            duration: 500
        });
    });

    var bounce = (0, _animations.RepeatSequence)([(0, _animations.Translate)({
        path: '/round_thing',
        start_state: { top: 0, left: 0 },
        end_state: { top: -200, left: 0 },
        duration: 500
    }), (0, _animations.Translate)({
        path: '/round_thing',
        start_state: { top: -200, left: 0 },
        end_state: { top: 0, left: 0 },
        duration: 500
    })], 10, 0);
    var translateObj = function translateObj(left, top) {
        return {
            style: {
                transform: 'translate(' + left + 'px, ' + top + 'px)'
            }
        };
    };
    (0, _util.assertEqual)((0, _util.computeAnimatedState)({ animations: bounce, warped_time: 250 }), { round_thing: translateObj(0, -100) });
    (0, _util.assertEqual)((0, _util.computeAnimatedState)({ animations: bounce, warped_time: 1250 }), { round_thing: translateObj(0, -100) });
    (0, _util.assertEqual)((0, _util.computeAnimatedState)({ animations: bounce, warped_time: 500 }), { round_thing: translateObj(0, -200) });
    (0, _util.assertEqual)((0, _util.computeAnimatedState)({ animations: bounce, warped_time: 1500 }), { round_thing: translateObj(0, -200) });

    ///////////////
    // Test Opacity

    // all states must be numbers between 0 and 1 inclusive
    (0, _util.assertThrows)(function () {
        return (0, _animations.Opacity)({
            path: '/soulcalibur',
            start_state: 0,
            end_state: 'giraffe',
            duration: 500
        });
    });
    (0, _util.assertThrows)(function () {
        return (0, _animations.Opacity)({
            path: '/diablo',
            start_state: 1.5,
            end_state: 0.25,
            start_time: 0,
            duration: 500
        });
    });
    (0, _util.assertThrows)(function () {
        return (0, _animations.Opacity)({
            path: '/halo',
            start_state: 1,
            end_state: -1,
            start_time: 0,
            duration: 500
        });
    });

    var fade = (0, _animations.Opacity)({
        path: '/civ',
        start_state: 0.5,
        end_state: 0,
        start_time: 0,
        duration: 500
    });
    (0, _util.assertEqual)((0, _util.computeAnimatedState)({ animations: [fade], warped_time: 0 }), { civ: { style: { opacity: 0.5 } } });
    (0, _util.assertEqual)((0, _util.computeAnimatedState)({ animations: [fade], warped_time: 250 }), { civ: { style: { opacity: 0.25 } } });
    (0, _util.assertEqual)((0, _util.computeAnimatedState)({ animations: [fade], warped_time: 500, former_time: 499 }), { civ: { style: { opacity: 0 } } });

    ///////////////
    // Test Rotate

    // all states must be numbers
    (0, _util.assertThrows)(function () {
        return (0, _animations.Rotate)({
            path: '/cow',
            start_state: 0,
            end_state: 'giraffe',
            duration: 500
        });
    });
    (0, _util.assertThrows)(function () {
        return (0, _animations.Rotate)({
            path: '/pig',
            start_state: 1.5,
            delta_state: 'banana',
            start_time: 0,
            duration: 500
        });
    });

    var fidget_spinner = (0, _animations.Rotate)({
        path: '/monkey',
        start_state: 0,
        end_state: 720,
        start_time: 0,
        duration: 100
    });
    (0, _util.assertEqual)((0, _util.computeAnimatedState)({ animations: [fidget_spinner], warped_time: 0 }), { monkey: { style: { transform: 'rotate(' + 0 + 'deg)' } } });
    (0, _util.assertEqual)((0, _util.computeAnimatedState)({ animations: [fidget_spinner], warped_time: 50 }), { monkey: { style: { transform: 'rotate(' + 360 + 'deg)' } } });
    (0, _util.assertEqual)((0, _util.computeAnimatedState)({ animations: [fidget_spinner], warped_time: 100, former_time: 99 }), { monkey: { style: { transform: 'rotate(' + 720 + 'deg)' } } });

    // on all animations:
    //     - start_time must be < end_time
    //     - paths should never have a trailing slash

    // Become
    //     - end_state and delta_state are null
    //     - start_time is Date.now() as default
    //     - duration & end_time are Infinity by default
    //     - computeAnimatedState at any time after start_time == start_state
    // Style
    //     - start and exactly one of (delta_state, end_state) must be defined
    //     - all provided states must be Object
    //     - end_state must have the same schema as start_state
    //     - delta_state must not have any keys not present in start_state
    //     - merging works correctly
    //     - computeAnimatedState assertions at 0, duration, and somewhere in middle
    // AnimateCSS
    //     - defaults to starting now, with 1000 duration
    //     - computeAnimatedState assertions at 0, duration, and somewhere in middle
    // Translate
    //     - start and exactly one of (delta_state, end_state) must be defined
    //     - all provided states must be Object
    //     - all provided states have one more of (top, left, bottom, right) and the same schema
    //     - computeAnimatedState assertions at 0, duration, and somewhere in middle
    // Opacity
    //     - start and exactly one of (delta_state, end_state) must be defined
    //     - all provided states must be Number between 0 and 1 (inclusive)
    //     - computeAnimatedState assertions at 0, duration, and somewhere in middle
    // Rotate
    //     - start and exactly one of (delta_state, end_state) must be defined
    //     - all provided states must be Number
    //     - computeAnimatedState assertions at 0, duration, and somewhere in middle


    process.exit(0);
};
