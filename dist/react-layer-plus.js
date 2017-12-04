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

var ReactLayer = (function (_Component) {
    _inherits(ReactLayer, _Component);

    /**
     * @memberof ReactLayer
     * ReactLayer 组件上的事件由组件自己已处理显隐，使用本组件仅需要处理InBody内children上自己业务需要的事件与显隐
     * props.target [string targetId]: layer show by [eventIn] target
     * props.eventIn  {eventName}         show trigger by eventIn
     * //if eventIn is mouseover, eventOut mouseleave default
     * //if target is form element ,eventOut is blur default
     * props.eventOut {optional eventName} hide trigger by eventOut form element needn't eventOut
     * props.show     {optional boolean}
     * props.onPreBlur {callback function}
     * props.onEventIn {callback function}
     * props.onEventOut {callback function}
     * props.placement {string} default 'bottom-left'  left right top bottom top-left bottom-left top-right bottom-right
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
                this.popup.className = 'layer-wrapper';
                // this.popup.refid = this.props.target
                document.body.appendChild(this.popup);
            }
        }
    }, {
        key: 'hasBodyWrapper',
        value: function hasBodyWrapper() {
            var popupExist = this.popup && this.popup.className && document.body.getElementsByClassName(this.popup.className);
            if (this.popup && popupExist.length) {
                if (this.popup.children.length) {
                    return true;
                }
                document.body.removeChild(popupExist[0]);
            }
            return false;
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.createBodyWrapper();

            var _props = this.props;
            var inline = _props.inline;
            var eventIn = _props.eventIn;
            var eventOut = _props.eventOut;
            var onEventIn = _props.onEventIn;
            var onEventOut = _props.onEventOut;
            var children = _props.children;

            if (!inline) {
                this.state.offset.width = children.clientWidth;
                this.setState(this.state);
            }
            var that = this;
            var target = that.getTarget();
            if (target) {
                target.addEventListener(eventIn, function () {
                    onEventIn && onEventIn();
                    that.show(true);
                });
                if (eventIn === 'mouseover') {
                    target.addEventListener(eventOut || 'mouseleave', function () {
                        that.timeId = setTimeout(function () {
                            that.show(false);
                        }, 200);
                    });
                } else if (eventOut) {
                    target.addEventListener(eventOut, function () {
                        that.show(false);
                        onEventOut && onEventOut();
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
            if (ok) {
                this.setState({ show: ok, offset: mixStyle(this.setDefaultPos()) });
                this.setState({ offset: mixStyle(this.setAddtionPos()) });
            } else {
                this.setState({ show: false });
            }
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
            this.state.show ? this.renderLayer() : this.removeLayer();
        }
    }, {
        key: 'setDefaultPos',
        value: function setDefaultPos() {
            var _getRefPosition = this.getRefPosition();

            var left = _getRefPosition.left;
            var top = _getRefPosition.top;
            var height = _getRefPosition.height;

            top += height + (document.body.scrollTop || document.documentElement.scrollTop);

            return { left: left, top: top };
        }
    }, {
        key: 'setAddtionPos',
        value: function setAddtionPos() {
            var placement = this.props.placement;

            var _getRefPosition2 = this.getRefPosition();

            var left = _getRefPosition2.left;
            var top = _getRefPosition2.top;
            var height = _getRefPosition2.height;
            var width = _getRefPosition2.width;

            var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            var offsetTop = top + (height + scrollTop);
            var right = left + width;

            var offsetPos = {};
            var scrollBottomGap = document.documentElement.clientHeight - top - height - this.layerSize.height > 0 ? true : false,
                scrollTopGap = top - this.layerSize.height > 0 ? true : false;

            var has = function has(str) {
                return ~placement.indexOf(str);
            };
            if (has('top') || !scrollBottomGap) {
                offsetPos.top = offsetTop - height - this.layerSize.height;
            } else if (has('bottom') || !scrollTopGap) {
                offsetPos.top = offsetTop;
            }
            if (has('right')) {
                offsetPos.left = right - this.layerSize.width;
            } else if (has('left')) {
                offsetPos.left = left;
            }

            if (!has('-')) {
                if (has('top') || has('bottom')) offsetPos.left = left + (width - this.layerSize.width) / 2;
                if (has('left') || has('right')) {
                    offsetPos.top = offsetTop + (-height - this.layerSize.height) / 2;
                    offsetPos.left = has('left') ? left - this.layerSize.width : left + width;
                }
            }
            return offsetPos;
        }
    }, {
        key: 'getRefPosition',
        value: function getRefPosition() {
            return this.getTarget() && this.getTarget().getBoundingClientRect();
        }
    }, {
        key: 'getLayerSize',
        value: function getLayerSize() {
            var layer = this.popup.getElementsByClassName(this.props.className);
            return layer.length && layer[0].getBoundingClientRect();
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
        key: 'removeLayer',
        value: function removeLayer() {
            if (this.popup) {
                try {
                    _reactDom2['default'].unmountComponentAtNode(this.popup);
                    document.body.removeChild(this.popup);
                } catch (e) {
                    this.popup = null;
                }
            }
        }
    }, {
        key: 'renderLayer',
        value: function renderLayer() {
            if (!this.hasBodyWrapper()) {
                this.removeLayer();
            }
            this.createBodyWrapper();
            if (this.props.children) {
                var childrenWithProps = _react2['default'].Children.map(this.props.children, function (child) {
                    return _react2['default'].cloneElement(child, {});
                }); //abc: this.state.offset
                var childWrapWithProps = _react2['default'].createElement(
                    'div',
                    { className: this.props.className, style: this.state.offset,
                        onClick: this.onClick.bind(this),
                        onMouseOver: this.onMouseOver.bind(this),
                        onMouseDown: this.onMouseDown.bind(this),
                        onMouseLeave: this.onMouseLeave.bind(this)
                    },
                    childrenWithProps
                );
                _reactDom2['default'].render(childWrapWithProps, this.popup);
                this.layerSize = this.getLayerSize();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return null;
        }
    }]);

    return ReactLayer;
})(_react.Component);

ReactLayer.defaultProps = {
    placement: 'bottom-left',
    eventIn: 'mouseover',
    className: 'layer-content'
};

exports['default'] = ReactLayer;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"react-dom":undefined}]},{},[1])(1)
});