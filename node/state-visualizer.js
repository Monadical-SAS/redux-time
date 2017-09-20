'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AnimationStateVisualizer = exports.AnimationStateVisualizerComponent = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _jsx2 = require('babel-runtime/helpers/jsx');

var _jsx3 = _interopRequireDefault(_jsx2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _util = require('./util.js');

var _monadicalReactComponents = require('monadical-react-components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SOURCE = "https://github.com/Monadical-SAS/redux-time/blob/master/state-visualizer.js";

var AnimationList = function AnimationList(_ref) {
    var animations = _ref.animations,
        _ref$verbose = _ref.verbose,
        verbose = _ref$verbose === undefined ? true : _ref$verbose,
        style = _ref.style;
    return (0, _jsx3.default)('table', {
        style: (0, _extends3.default)({ width: '100%', minWidth: '1500px', fontSize: '85%', overflow: 'scroll' }, style || {})
    }, void 0, (0, _jsx3.default)('tbody', {}, void 0, (0, _jsx3.default)('tr', {
        style: { borderBottom: '1px solid #f0f0f0', lineHeight: '20px', fontWeight: 900 }
    }, void 0, (0, _jsx3.default)('td', {}, void 0, 'Type'), (0, _jsx3.default)('td', {}, void 0, 'Path'), (0, _jsx3.default)('td', {}, void 0, 'Start'), verbose ? (0, _jsx3.default)('td', {}, void 0, 'End') : null, (0, _jsx3.default)('td', {}, void 0, 'Duration'), verbose ? (0, _jsx3.default)('td', {}, void 0, 'From State') : null, (0, _jsx3.default)('td', {}, void 0, 'To State')), animations.map(function (anim) {
        return (0, _jsx3.default)('tr', {}, void 0, (0, _jsx3.default)('td', {}, void 0, anim.type), (0, _jsx3.default)('td', {}, void 0, '/', anim.path.split('/').slice(-1)[0]), (0, _jsx3.default)('td', {}, void 0, Math.round(anim.start_time)), verbose ? (0, _jsx3.default)('td', {}, void 0, Math.round(anim.end_time)) : null, (0, _jsx3.default)('td', {}, void 0, Math.round(anim.duration)), verbose ? (0, _jsx3.default)('td', {}, void 0, anim.start_state !== undefined ? (0, _stringify2.default)(anim.start_state) : '') : null, (0, _jsx3.default)('td', {}, void 0, anim.end_state !== undefined ? (0, _stringify2.default)(anim.end_state) : (0, _stringify2.default)(anim.state)));
    })));
};

var AnimationStateVisualizerComponent = exports.AnimationStateVisualizerComponent = function AnimationStateVisualizerComponent(_ref2) {
    var animations = _ref2.animations,
        path = _ref2.path,
        expanded = _ref2.expanded,
        _ref2$debug = _ref2.debug,
        debug = _ref2$debug === undefined ? false : _ref2$debug;
    var queue = animations.queue,
        warped_time = animations.warped_time,
        former_time = animations.former_time;

    var active_anims = (0, _util.activeAnimations)({ anim_queue: queue, warped_time: warped_time, former_time: former_time });

    var past_anims = (0, _util.pastAnimations)({ anim_queue: queue, warped_time: warped_time });
    var current_anims = (0, _util.currentAnimations)({ anim_queue: queue, warped_time: warped_time, former_time: former_time });
    var future_anims = (0, _util.futureAnimations)({ anim_queue: queue, warped_time: warped_time });

    var col_style = { width: '32.5%', display: 'inline-block', verticalAlign: 'top' };

    return (0, _jsx3.default)(_monadicalReactComponents.ExpandableSection, {
        name: 'State Visualizer',
        source: debug && SOURCE,
        expanded: expanded
    }, void 0, (0, _jsx3.default)('pre', {
        height: '200',
        style: { width: '98%', display: 'inline-block', verticalAlign: 'top', textAlign: 'left', overflow: 'scroll' }
    }, void 0, (0, _jsx3.default)('b', {}, void 0, 'Active Animations (', active_anims.length, ')'), (0, _jsx3.default)('br', {}), (0, _jsx3.default)(AnimationList, {
        animations: active_anims,
        style: { width: '100%' }
    })), (0, _jsx3.default)('pre', {
        height: '200',
        style: col_style
    }, void 0, (0, _jsx3.default)('b', {}, void 0, 'Past (', past_anims.length, ')'), (0, _jsx3.default)('br', {}), (0, _jsx3.default)(AnimationList, {
        animations: past_anims,
        verbose: false
    })), (0, _jsx3.default)('pre', {
        height: '200',
        style: col_style
    }, void 0, (0, _jsx3.default)('b', {}, void 0, 'Current (', current_anims.length, ')'), (0, _jsx3.default)('br', {}), (0, _jsx3.default)(AnimationList, {
        animations: current_anims,
        verbose: false
    })), (0, _jsx3.default)('pre', {
        height: '200',
        style: col_style
    }, void 0, (0, _jsx3.default)('b', {}, void 0, 'Future (', future_anims.length, ')'), (0, _jsx3.default)('br', {}), (0, _jsx3.default)(AnimationList, {
        animations: future_anims,
        verbose: false
    })), (0, _jsx3.default)('pre', {
        height: '200',
        style: { textAlign: 'left' }
    }, void 0, (0, _jsx3.default)('b', {}, void 0, 'Animated State ', path ? '(animations.state.' + path + ')' : ''), (0, _jsx3.default)('br', {}), (0, _stringify2.default)(path ? animations.state[path] : animations.state, null, 4)));
};

var mapStateToProps = function mapStateToProps(_ref3) {
    var animations = _ref3.animations;
    return {
        animations: animations
    };
};

var AnimationStateVisualizer = exports.AnimationStateVisualizer = (0, _reactRedux.connect)(mapStateToProps)(AnimationStateVisualizerComponent);
