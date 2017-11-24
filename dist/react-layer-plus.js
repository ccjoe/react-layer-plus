(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ReactLayer = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var mixStyle = function mixStyle(offset) {
    return _extends({ position: 'absolute', zIndex: 100 }, offset);
};

var ReactLayer = (function (_Component) {
    _inherits(ReactLayer, _Component);

    /**
     * @memberof ReactLayer
     * ReactLayer 组件上的事件由组件自己已处理显隐，使用本组件仅需要处理InBody内children上自己业务需要的事件与显隐
     * props.target [string targetId]: layer show by [eventIn] target
     * props.eventIn  {eventName}         show trigger by eventIn
     * props.eventOut {optional eventName} hide trigger by eventOut form element needn't eventOut
     * props.show     {optional boolean}
     * props.onPreBlur {callback function}
     * ReactLayer.eventInner {static boolean}   get or set the event trigger by ReactLayer Inner or Outer
     */

    function ReactLayer(props) {
        _classCallCheck(this, ReactLayer);

        _get(Object.getPrototypeOf(ReactLayer.prototype), 'constructor', this).call(this, props);
        this.state = {
            offset: mixStyle(props.offset) || {}, //position
            show: props.show || false
        };
    }

    _createClass(ReactLayer, [{
        key: 'createBodyWrapper',
        value: function createBodyWrapper() {
            if (!this.hasBodyWrapper()) {
                this.popup = document.createElement('div');
                this.popup.className = this.props.className || 'in-body-wrapper';
                document.body.appendChild(this.popup);
            }
        }
    }, {
        key: 'hasBodyWrapper',
        value: function hasBodyWrapper() {
            return this.popup && document.body.getElementsByClassName(this.popup.className).length;
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.createBodyWrapper();
            if (this.state.show) this.renderLayer();
            if (!this.props.inline) {
                this.state.offset.width = this.props.children.clientWidth;
                this.setState(this.state);
            }
            var that = this;
            var target = that.getTarget();
            if (target) {
                target.addEventListener(that.props.eventIn, function () {
                    that.show(true);
                });
                if (that.props.eventIn === 'mouseover') {
                    target.addEventListener('mouseleave', function () {
                        that.timeId = setTimeout(function () {
                            that.show(false);
                        }, 200);
                    });
                }
                if (that.targetIsInput(target)) {
                    target.addEventListener('blur', function () {
                        if (!that.eventInner) {
                            that.setState({ show: false });
                        }
                    });
                }
            }
        }
    }, {
        key: 'show',
        value: function show(ok) {
            this.setState({ show: ok, offset: ok ? mixStyle(this.setPosition()) : {} });
        }
    }, {
        key: 'onMouseOver',
        value: function onMouseOver() {
            if (this.timeId) {
                clearTimeout(this.timeId);
            }
        }
    }, {
        key: 'onMouseDown',
        value: function onMouseDown() {
            var onPreBlur = this.props.onPreBlur;

            onPreBlur && onPreBlur();
            this.eventInner = true;
        }

        //InBody Wrapper Event, control refs and pane show
    }, {
        key: 'onClick',
        value: function onClick() {
            //触发区域为外部区域
            if (!this.eventInner) {
                this.setState({ show: false });
            } else {
                //触发区域为有效区域，但是无效操作时
                var target = this.getTarget();
                if (this.targetIsInput(target)) {
                    target.focus();
                }
            }
            this.eventInner = false;
        }
    }, {
        key: 'onMouseLeave',
        value: function onMouseLeave() {
            var target = this.getTarget();
            //触发元素为非表单元素时， 离开即关闭
            if (!this.targetIsInput(target)) {
                this.setState({ show: false });
            }
        }
    }, {
        key: 'targetIsInput',
        value: function targetIsInput(target) {
            return target.tagName.toLowerCase() === 'input';
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.show !== this.state.show) {
                this.show(nextProps.show);
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            this.state.show ? this.renderLayer() : this.removePicker();
        }
    }, {
        key: 'setPosition',
        value: function setPosition() {
            var _handlePosition = this.handlePosition();

            var left = _handlePosition.left;
            var top = _handlePosition.top;
            var height = _handlePosition.height;

            top += height + (document.body.scrollTop || document.documentElement.scrollTop);
            return { left: left, top: top };
        }
    }, {
        key: 'handlePosition',
        value: function handlePosition() {
            // Fix for IE8-'s Element.getBoundingClientRect()
            if ('TextRectangle' in window && !('width' in TextRectangle.prototype)) {
                Object.defineProperties(TextRectangle.prototype, {
                    'width': { get: function get() {
                            return this.right - this.left;
                        } },
                    'height': { get: function get() {
                            return this.bottom - this.top;
                        } }
                });
            }
            return this.getTarget().getBoundingClientRect();
        }
    }, {
        key: 'getTarget',
        value: function getTarget() {
            var target = this.props.target;var targetEl = null;
            if (typeof target === 'string') {
                targetEl = document.getElementById(target);
            } else {
                var reactTarget = typeof target === 'function' ? target() : target;
                targetEl = reactTarget && _reactDom2['default'].findDOMNode(reactTarget);
            }
            return targetEl;
        }
    }, {
        key: 'removePicker',
        value: function removePicker() {
            if (this.popup) {
                _reactDom2['default'].unmountComponentAtNode(this.popup);
                try {
                    document.body.removeChild(this.popup);
                } catch (e) {}
            }
        }
    }, {
        key: 'renderLayer',
        value: function renderLayer() {
            if (!this.hasBodyWrapper()) {
                this.createBodyWrapper();
            }
            if (this.props.children) {
                var childrenWithProps = _react2['default'].Children.map(this.props.children, function (child) {
                    return _react2['default'].cloneElement(child, {});
                }); //abc: this.state.offset
                var childWrapWithProps = _react2['default'].createElement(
                    'div',
                    { style: this.state.offset,
                        onClick: this.onClick.bind(this),
                        onMouseOver: this.onMouseOver.bind(this),
                        onMouseDown: this.onMouseDown.bind(this),
                        onMouseLeave: this.onMouseLeave.bind(this)
                    },
                    childrenWithProps
                );
                _reactDom2['default'].render(childWrapWithProps, this.popup);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return this.state.show && _react2['default'].createElement('div', { className: this.props.className, children: null });
        }
    }]);

    return ReactLayer;
})(_react.Component);

exports['default'] = ReactLayer;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"react-dom":undefined}]},{},[1])(1)
});