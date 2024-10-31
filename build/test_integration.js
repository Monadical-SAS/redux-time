'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.run_integration_tests = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _redux = require('redux');

var _main = require('./main.js');

var _util = require('./util.js');

var _animations = require('./animations.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var run_integration_tests = exports.run_integration_tests = function run_integration_tests() {

    // Animation tests
    var initial_state = {
        test: { text: 'initial_state' }
    };

    var testReducer = function testReducer() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initial_state.test;
        var action = arguments[1];

        switch (action.type) {
            default:
                return state;
        }
    };

    var store = (0, _redux.createStore)((0, _redux.combineReducers)({ test: testReducer, animations: _main.animationsReducer }), initial_state);
    (0, _util.assert)(store.getState().animations.warped_time == 0, 'Initial current_time should be 0.');

    // ANIMATION HANDLER SETUP
    var handler = new _main.AnimationsHandler({
        store: store,
        frameLoop: function frameLoop(func) {
            return setTimeout(function () {
                return func();
            }, 20);
        }
    });

    (0, _util.assert)(handler.store.getState().test.text == store.getState().test.text && handler.store.getState().test.text == initial_state.test.text, 'Initial state is wrong');

    // WARPED TIME SETUP
    (0, _util.assert)(handler.store.getState().animations.speed == 1, 'Initial animation speed should be 1.');
    (0, _util.assert)(handler.store.getState().animations.warped_time == 0, 'warped_time before first TICK should be 0.');
    handler.store.dispatch({
        type: 'TICK',
        warped_time: handler.time.getWarpedTime(),
        former_time: handler.time.getWarpedTime() - 16
    });
    (0, _util.assert)(handler.store.getState().animations.warped_time > 0, 'warped_time after first TICK should be > 0.');

    handler.store.dispatch({ type: 'SET_SPEED', speed: 2 });
    (0, _util.assert)(handler.store.getState().animations.speed == 2, 'Animation speed was not set after SET_SPEED.');

    // INITIAL STATE SETUP
    (0, _util.assert)(handler.store.getState().test.text == store.getState().test.text && handler.store.getState().test.text == initial_state.test.text, 'Initial state is wrong');

    (0, _util.assert)(handler.store.getState().animations.queue.length == 0, 'Initial animation queue should be empty.');
    (0, _util.assert)((0, _stringify2.default)(handler.store.getState().animations.state) == '{}', 'Initial animation state should be empty.');

    var start_time = handler.time.getWarpedTime();

    // ADDING STATE CHANGES
    handler.store.dispatch({
        type: 'ANIMATE',
        animation: (0, _animations.Become)({ path: '/test/text', state: '2nd state', start_time: start_time })
    });
    (0, _util.assert)(handler.store.getState().animations.queue.length == 1, 'Animation was not added to queue.');

    // RUNNING STATE CHANGES
    handler.store.dispatch({
        type: 'TICK',
        warped_time: start_time + 1,
        former_time: start_time
    });
    (0, _util.assert)(handler.store.getState().animations.state.test.text == '2nd state', '2nd State was not set after Become.');
    handler.store.dispatch({
        type: 'TICK',
        warped_time: start_time + 2,
        former_time: start_time
    });
    (0, _util.assert)(handler.store.getState().animations.state.test.text == '2nd state', '2nd State was not consistent after Become.');

    // OVERLAPPING STATE CHANGES
    handler.store.dispatch({
        type: 'ANIMATE',
        animation: (0, _animations.Become)({
            path: '/test/text',
            state: '3rd state',
            start_time: start_time + 3
        })
    });
    (0, _util.assert)(handler.store.getState().animations.queue.length == 2, 'Animation was not added to queue.');

    handler.store.dispatch({
        type: 'TICK',
        warped_time: start_time + 4,
        former_time: start_time
    });
    (0, _util.assert)(handler.store.getState().animations.state.test.text == '3rd state', '3rd State was not reset after Become.');
    handler.store.dispatch({
        type: 'TICK',
        warped_time: start_time + 5,
        former_time: start_time
    });
    (0, _util.assert)(handler.store.getState().animations.state.test.text == '3rd state', '3rd State was not consistent after Become.');

    // ANIMATED STATE CHANGES
    handler.store.dispatch({
        type: 'ANIMATE',
        animation: (0, _animations.Animate)({
            path: '/test/text',
            start_state: 0,
            end_state: 100,
            start_time: start_time + 6,
            end_time: start_time + 1006
        })
    });
    (0, _util.assert)(handler.store.getState().animations.queue.length == 3, 'Animation was not added to queue.');
    handler.store.dispatch({
        type: 'TICK',
        former_time: start_time,
        warped_time: start_time + 7
    });
    (0, _util.assert)(handler.store.getState().animations.state.test.text > 0, 'Animations did not start correctly.');
    handler.store.dispatch({
        type: 'TICK',
        former_time: start_time,
        warped_time: start_time + 900
    });
    (0, _util.assert)(handler.store.getState().animations.state.test.text < 100, 'Animation moved too fast.');

    handler.store.dispatch({
        type: 'TICK',
        former_time: start_time + 1000,
        warped_time: start_time + 1005
    });
    (0, _util.assert)(handler.store.getState().animations.state.test.text > 99, 'Final animation state was not computed');

    handler.store.dispatch({
        type: 'TICK',
        former_time: start_time + 1006,
        warped_time: start_time + 1007
    });

    (0, _util.assert)(handler.store.getState().animations.state.test.text == '3rd state', 'State was not reset after animation finished.');

    // OVERLAPPING ANIMATED STATE CHANGES
    handler.store.dispatch({
        type: 'ANIMATE',
        animation: (0, _animations.Become)({
            path: '/test/text',
            state: 0,
            start_time: start_time + 2000
        })
    });
    handler.store.dispatch({
        type: 'ANIMATE',
        animation: (0, _animations.Animate)({
            path: '/test/text',
            start_state: 0,
            delta_state: 100,
            start_time: start_time + 2100,
            duration: 1000
        })
    });
    handler.store.dispatch({
        type: 'ANIMATE',
        animation: (0, _animations.Animate)({
            path: '/test/text',
            start_state: 200,
            delta_state: 100,
            start_time: start_time + 2200,
            duration: 2000
        })
    });
    handler.store.dispatch({
        type: 'ANIMATE',
        animation: (0, _animations.Animate)({
            path: '/test/text',
            start_state: 400,
            delta_state: 100,
            start_time: start_time + 2300,
            duration: 1000
        })
    });
    handler.store.dispatch({
        type: 'TICK',
        warped_time: start_time + 2050,
        former_time: start_time
    });
    (0, _util.assert)(handler.store.getState().animations.state.test.text == 0, 'State 0 was not applied after Become.');

    handler.store.dispatch({
        type: 'TICK',
        warped_time: start_time + 2150,
        former_time: start_time
    });
    (0, _util.assert)(handler.store.getState().animations.state.test.text > 0, '0-100 overlapping animation was not applied.');

    handler.store.dispatch({
        type: 'TICK',
        warped_time: start_time + 2250,
        former_time: start_time
    });
    (0, _util.assert)(handler.store.getState().animations.state.test.text > 200, '200-300 overlapping animation was not applied.');

    handler.store.dispatch({
        type: 'TICK',
        warped_time: start_time + 2350,
        former_time: start_time
    });
    (0, _util.assert)(handler.store.getState().animations.state.test.text > 400, '400-500 overlapping animation was not applied.');

    handler.store.dispatch({
        type: 'TICK',
        warped_time: start_time + 3500,
        former_time: start_time
    });
    (0, _util.assert)(handler.store.getState().animations.state.test.text < 300, '400-500 overlapping animation was not unapplied after it finished.');

    handler.store.dispatch({
        type: 'TICK',
        warped_time: start_time + 4500,
        former_time: start_time
    });
    (0, _util.assert)(handler.store.getState().animations.state.test.text == 0, 'State did not revert to 0 after all animations finished.');

    // REPEATED ANIMATIONS
    handler.store.dispatch({
        type: 'ANIMATE',
        animation: (0, _animations.Repeat)((0, _animations.Animate)({
            path: '/test/text',
            start_state: 600,
            delta_state: 100,
            start_time: start_time + 5000,
            duration: 200
        }), 5)
    });

    handler.store.dispatch({
        type: 'TICK',
        warped_time: start_time + 5050,
        former_time: start_time
    });
    (0, _util.assert)(handler.store.getState().animations.state.test.text > 600, 'State 600-700 was not animated.');

    handler.store.dispatch({
        type: 'TICK',
        warped_time: start_time + 5500,
        former_time: start_time
    });
    (0, _util.assert)(handler.store.getState().animations.state.test.text > 600, 'State 600-700 did not repeat.');

    handler.store.dispatch({
        type: 'TICK',
        warped_time: start_time + 6050,
        former_time: start_time
    });
    (0, _util.assert)(handler.store.getState().animations.state.test.text == 0, 'State did not revert to 0 after repeated animation.');

    // RUNLOOP MECHANICS
    handler.store.dispatch({
        type: 'ANIMATE',
        animation: (0, _animations.Animate)({
            path: '/test/text',
            start_state: 600,
            delta_state: 100,
            start_time: start_time + 8000,
            duration: 200
        })
    });
    var queue = handler.store.getState().animations.queue;

    var current_animations = (0, _util.currentAnimations)({
        anim_queue: queue,
        warped_time: start_time + 7000
    });
    (0, _util.assert)(current_animations.length > 0, 'currentAnimations was empty despite queued infinite animations.');

    (0, _util.assert)((0, _util.uniqueAnimations)(queue).length > 0, 'uniqueAnimations was empty despite multiple unique animations.');

    (0, _util.assert)(handler.animating, 'animation runloop was not running despite queued animations.');

    // FULL INTEGRATION TEST

    handler.store.dispatch({ type: 'CLEAR_ANIMATIONS' });
    (0, _util.assert)(handler.store.getState().animations.queue.length == 0, 'Animation queue failed to clear after CLEAR_ANIMATIONS.');
    (0, _util.assert)((0, _stringify2.default)(handler.store.getState().animations.state) == '{}', 'Animation state failed to clear after CLEAR_ANIMATIONS.');

    var seq = [(0, _animations.Become)({
        path: '/test/text',
        start_time: start_time + 9000,
        state: 'integration test'
    }), (0, _animations.Translate)({
        path: '/test',
        start_time: start_time + 9000,
        duration: 1000,
        start_state: { top: 100, left: 100 },
        end_state: { top: 200, left: 200 }
    }), (0, _animations.Opacity)({
        path: '/test',
        start_time: start_time + 9000,
        duration: 1000,
        start_state: 0,
        end_state: 1
    }), (0, _animations.Rotate)({
        path: '/test',
        start_time: start_time + 9000,
        duration: 1000,
        start_state: 0,
        end_state: 360
    }), (0, _animations.Become)({
        path: '/test/text',
        start_time: start_time + 10000,
        state: null
    })];
    seq.map(function (animation) {
        return handler.store.dispatch({ type: 'ANIMATE', animation: animation });
    });
    queue = handler.store.getState().animations.queue;

    var new_current_animations = (0, _util.currentAnimations)({
        anim_queue: queue,
        warped_time: start_time + 9001
    });

    (0, _util.assert)(new_current_animations.length == seq.length - 1, 'Queue was not the right length after adding several animations.');

    new_current_animations = (0, _util.currentAnimations)({
        anim_queue: queue,
        warped_time: start_time + 20000
    });
    (0, _util.assert)((0, _util.uniqueAnimations)(new_current_animations).length == 1, 'Unique current queue was not the right length after animations finished.');

    handler.store.dispatch({
        type: 'TICK',
        warped_time: start_time + 9001,
        former_time: start_time
    });
    (0, _util.assert)(handler.store.getState().animations.state.test.style.transform.indexOf('translate(') != -1, 'Translate animation failed to change style left state.');
    (0, _util.assert)(handler.store.getState().animations.state.test.style.opacity > 0, 'Opacity animation failed to change style opacity state.');
    (0, _util.assert)(handler.store.getState().animations.state.test.style.transform.indexOf('rotate(') != -1, 'Rotate animation failed to change style rotation state.');

    handler.store.dispatch({
        type: 'TICK',
        warped_time: start_time + 10002,
        former_time: start_time + 10001
    });
    (0, _util.assert)(!handler.store.getState().animations.state.test.style, 'Animations left some dirty style state after completing.');
};
