import React, { Component } from 'react'
import ReactDOM from 'react-dom'

// Fix for IE8-'s Element.getBoundingClientRect()
if ('TextRectangle' in window && !('width' in TextRectangle.prototype)) {
    Object.defineProperties(TextRectangle.prototype, {
        width: {
            get: function() {
                return this.right - this.left
            }
        },
        height: {
            get: function() {
                return this.bottom - this.top
            }
        }
    })
}

/*
* 频率控制 返回函数连续调用时，fn 执行频率限定为每多少时间执行一次
* @param fn {function}  需要调用的函数
* @param delay  {number}    延迟时间，单位毫秒
* @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
* @return {function}实际调用函数
*/
/* var throttle = function (fn,delay, immediate, debounce) {
    var curr = +new Date(),//当前事件
        last_call = 0,
        last_exec = 0,
        timer = null,
        diff, //时间差
        context,//上下文
        args,
        exec = function () {
            last_exec = curr;
            fn.apply(context, args);
        };
    return function () {
        curr= +new Date();
        context = this,
        args = arguments,
        diff = curr - (debounce ? last_call : last_exec) - delay;
        clearTimeout(timer);
        if (debounce) {
            if (immediate) {
                timer = setTimeout(exec, delay);
            } else if (diff >= 0) {
                exec();
            }
        } else {
            if (diff >= 0) {
                exec();
            } else if (immediate) {
                timer = setTimeout(exec, -diff);
            }
        }
        last_call = curr;
    }
 }; */

/*
 * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，fn 才会执行
 * @param fn {function}  要调用的函数
 * @param delay   {number}    空闲时间
 * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
 * @return {function}实际调用函数
 */

/* var debounce = function (fn, delay, immediate) {
    return throttle(fn, delay, immediate, true);
}; */

class ReactLayer extends Component {
    /**
     * @memberof ReactLayer
     * ReactLayer 组件上的事件由组件自己已处理显隐，使用本组件仅需要处理InBody内children上自己业务需要的事件与显隐
     * props.target [string targetId]: layer show by [eventIn] target
     * props.eventIn  {eventName}         show trigger by eventIn
     * //if eventIn is mouseenter, eventOut mouseleave default
     * //if target is form element ,eventOut is blur default
     * props.eventOut {optional eventName} hide trigger by eventOut form element needn't eventOut
     * props.show     {optional boolean}
     * props.onPreBlur {callback function}
     * props.onEventIn {callback function}
     * props.onEventOut {callback function}
     * props.css {object} 提供样式控制
     * props.offset {object} 提供位置样式控制
     * props.placement {string} default 'bottom-left'  left right top bottom top-left bottom-left top-right bottom-right
     * ReactLayer.eventInner {static boolean}   get or set the blur event trigger by ReactLayer Inner or Outer
     */
    constructor(props) {
        super(props)
        this.state = {
            offset: Object.assign({ zIndex: 100, position: 'absolute' }, props.offset), //position
            show: props.show || false
        }
        // this.showLayer = throttle(this.showLayer, 500, true)
        this.eventInner = false
        this.onClick = this.onClick.bind(this)
        this.onMouseOver = this.onMouseOver.bind(this)
        this.onMouseDown = this.onMouseDown.bind(this)
        this.onMouseLeave = this.onMouseLeave.bind(this)
        this.showLayer = this.showLayer.bind(this)
    }

    createBodyWrapper() {
        if (!this.hasBodyWrapper()) {
            this.popup = document.createElement('div')
            this.popup.className = 'layer-wrapper'
            // this.popup.refid = this.props.target
            document.body.appendChild(this.popup)
        }
    }

    hasBodyWrapper() {
        var popupExist =
            this.popup &&
            this.popup.className &&
            document.body.getElementsByClassName(this.popup.className)
        if (this.popup && popupExist.length) {
            if (this.popup.children.length) {
                return true
            }
            document.body.removeChild(popupExist[0])
        }
        return false
    }

    showLayer(e) {
        var { onEventIn } = this.props
        onEventIn && onEventIn(e, this)
        this.show(true)
    }

    componentDidMount() {
        this.createBodyWrapper()

        var { inline, eventIn, eventOut, onEventOut, children } = this.props
        if (!inline) {
            this.state.offset.width = children && children.clientWidth
            this.setState(this.state)
        }
        var that = this
        var target = that.getTarget()

        if (target) {
            target.addEventListener(eventIn, this.showLayer)
            if (eventIn === 'mouseenter') {
                target.addEventListener(eventOut || 'mouseleave', function() {
                    that.timeId = setTimeout(function() {
                        that.timeId && that.show(false)
                    }, 100)
                })
            } else if (eventOut) {
                target.addEventListener(eventOut, function(e) {
                    onEventOut && onEventOut(e, that)
                    that.show(false)
                })
            }
            if (that.targetIsInput(target)) {
                var blurCb = function(e) {
                    if (!that.eventInner) {
                        onEventOut && onEventOut(e, that)
                        that.setState({ show: false })
                    }
                }
                target.removeEventListener('blur', blurCb, false)
                target.addEventListener('blur', blurCb, false)
            }
        }
    }

