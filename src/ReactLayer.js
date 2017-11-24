import React, { Component } from 'react'
import ReactDOM from 'react-dom'


var mixStyle = function (offset) {
    return Object.assign({position: 'absolute', zIndex: 100}, offset)
}

class ReactLayer extends Component {
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
    constructor(props) {
        super(props);
        this.state = {
            offset: mixStyle(props.offset) || {},		//position
            show: props.show || false
        }
    }

    createBodyWrapper() {
        if (!this.hasBodyWrapper()) {
            this.popup = document.createElement('div')
            this.popup.className = (this.props.className || 'in-body-wrapper')
            document.body.appendChild(this.popup)
        }
    }

    hasBodyWrapper() {
        return this.popup && document.body.getElementsByClassName(this.popup.className).length
    }

    componentDidMount() {
        this.createBodyWrapper()
        if (this.state.show) this.renderLayer()
        if (!this.props.inline) {
            this.state.offset.width = this.props.children.clientWidth
            this.setState(this.state)
        }
        var that = this
        var target = that.getTarget()
        if (target) {
            target.addEventListener(that.props.eventIn, function () {
                that.show(true)
            })
            if(that.props.eventIn === 'mouseover'){
                target.addEventListener('mouseleave', function () {
                    that.timeId = setTimeout(function() {
                        that.show(false)
                    }, 200);
                })
            }
            if (that.targetIsInput(target)) {
                target.addEventListener('blur', function () {
                    if (!that.eventInner) {
                        that.setState({ show: false })
                    }
                })
            }
        }
    }

    show(ok){
        this.setState({ show: ok, offset: ok ? mixStyle(this.setPosition()) : {} });
    }
    onMouseOver(){
        if(this.timeId){
            clearTimeout(this.timeId)
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
        return target.tagName.toLowerCase() === 'input'
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.show !== this.state.show) {
            this.show(nextProps.show)
        }
    }

    componentDidUpdate() {
        this.state.show ? this.renderLayer() : this.removePicker()
    }

    setPosition() {
        let { left, top, height } = this.handlePosition();
        top += (height + (document.body.scrollTop || document.documentElement.scrollTop))
        return { left, top }
    }

    handlePosition() {
        // Fix for IE8-'s Element.getBoundingClientRect()
        if ('TextRectangle' in window && !('width' in TextRectangle.prototype)) {
            Object.defineProperties(TextRectangle.prototype, {
                'width': { get: function () { return this.right - this.left; } },
                'height': { get: function () { return this.bottom - this.top; } }
            });
        }
        return this.getTarget().getBoundingClientRect()
    }

    getTarget () {
        var { target } = this.props, targetEl = null
        if (typeof target === 'string') {
            targetEl = document.getElementById(target)
        } else {
            var reactTarget = typeof target === 'function' ? target() : target
            targetEl = reactTarget && ReactDOM.findDOMNode(reactTarget)
        }
        return targetEl
    }

    removePicker() {
        if (this.popup) {
            ReactDOM.unmountComponentAtNode(this.popup)
            try {
                document.body.removeChild(this.popup)
            } catch (e) { }
        }
    }

    renderLayer() {
        if (!this.hasBodyWrapper()) {
            this.createBodyWrapper()
        }
        if (this.props.children) {
            const childrenWithProps = React.Children.map(this.props.children, child => React.cloneElement(child, {})) //abc: this.state.offset
            const childWrapWithProps = <div style={this.state.offset}
                onClick={this.onClick.bind(this)}
                onMouseOver={this.onMouseOver.bind(this)}
                onMouseDown={this.onMouseDown.bind(this)}
                onMouseLeave={this.onMouseLeave.bind(this)}
            >{childrenWithProps}
            </div>
            ReactDOM.render(childWrapWithProps, this.popup)
        }
    }

    render() {
        return this.state.show && <div className={this.props.className} children={null} />
    }
}

export default ReactLayer
