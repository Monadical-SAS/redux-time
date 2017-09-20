'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AnimationControls = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _warpedTime = require('warped-time');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(_ref) {
    var animations = _ref.animations;
    return {
        speed: animations.speed,
        warped_time: animations.warped_time,
        former_time: animations.former_time
    };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        setWarpedTime: function setWarpedTime(warped_time) {
            dispatch({ type: 'SET_WARPED_TIME', warped_time: warped_time });
        },
        setSpeed: function setSpeed(speed) {
            dispatch({ type: 'SET_SPEED', speed: speed });
        }
    };
};

var AnimationControls = exports.AnimationControls = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_warpedTime.TimeControlsComponent);