    show(ok) {
        if (ok) {
            this.setState({
                show: ok,
                offset: Object.assign(
                    {},
                    this.state.offset,
                    this.setDefaultPos(),
                    this.setAddtionPos()
                )
            })
        } else {
            this.setState({ show: false })
        }
    }

    onMouseOver() {
        if (this.timeId) {
            clearTimeout(this.timeId)
            this.timeId = null
        }
    }

    onMouseDown() {
        var { onPreBlur } = this.props
        onPreBlur && onPreBlur()
        this.eventInner = true
    }

    //InBody Wrapper Event, control refs and pane show
    onClick() {
        //触发区域为外部区域
        if (!this.eventInner) {
            this.setState({ show: false })
        } else {
            //触发区域为有效区域，但是无效操作时
            var target = this.getTarget()
            if (this.targetIsInput(target)) {
                target.focus()
            }
        }
        this.eventInner = false
    }

    onMouseLeave() {
        var target = this.getTarget()
        //触发元素为非表单元素时， 离开即关闭
        if (!this.targetIsInput(target)) {
            this.setState({ show: false })
        }
    }

    targetIsInput(target) {
        return target && target.tagName && target.tagName.toLowerCase() === 'input'
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.show !== this.state.show && this.targetIsInput(this.getTarget())) {
            this.show(nextProps.show)
        }
    }

    componentDidUpdate() {
        this.state.show ? this.renderLayer() : this.removeLayer()
    }

    setDefaultPos() {
        let { left, top, height } = this.getRefPosition()
        top += height + (document.body.scrollTop || document.documentElement.scrollTop)

        return { left, top }
    }

    setAddtionPos() {
        let { placement } = this.props
        let { left, top, height, width } = this.getRefPosition()
        let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
        let offsetTop = top + (height + scrollTop)
        let right = left + width

        let offsetPos = {}
        if (!this.layerSize) {
            return offsetPos
        }
        let scrollBottomGap =
                document.documentElement.clientHeight - top - height - this.layerSize.height > 0
                    ? true
                    : false,
            scrollTopGap = top - this.layerSize.height > 0 ? true : false

        let has = str => ~placement.indexOf(str)
        if (has('bottom') || !scrollTopGap) {
            offsetPos.top = offsetTop
        } else if (has('top') || !scrollBottomGap) {
            offsetPos.top = offsetTop - height - this.layerSize.height
        }
        if (has('right')) {
            offsetPos.left = right - this.layerSize.width
        } else if (has('left')) {
            offsetPos.left = left
        }

        if (!has('-')) {
            if (has('top') || has('bottom'))
                offsetPos.left = left + (width - this.layerSize.width) / 2
            if (has('left') || has('right')) {
                offsetPos.top = offsetTop + (-height - this.layerSize.height) / 2
                offsetPos.left = has('left') ? left - this.layerSize.width : left + width
            }
        }
        return offsetPos
    }

    getRefPosition() {
        return this.getTarget() && this.getTarget().getBoundingClientRect()
    }

    getLayerSize() {
        var layer = this.popup.getElementsByClassName(this.props.className)
        return layer.length && layer[0].getBoundingClientRect()
    }

    getTarget() {
        var { target } = this.props,
            targetEl = null
        if (typeof target === 'string') {
            targetEl = document.getElementById(target)
        } else {
            var reactTarget = typeof target === 'function' ? target() : target
            targetEl = reactTarget && ReactDOM.findDOMNode(reactTarget)
        }
        return targetEl
    }

    removeLayer() {
        if (this.popup && this.refs.childWrapWithProps) {
            // ReactDOM.unmountComponentAtNode(this.popup)
            document.body.removeChild(this.popup)
            this.popup = null
        }
    }

    renderLayer() {
        if (!this.hasBodyWrapper()) {
            this.removeLayer()
        }
        this.createBodyWrapper()
        if (this.props.children) {
            const childrenWithProps = React.Children.map(this.props.children, child =>
                React.cloneElement(child, {})
            ) //abc: this.state.offset
            const childWrapWithProps = (
                <div
                    className={this.props.className}
                    style={Object.assign({}, this.state.offset, this.props.css)}
                    onClick={this.onClick}
                    onMouseOver={this.onMouseOver}
                    onMouseDown={this.onMouseDown}
                    onMouseLeave={this.onMouseLeave}
                >
                    {childrenWithProps}
                </div>
            )
            ReactDOM.render(childWrapWithProps, this.popup)
            this.layerSize = this.getLayerSize()
        }
    }

    render() {
        return <div ref="childWrapWithProps" />
    }
}
ReactLayer.defaultProps = {
    placement: 'bottom-left',
    eventIn: 'mouseenter',
    className: 'layer-content'
}

export default ReactLayer
