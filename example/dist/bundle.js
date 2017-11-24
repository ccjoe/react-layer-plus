require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"react-layer":[function(require,module,exports){
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

var _react = require('react');

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

},{"react":undefined,"react-dom":undefined}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJFOi9naXQvVGVjaENsb3VkL3JlYWN0LWxheWVyL3NyYy9SZWFjdExheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FCQ0FpQyxPQUFPOzs7O3dCQUNuQixXQUFXOzs7O0FBR2hDLElBQUksUUFBUSxHQUFHLFNBQVgsUUFBUSxDQUFhLE1BQU0sRUFBRTtBQUM3QixXQUFPLFNBQWMsRUFBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQTtDQUNwRSxDQUFBOztJQUVLLFVBQVU7Y0FBVixVQUFVOzs7Ozs7Ozs7Ozs7O0FBV0QsYUFYVCxVQUFVLENBV0EsS0FBSyxFQUFFOzhCQVhqQixVQUFVOztBQVlSLG1DQVpGLFVBQVUsNkNBWUYsS0FBSyxFQUFFO0FBQ2IsWUFBSSxDQUFDLEtBQUssR0FBRztBQUNULGtCQUFNLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO0FBQ3BDLGdCQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksSUFBSSxLQUFLO1NBQzVCLENBQUE7S0FDSjs7aUJBakJDLFVBQVU7O2VBbUJLLDZCQUFHO0FBQ2hCLGdCQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFO0FBQ3hCLG9CQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDMUMsb0JBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxJQUFJLGlCQUFpQixBQUFDLENBQUE7QUFDbEUsd0JBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTthQUN4QztTQUNKOzs7ZUFFYSwwQkFBRztBQUNiLG1CQUFPLElBQUksQ0FBQyxLQUFL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RUFBRTtBQUN4QixvQkFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUE7YUFDM0I7QUFDRCxnQkFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtBQUNyQixvQkFBTSxpQkFBaUIsR0FBRyxtQkFBTSxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFVBQUEsS0FBSzsyQkFBSSxtQkFBTSxZQUFZLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQztpQkFBQSxDQUFDLENBQUE7QUFDekcsb0JBQU0sa0JBQWtCLEdBQUc7O3NCQUFLLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQUFBQztBQUNyRCwrQkFBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxBQUFDO0FBQ2pDLG1DQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEFBQUM7QUFDekMsbUNBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQUFBQztBQUN6QyxvQ0FBWSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxBQUFDOztvQkFDN0MsaUJBQWlCO2lCQUNiLENBQUE7QUFDTixzQ0FBUyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO2FBQ2xEO1NBQ0o7OztlQUVLLGtCQUFHO0FBQ0wsbUJBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksMENBQUssU0FBUyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxBQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksQUFBQyxHQUFHLENBQUE7U0FDckY7OztXQXhLQyxVQUFVOzs7cUJBMktELFVBQVUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJ1xyXG5cclxuXHJcbnZhciBtaXhTdHlsZSA9IGZ1bmN0aW9uIChvZmZzZXQpIHtcclxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHtwb3NpdGlvbjogJ2Fic29sdXRlJywgekluZGV4OiAxMDB9LCBvZmZzZXQpXHJcbn1cclxuXHJcbmNsYXNzIFJlYWN0TGF5ZXIgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAvKipcclxuICAgICogQG1lbWJlcm9mIFJlYWN0TGF5ZXJcclxuICAgICogUmVhY3RMYXllciDnu4Tku7bkuIrnmoTkuovku7bnlLHnu4Tku7boh6rlt7Hlt7LlpITnkIbmmL7pmpDvvIzkvb/nlKjmnKznu4Tku7bku4XpnIDopoHlpITnkIZJbkJvZHnlhoVjaGlsZHJlbuS4iuiHquW3seS4muWKoemcgOimgeeahOS6i+S7tuS4juaYvumakFxyXG4gICAgKiBwcm9wcy50YXJnZXQgW3N0cmluZyB0YXJnZXRJZF06IGxheWVyIHNob3cgYnkgW2V2ZW50SW5dIHRhcmdldFxyXG4gICAgKiBwcm9wcy5ldmVudEluICB7ZXZlbnROYW1lfSAgICAgICAgIHNob3cgdHJpZ2dlciBieSBldmVudEluXHJcbiAgICAqIHByb3BzLmV2ZW50T3V0IHtvcHRpb25hbCBldmVudE5hbWV9IGhpZGUgdHJpZ2dlciBieSBldmVudE91dCBmb3JtIGVsZW1lbnQgbmVlZG4ndCBldmVudE91dFxyXG4gICAgKiBwcm9wcy5zaG93ICAgICB7b3B0aW9uYWwgYm9vbGVhbn1cclxuICAgICogcHJvcHMub25QcmVCbHVyIHtjYWxsYmFjayBmdW5jdGlvbn1cclxuICAgICogUmVhY3RMYXllci5ldmVudElubmVyIHtzdGF0aWMgYm9vbGVhbn0gICBnZXQgb3Igc2V0IHRoZSBldmVudCB0cmlnZ2VyIGJ5IFJlYWN0TGF5ZXIgSW5uZXIgb3IgT3V0ZXJcclxuICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBvZmZzZXQ6IG1peFN0eWxlKHByb3BzLm9mZnNldCkgfHwge30sXHRcdC8vcG9zaXRpb25cclxuICAgICAgICAgICAgc2hvdzogcHJvcHMuc2hvdyB8fCBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVCb2R5V3JhcHBlcigpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaGFzQm9keVdyYXBwZXIoKSkge1xyXG4gICAgICAgICAgICB0aGlzLnBvcHVwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgICAgICAgdGhpcy5wb3B1cC5jbGFzc05hbWUgPSAodGhpcy5wcm9wcy5jbGFzc05hbWUgfHwgJ2luLWJvZHktd3JhcHBlcicpXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5wb3B1cClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaGFzQm9keVdyYXBwZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9wdXAgJiYgZG9jdW1lbnQuYm9keS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMucG9wdXAuY2xhc3NOYW1lKS5sZW5ndGhcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICB0aGlzLmNyZWF0ZUJvZHlXcmFwcGVyKClcclxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5zaG93KSB0aGlzLnJlbmRlckxheWVyKClcclxuICAgICAgICBpZiAoIXRoaXMucHJvcHMuaW5saW5lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUub2Zmc2V0LndpZHRoID0gdGhpcy5wcm9wcy5jaGlsZHJlbi5jbGllbnRXaWR0aFxyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpc1xyXG4gICAgICAgIHZhciB0YXJnZXQgPSB0aGF0LmdldFRhcmdldCgpXHJcbiAgICAgICAgaWYgKHRhcmdldCkge1xyXG4gICAgICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcih0aGF0LnByb3BzLmV2ZW50SW4sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuc2hvdyh0cnVlKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBpZih0aGF0LnByb3BzLmV2ZW50SW4gPT09ICdtb3VzZW92ZXInKXtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQudGltZUlkID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5zaG93KGZhbHNlKVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIDIwMCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGF0LnRhcmdldElzSW5wdXQodGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGF0LmV2ZW50SW5uZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5zZXRTdGF0ZSh7IHNob3c6IGZhbHNlIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzaG93KG9rKXtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2hvdzogb2ssIG9mZnNldDogb2sgPyBtaXhTdHlsZSh0aGlzLnNldFBvc2l0aW9uKCkpIDoge30gfSk7XHJcbiAgICB9XHJcbiAgICBvbk1vdXNlT3Zlcigpe1xyXG4gICAgICAgIGlmKHRoaXMudGltZUlkKXtcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZUlkKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG9uTW91c2VEb3duKCkge1xyXG4gICAgICAgIHZhciB7IG9uUHJlQmx1ciB9ID0gdGhpcy5wcm9wc1xyXG4gICAgICAgIG9uUHJlQmx1ciAmJiBvblByZUJsdXIoKVxyXG4gICAgICAgIHRoaXMuZXZlbnRJbm5lciA9IHRydWVcclxuICAgIH1cclxuXHJcbiAgICAvL0luQm9keSBXcmFwcGVyIEV2ZW50LCBjb250cm9sIHJlZnMgYW5kIHBhbmUgc2hvd1xyXG4gICAgb25DbGljaygpIHtcclxuICAgICAgICAvL+inpuWPkeWMuuWfn+S4uuWklumDqOWMuuWfn1xyXG4gICAgICAgIGlmICghdGhpcy5ldmVudElubmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzaG93OiBmYWxzZSB9KVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8v6Kem5Y+R5Yy65Z+f5Li65pyJ5pWI5Yy65Z+f77yM5L2G5piv5peg5pWI5pON5L2c5pe2XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSB0aGlzLmdldFRhcmdldCgpXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRhcmdldElzSW5wdXQodGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmZvY3VzKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmV2ZW50SW5uZXIgPSBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VMZWF2ZSgpIHtcclxuICAgICAgICB2YXIgdGFyZ2V0ID0gdGhpcy5nZXRUYXJnZXQoKVxyXG4gICAgICAgIC8v6Kem5Y+R5YWD57Sg5Li66Z2e6KGo5Y2V5YWD57Sg5pe277yMIOemu+W8gOWNs+WFs+mXrVxyXG4gICAgICAgIGlmICghdGhpcy50YXJnZXRJc0lucHV0KHRhcmdldCkpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNob3c6IGZhbHNlIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRhcmdldElzSW5wdXQodGFyZ2V0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdpbnB1dCdcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgICAgIGlmIChuZXh0UHJvcHMuc2hvdyAhPT0gdGhpcy5zdGF0ZS5zaG93KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvdyhuZXh0UHJvcHMuc2hvdylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xyXG4gICAgICAgIHRoaXMuc3RhdGUuc2hvdyA/IHRoaXMucmVuZGVyTGF5ZXIoKSA6IHRoaXMucmVtb3ZlUGlja2VyKClcclxuICAgIH1cclxuXHJcbiAgICBzZXRQb3NpdGlvbigpIHtcclxuICAgICAgICBsZXQgeyBsZWZ0LCB0b3AsIGhlaWdodCB9ID0gdGhpcy5oYW5kbGVQb3NpdGlvbigpO1xyXG4gICAgICAgIHRvcCArPSAoaGVpZ2h0ICsgKGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3ApKVxyXG4gICAgICAgIHJldHVybiB7IGxlZnQsIHRvcCB9XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlUG9zaXRpb24oKSB7XHJcbiAgICAgICAgLy8gRml4IGZvciBJRTgtJ3MgRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG4gICAgICAgIGlmICgnVGV4dFJlY3RhbmdsZScgaW4gd2luZG93ICYmICEoJ3dpZHRoJyBpbiBUZXh0UmVjdGFuZ2xlLnByb3RvdHlwZSkpIHtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoVGV4dFJlY3RhbmdsZS5wcm90b3R5cGUsIHtcclxuICAgICAgICAgICAgICAgICd3aWR0aCc6IHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLnJpZ2h0IC0gdGhpcy5sZWZ0OyB9IH0sXHJcbiAgICAgICAgICAgICAgICAnaGVpZ2h0JzogeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuYm90dG9tIC0gdGhpcy50b3A7IH0gfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGFyZ2V0KCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuICAgIH1cclxuXHJcbiAgICBnZXRUYXJnZXQgKCkge1xyXG4gICAgICAgIHZhciB7IHRhcmdldCB9ID0gdGhpcy5wcm9wcywgdGFyZ2V0RWwgPSBudWxsXHJcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHRhcmdldEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0KVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciByZWFjdFRhcmdldCA9IHR5cGVvZiB0YXJnZXQgPT09ICdmdW5jdGlvbicgPyB0YXJnZXQoKSA6IHRhcmdldFxyXG4gICAgICAgICAgICB0YXJnZXRFbCA9IHJlYWN0VGFyZ2V0ICYmIFJlYWN0RE9NLmZpbmRET01Ob2RlKHJlYWN0VGFyZ2V0KVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGFyZ2V0RWxcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVQaWNrZXIoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucG9wdXApIHtcclxuICAgICAgICAgICAgUmVhY3RET00udW5tb3VudENvbXBvbmVudEF0Tm9kZSh0aGlzLnBvcHVwKVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLnBvcHVwKVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyTGF5ZXIoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmhhc0JvZHlXcmFwcGVyKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVCb2R5V3JhcHBlcigpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnByb3BzLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkcmVuV2l0aFByb3BzID0gUmVhY3QuQ2hpbGRyZW4ubWFwKHRoaXMucHJvcHMuY2hpbGRyZW4sIGNoaWxkID0+IFJlYWN0LmNsb25lRWxlbWVudChjaGlsZCwge30pKSAvL2FiYzogdGhpcy5zdGF0ZS5vZmZzZXRcclxuICAgICAgICAgICAgY29uc3QgY2hpbGRXcmFwV2l0aFByb3BzID0gPGRpdiBzdHlsZT17dGhpcy5zdGF0ZS5vZmZzZXR9XHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLm9uQ2xpY2suYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgICAgIG9uTW91c2VPdmVyPXt0aGlzLm9uTW91c2VPdmVyLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgICAgICBvbk1vdXNlRG93bj17dGhpcy5vbk1vdXNlRG93bi5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXt0aGlzLm9uTW91c2VMZWF2ZS5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICA+e2NoaWxkcmVuV2l0aFByb3BzfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgUmVhY3RET00ucmVuZGVyKGNoaWxkV3JhcFdpdGhQcm9wcywgdGhpcy5wb3B1cClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlLnNob3cgJiYgPGRpdiBjbGFzc05hbWU9e3RoaXMucHJvcHMuY2xhc3NOYW1lfSBjaGlsZHJlbj17bnVsbH0gLz5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmVhY3RMYXllclxyXG4iXX0=
