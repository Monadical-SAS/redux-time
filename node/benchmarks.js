'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _animations = require('./animations.js');

var _util = require('./util.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//  create objects
var create_objects = function create_objects(n, branching_factor, depth) {
    return (0, _util.range)(n).map(function (i) {
        return (0, _animations.Become)({
            path: (0, _util.nested_key)(i, branching_factor, depth),
            state: {
                left: n - i,
                top: i
            },
            start_time: i
        });
    });
};

//  move +100x, +100y
var move_objects = function move_objects(n, branching_factor, depth) {
    return (0, _util.range)(n).map(function (i) {
        return (0, _animations.Translate)({
            path: (0, _util.nested_key)(i, branching_factor, depth),
            start_state: {
                left: n - i,
                top: i
            },
            end_state: {
                left: n - i + 100,
                top: i + 100
            },
            start_time: i,
            end_time: 1000 + i
        });
    });
};

//  rotate 180deg
var rotate_objects = function rotate_objects(n, branching_factor, depth) {
    return (0, _util.range)(n).map(function (i) {
        return (0, _animations.Rotate)({
            path: (0, _util.nested_key)(i, branching_factor, depth),
            start_state: 0,
            end_state: 180,
            start_time: i,
            end_time: 1000 + i
        });
    });
};

//  opacity -> 0%
var opacity_objects = function opacity_objects(n, branching_factor, depth) {
    return (0, _util.range)(n).map(function (i) {
        return (0, _animations.Opacity)({
            path: (0, _util.nested_key)(i, branching_factor, depth),
            start_state: 1,
            end_state: 0,
            start_time: i,
            end_time: 1000 + i
        });
    });
};

var full_anim_queue = function full_anim_queue(n, branching_factor, depth) {
    var n_anims = Math.floor(n / 4);
    return [].concat((0, _toConsumableArray3.default)(create_objects(n_anims, branching_factor, depth)), (0, _toConsumableArray3.default)(move_objects(n_anims, branching_factor, depth)), (0, _toConsumableArray3.default)(rotate_objects(n_anims, branching_factor, depth)), (0, _toConsumableArray3.default)(opacity_objects(n_anims, branching_factor, depth)));
};

var do_benchmark = function do_benchmark(n, branching_factor, depth, n_frames, print_state) {
    var full_queue = full_anim_queue(n, branching_factor, depth);
    var animated_state = void 0;
    if (print_state) {
        console.log({ full_queue: full_queue });
    }

    console.log('benchmarking ' + n + ' objects over ' + n_frames + ' frames');
    console.log('state has: branching_factor ' + branching_factor + ', depth ' + depth);
    var start_time = Date.now();
    for (var i = 0; i < n_frames; i++) {
        animated_state = (0, _util.computeAnimatedState)({
            animations: full_queue,
            warped_time: 500 + i
        });
    }
    console.log('\t' + (Date.now() - start_time) + ' milliseconds');
    console.log('\t' + 1000 / ((Date.now() - start_time) / n_frames) + ' FPS');

    if (print_state) {
        console.log(animated_state);
    }
};

do_benchmark(5, 5, 5, 50, false);
do_benchmark(50, 5, 5, 50, false);
do_benchmark(500, 5, 5, 50, false);
do_benchmark(5000, 5, 5, 50, false);

do_benchmark(5, 5, 3, 50, false);
do_benchmark(50, 5, 3, 50, false);
do_benchmark(500, 5, 3, 50, false);
do_benchmark(5000, 5, 3, 50, false);
