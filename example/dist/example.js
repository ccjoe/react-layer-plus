require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var ReactDOM = require('react-dom');
var ReactLayer = require('react-layer-plus');

var App = (function (_Component) {
    _inherits(App, _Component);

    function App(props) {
        _classCallCheck(this, App);

        _get(Object.getPrototypeOf(App.prototype), 'constructor', this).call(this, props);
        this.state = {
            offset: {}, //position
            show: false,
            value: '',
            formElementShow: false,
            formElementValue: 'Init Form Element Value'
        };
    }

    _createClass(App, [{
        key: 'onClick',
        value: function onClick() {}
    }, {
        key: 'onClickA',
        value: function onClickA() {}
    }, {
        key: 'onClickB',
        value: function onClickB() {
            this.setState({ formElementValue: '有效区域 (autoHide)', formElementShow: false });
        }
    }, {
        key: 'onClickC',
        value: function onClickC() {
            this.setState({ formElementValue: '有效区域 (not autoHide)', formElementShow: true });
        }
    }, {
        key: 'render',
        value: function render() {
            var _state = this.state;
            var formElementShow = _state.formElementShow;
            var show = _state.show;

            return _react2['default'].createElement(
                'div',
                { className: 'demo-list clearfix' },
                _react2['default'].createElement(
                    'pre',
                    { className: 'demo-code' },
                    '\n* ReactLayer 组件上的事件由组件自己已处理显隐，使用本组件仅需要处理ReactLayer内children上自己业务需要的事件与显隐\n* props.target [string targetId]: layer show by [eventIn] target\n* props.eventIn  {eventName}         show trigger by eventIn\n* props.eventOut {optional eventName} hide trigger by eventOut form element needn\'t eventOut\n* props.show     {optional boolean}\n* props.onPreBlur {callback function}\n* ReactLayer.eventInner {static boolean}   get or set the event trigger by ReactLayer Inner or Outer\n'
                ),
                _react2['default'].createElement('br', null),
                _react2['default'].createElement('hr', null),
                _react2['default'].createElement(
                    'h3',
                    null,
                    'Have a try'
                ),
                _react2['default'].createElement('hr', null),
                _react2['default'].createElement(
                    'div',
                    { className: 'demo-item' },
                    _react2['default'].createElement(
                        'h5',
                        null,
                        'relate target with Form element'
                    ),
                    _react2['default'].createElement(
                        'h6',
                        null,
                        'form Element ReactLayer didnot need eventOut, and eventOut is defined with \'blur\''
                    ),
                    _react2['default'].createElement(
                        'h6',
                        null,
                        'if u want to autoHide, need define prop \'show\', and ctrl by yourself  '
                    ),
                    _react2['default'].createElement('input', { id: 'formElement', value: this.state.formElementValue, onChange: function () {} }),
                    _react2['default'].createElement(
                        ReactLayer,
                        { eventIn: 'click', target: 'formElement', show: formElementShow },
                        _react2['default'].createElement(
                            'div',
                            { style: { backgroundColor: '#fff', 'border': '1px solid #ccc', padding: 10 } },
                            _react2['default'].createElement(
                                'button',
                                null,
                                'click空白区域'
                            ),
                            _react2['default'].createElement('br', null),
                            _react2['default'].createElement(
                                'button',
                                { onClick: this.onClickA.bind(this) },
                                '无效区域'
                            ),
                            _react2['default'].createElement('br', null),
                            _react2['default'].createElement(
                                'button',
                                { onClick: this.onClickB.bind(this) },
                                '有效区域 (autoHide)'
                            ),
                            _react2['default'].createElement('br', null),
                            _react2['default'].createElement(
                                'button',
                                { onClick: this.onClickC.bind(this) },
                                '有效区域 (not autoHide)'
                            ),
                            _react2['default'].createElement('br', null)
                        )
                    )
                ),
                _react2['default'].createElement(
                    'div',
                    { className: 'demo-item' },
                    _react2['default'].createElement(
                        'h5',
                        null,
                        'relate target with Form common element'
                    ),
                    _react2['default'].createElement(
                        'span',
                        { id: 'commonElement', value: this.state.value },
                        'Common Element'
                    ),
                    _react2['default'].createElement(
                        ReactLayer,
                        { eventIn: 'mouseover', eventOut: 'mouseleave', target: 'commonElement', show: show },
                        _react2['default'].createElement(
                            'div',
                            { style: { backgroundColor: '#fff', 'border': '1px solid #ccc' } },
                            _react2['default'].createElement(
                                'span',
                                { onClick: this.onClickA.bind(this) },
                                'a'
                            ),
                            _react2['default'].createElement('br', null),
                            _react2['default'].createElement(
                                'span',
                                null,
                                'b'
                            ),
                            _react2['default'].createElement('br', null),
                            _react2['default'].createElement(
                                'span',
                                null,
                                'c'
                            ),
                            _react2['default'].createElement('br', null),
                            _react2['default'].createElement(
                                'p',
                                null,
                                'test frame'
                            )
                        )
                    )
                )
            );
        }
    }]);

    return App;
})(_react.Component);

App.defaultProps = {};

ReactDOM.render(_react2['default'].createElement(App, null), document.getElementById('app'));

},{"react":undefined,"react-dom":undefined,"react-layer-plus":undefined}]},{},[1]);
