'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AnimationTimeline = undefined;

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _jsx2 = require('babel-runtime/helpers/jsx');

var _jsx3 = _interopRequireDefault(_jsx2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _monadicalReactComponents = require('monadical-react-components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SOURCE = "https://github.com/Monadical-SAS/redux-time/blob/master/es6/timeline.js";
var COMPONENT_HEIGHT = 320;

var page_start_time = Date.now();

var offset = function offset(time) {
    return time - page_start_time;
};

var getCssProperty = function getCssProperty(elmId, property) {
    var elem = document.getElementById(elmId);
    return elem ? window.getComputedStyle(elem, null).getPropertyValue(property) : 0;
};

var current_width = function current_width() {
    var elem = document.getElementById("animations_container");
    return elem ? elem.getBoundingClientRect().width : 1;
};

var current_frame_position = function current_frame_position() {
    var left_property = getCssProperty("current_frame", "left");
    var left = typeof left_property === "number" ? left_property : Number(left_property.replace("px", ""));
    return left;
};

var AnimRow = function AnimRow(_ref) {
    var anim = _ref.anim,
        idx = _ref.idx,
        scale = _ref.scale,
        warped_time = _ref.warped_time;
    var type = anim.type,
        start_time = anim.start_time,
        end_time = anim.end_time;


    var is_infinite = end_time === Infinity;
    var left = offset(start_time) / scale;
    var warped_time_left = offset(warped_time) / scale;

    var width = current_width();
    width = warped_time_left < width ? width - left : warped_time_left - left;

    var style = {
        position: 'absolute',
        top: idx * 27 % (COMPONENT_HEIGHT - 70),
        left: left,
        height: 20,
        width: is_infinite ? width : (end_time - start_time) / scale,
        zIndex: is_infinite ? 0 : 1,
        backgroundColor: type.includes('BECOME') ? 'gray' : 'red',
        border: 'solid 1px black',
        overflow: 'hidden'
    };

    var className = is_infinite ? "infinite" : "";

    return (0, _jsx3.default)('div', {
        className: 'anim ' + className,
        style: style
    }, void 0, type, (0, _jsx3.default)('br', {}), (0, _jsx3.default)('div', {
        className: 'anim_details'
    }, void 0, 'Start time: ', '' + anim.start_time, (0, _jsx3.default)('br', {}), 'End time: ', '' + anim.end_time, (0, _jsx3.default)('br', {}), 'Start state: ', (0, _stringify2.default)(anim.start_state, null, 1), (0, _jsx3.default)('br', {}), 'End state: ', (0, _stringify2.default)(anim.end_state, null, 1), (0, _jsx3.default)('br', {}), 'Curve: ', '' + anim.curve, (0, _jsx3.default)('br', {})));
};

var CurrentFrame = function CurrentFrame(_ref2) {
    var warped_time = _ref2.warped_time,
        scale = _ref2.scale;


    var style = {
        position: 'absolute',
        top: 10,
        left: offset(warped_time) / scale - 1,
        height: 280,
        width: 1,
        zIndex: 2,
        backgroundColor: 'blue'
    };

    return (0, _jsx3.default)('div', {
        id: 'current_frame',
        style: style
    });
};

var SecondsMarker = function SecondsMarker(_ref3) {
    var scale = _ref3.scale;

    var seconds = [];
    var second_in_pixels = 1000 / scale;
    var total = current_width();
    for (var incr = second_in_pixels; incr < total; incr = incr + second_in_pixels) {
        seconds.push((0, _jsx3.default)('span', {
            style: { left: incr, position: "absolute" }
        }, void 0, '|', Math.round(incr / second_in_pixels)));
    }
    return (0, _jsx3.default)('div', {
        style: { width: total,
            position: "relative",
            top: COMPONENT_HEIGHT - 40 }
    }, void 0, seconds);
};

var TimelineComponent = function (_React$Component) {
    (0, _inherits3.default)(TimelineComponent, _React$Component);

    function TimelineComponent(props) {
        (0, _classCallCheck3.default)(this, TimelineComponent);

        var _this = (0, _possibleConstructorReturn3.default)(this, (TimelineComponent.__proto__ || (0, _getPrototypeOf2.default)(TimelineComponent)).call(this, props));

        _this.state = {
            scale: 25
        };
        return _this;
    }

    (0, _createClass3.default)(TimelineComponent, [{
        key: 'changeScale',
        value: function changeScale(new_scale) {
            this.setState({
                scale: 50 - new_scale
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                queue = _props.queue,
                warped_time = _props.warped_time,
                debug = _props.debug;

            var anim_list = [];
            var container_width = 0;
            for (var idx = 0; idx < queue.length; idx++) {
                anim_list.push((0, _jsx3.default)(AnimRow, {
                    anim: queue[idx],
                    idx: idx,
                    scale: this.state.scale,
                    warped_time: warped_time
                }));
                var end_time = queue[idx].end_time;
                if (end_time !== Infinity) {
                    var last_time = offset(end_time) / this.state.scale;
                    container_width = last_time > container_width ? last_time : container_width;
                }
            }
            var frame_position = current_frame_position();
            if (frame_position > container_width) {
                container_width = frame_position;
            }

            return (0, _jsx3.default)(_monadicalReactComponents.ExpandableSection, {
                name: 'Animations Timeline',
                source: debug && SOURCE,
                expanded: true
            }, void 0, (0, _jsx3.default)('style', {}, void 0, '\n                .anim_details {\n                    display: none;\n                }\n\n                .anim:hover .anim_details {\n                    display: inline-block;\n                }\n                .anim:hover {\n                    height: auto !important;\n                    z-index: 10 !important;\n                }\n                .anim:hover:not(.infinite){\n                    min-width: 200px !important;\n                }\n                .section-animations-timeline{\n                    z-index: 1;\n                }\n\n                '), (0, _jsx3.default)('div', {
                style: { width: '100%', height: 'auto', postion: 'relative' }
            }, void 0, (0, _jsx3.default)('div', {
                style: { width: '70%', display: 'block',
                    marginLeft: 'auto', marginRight: 'auto' }
            }, void 0, 'Zoom \uD83D\uDD0D', (0, _jsx3.default)('input', {
                type: 'range',
                min: '0',
                max: '50',
                step: '0.1',
                onChange: function onChange(e) {
                    return _this2.changeScale(Number(e.target.value));
                },
                value: 50 - this.state.scale,
                style: {
                    height: '10px', display: 'block',
                    width: "100%"
                }
            }))), (0, _jsx3.default)('div', {
                style: { width: '100%', height: COMPONENT_HEIGHT + 'px',
                    overflowX: 'scroll', position: 'relative' }
            }, void 0, (0, _jsx3.default)('div', {
                id: 'animations_container',
                style: {
                    position: 'relative',
                    width: container_width,
                    minWidth: "100%"
                }
            }, void 0, anim_list, (0, _jsx3.default)(CurrentFrame, {
                warped_time: warped_time,
                scale: this.state.scale
            }), (0, _jsx3.default)(SecondsMarker, {
                scale: this.state.scale
            }))));
        }
    }]);
    return TimelineComponent;
}(_react2.default.Component);

var mapStateToProps = function mapStateToProps(_ref4) {
    var animations = _ref4.animations;
    return {
        queue: animations.queue,
        warped_time: animations.warped_time,
        former_time: animations.former_time
    };
};

var AnimationTimeline = exports.AnimationTimeline = (0, _reactRedux.connect)(mapStateToProps)(TimelineComponent);
