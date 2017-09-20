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

var AnimRow = function AnimRow(anim, idx, scale) {
    var type = anim.type,
        start_time = anim.start_time,
        end_time = anim.end_time;


    var style = {
        position: 'absolute',
        top: idx * 25 % (COMPONENT_HEIGHT - 70),
        left: offset(start_time) / scale,
        height: 20,
        width: end_time !== Infinity ? (end_time - start_time) / scale : 10,
        backgroundColor: type.includes('BECOME') ? 'gray' : 'red',
        border: 'solid 1px black',
        overflow: 'hidden'
    };

    return (0, _jsx3.default)('div', {
        className: 'anim',
        style: style
    }, void 0, type, (0, _jsx3.default)('br', {}), (0, _jsx3.default)('div', {
        className: 'anim_details'
    }, void 0, 'Start time: ', '' + anim.start_time, (0, _jsx3.default)('br', {}), 'End time: ', '' + anim.end_time, (0, _jsx3.default)('br', {}), 'Start state: ', (0, _stringify2.default)(anim.start_state), (0, _jsx3.default)('br', {}), 'End state: ', (0, _stringify2.default)(anim.end_state), (0, _jsx3.default)('br', {}), 'Curve: ', '' + anim.curve, (0, _jsx3.default)('br', {})));
};

var CurrentFrame = function CurrentFrame(_ref) {
    var warped_time = _ref.warped_time,
        scale = _ref.scale;


    var style = {
        position: 'absolute',
        top: COMPONENT_HEIGHT - 70,
        left: offset(warped_time) / scale - 1,
        height: 20,
        color: 'blue'
    };

    return (0, _jsx3.default)('div', {
        style: style
    }, void 0, '|');
};

var TimelineComponent = function (_React$Component) {
    (0, _inherits3.default)(TimelineComponent, _React$Component);

    function TimelineComponent(props) {
        (0, _classCallCheck3.default)(this, TimelineComponent);

        var _this = (0, _possibleConstructorReturn3.default)(this, (TimelineComponent.__proto__ || (0, _getPrototypeOf2.default)(TimelineComponent)).call(this, props));

        _this.state = {
            scale: 50
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

            return (0, _jsx3.default)(_monadicalReactComponents.ExpandableSection, {
                name: 'Animations Timeline',
                source: debug && SOURCE,
                expanded: true
            }, void 0, (0, _jsx3.default)('style', {}, void 0, '\n                .anim_details {\n                    display: none;\n                }\n\n                .anim:hover .anim_details {\n                    display: inline-block;\n                }\n                .anim:hover {\n                    min-width: 200px !important;\n                    height: auto !important;\n                    z-index: 1001;\n                }\n                .section-animations-timeline{\n                    z-index: 1;\n                }\n\n                '), (0, _jsx3.default)('div', {
                style: { width: '100%', height: 'auto', postion: 'relative' }
            }, void 0, (0, _jsx3.default)('div', {
                style: { width: '70%', display: 'block',
                    marginLeft: 'auto', marginRight: 'auto' }
            }, void 0, 'Zoom \uD83D\uDD0D', (0, _jsx3.default)('input', {
                type: 'range',
                min: '0',
                max: '50',
                step: '0.5',
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
                    overflow: 'scroll', position: 'relative' }
            }, void 0, (0, _jsx3.default)('div', {
                style: { position: 'relative' }
            }, void 0, queue.map(function (anim, idx) {
                return AnimRow(anim, idx, _this2.state.scale);
            }), (0, _jsx3.default)(CurrentFrame, {
                warped_time: warped_time,
                scale: this.state.scale
            }))));
        }
    }]);
    return TimelineComponent;
}(_react2.default.Component);

var mapStateToProps = function mapStateToProps(_ref2) {
    var animations = _ref2.animations;
    return {
        queue: animations.queue,
        warped_time: animations.warped_time,
        former_time: animations.former_time
    };
};

var AnimationTimeline = exports.AnimationTimeline = (0, _reactRedux.connect)(mapStateToProps)(TimelineComponent);
