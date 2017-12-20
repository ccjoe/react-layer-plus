import React, { Component } from 'react'
var ReactDOM = require('react-dom');
var ReactLayer = require('react-layer-plus');
class DemoElem extends Component {
    render(){
        return  <button onClick={this.props.onClick.bind(this)}>子组件区域</button>
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: {},		//position
            show: false,
            value: '',
            formElementShow: false,
            formElementValue: 'Init Form Element Value'
        }
    }

    onClick(){
    }
    onClickA(){
    }
    onClickB(){
        this.setState({formElementValue: '有效区域 (autoHide)', formElementShow: false})
    }
    onClickC(){
        this.setState({formElementValue: '有效区域 (not autoHide)', formElementShow: true})
    }
    onClickD(){
        this.setState({formElementValue: '子组件区域 hide:false', formElementShow: true})
    }
    onClickE(){
        this.setState({formElementValue: '子组件区域 hide:true', formElementShow: false})
    }
    render() {
        let { formElementShow, show } = this.state;
        return (
            <div className="demo-list clearfix">
<pre className="demo-code">{`
* ReactLayer 组件上的事件由组件自己已处理显隐，使用本组件仅需要处理ReactLayer内children上自己业务需要的事件与显隐
* props.target [string targetId]: layer show by [eventIn] target
* props.eventIn  {eventName}         show trigger by eventIn
* props.eventOut {optional eventName} hide trigger by eventOut form element needn't eventOut
* props.show     {optional boolean}
* props.onPreBlur {callback function}
* ReactLayer.eventInner {static boolean}   get or set the event trigger by ReactLayer Inner or Outer
`}</pre>
                <br/>
                <hr/>
                <h3>Have a try</h3>
                <hr/>


                <div className="demo-item">
					<h5>relate target with Form element</h5>
					<h6>form Element ReactLayer didnot need eventOut, and eventOut is defined with 'blur'</h6>
					<h6>if u want to autoHide, need define prop 'show', and ctrl by yourself  </h6>
					<input id="formElement" value={this.state.formElementValue} onChange={function(){}}/>
                    <ReactLayer eventIn="click" target='formElement' show={formElementShow}>
                        <div style={{backgroundColor: '#fff', 'border': '1px solid #ccc', padding:10}}>
                            <button>click空白区域</button><br/>
                            <button onClick={this.onClickA.bind(this)}>无效区域</button><br/>
                            <button onClick={this.onClickB.bind(this)}>有效区域 (autoHide)</button><br/>
                            <button onClick={this.onClickC.bind(this)}>有效区域 (not autoHide)</button><br/>
                            <DemoElem onClick={this.onClickD.bind(this)}/>
                            <DemoElem onClick={this.onClickE.bind(this)}/>
                        </div>
                    </ReactLayer>
				</div>

                <div className="demo-item">
					<h5>layer callback</h5>
					<input id="formElementCallback"  onChange={function(){}}/>
                    <ReactLayer eventIn="click" onEventIn={(e) => console.log('onEventIn', e)} onEventOut={(e, inner) => console.log('onEventOut',e, inner)} target='formElementCallback'>
                        <div  onClick={function(){console.log('click onEventIn onEventOut')}} style={{backgroundColor: '#fff', 'border': '1px solid #ccc', padding:10}}>
                            <span   onClick={function(){console.log('click onEventIn onEventOut 3')}} >CallBack: onEventIn onEventOut, pls visit console log</span>

                            <br/>
                            {`onEventIn={(e) => console.log(e)}`}
                            <br/>
                            {`onEventOut={(e) => console.log(e)}`}
                        </div>
                    </ReactLayer>
				</div>


                <div className="demo-item">
					<h5>relate target with Form common element</h5>
					<span id="commonElement" value={this.state.value}>Common Element  placement default bottom-left</span>
                    <style>
                        {`
                        .c-layer {
                            border: 1px solid blue;
                        }

                        `}
                    </style>
                    <ReactLayer target='commonElement' show={show} className="c-layer">
                        <div style={{backgroundColor: '#fff', 'border': '1px solid #ccc'}}>
                            <span onClick={this.onClickA.bind(this)}>a</span><br/>
                            <span>b</span><br/>
                            <span>c</span><br/>
                            <p>test frame</p>
                        </div>
                    </ReactLayer>
				</div>

                <div className="demo-item">
					<h5>placement bottom-right</h5>
					<span style={{textDecoration: 'underline'}} id="placementElemBR" value={this.state.value}>placement demo</span>
                    <ReactLayer target='placementElemBR' show={show} className="c-layer" placement="bottom-right">
                        <div style={{backgroundColor: '#fff', 'border': '1px solid #ccc'}}>
                         'left' <br/>
                         'right'<br/>
                         'top'<br/>
                         'bottom'<br/>
                         'left-top'<br/>
                         'left-bottom'<br/>
                         'right-top'<br/>
                         'right-bottom'
                        </div>
                    </ReactLayer>
				</div>

                <div className="demo-item">
					<h5>placement top-left</h5>
					<span style={{textDecoration: 'underline'}} id="placementElemTL" value={this.state.value}>placement demo</span>
                    <ReactLayer target='placementElemTL'  show={show} className="c-layer" placement="top-left">
                        <div style={{backgroundColor: '#fff', 'border': '1px solid #ccc'}}>
                         'left' <br/>
                         'right'<br/>
                         'top'<br/>
                         'bottom'<br/>
                         'left-top'<br/>
                         'left-bottom'<br/>
                         'right-top'<br/>
                         'right-bottom'
                        </div>
                    </ReactLayer>
				</div>

                <div className="demo-item">
					<h5>placement top-right</h5>
					<span style={{textDecoration: 'underline'}} id="placementElemTR" value={this.state.value}>placement demo</span>
                    <ReactLayer target='placementElemTR'  show={show} className="c-layer" placement="top-right">
                        <div style={{backgroundColor: '#fff', 'border': '1px solid #ccc'}}>
                         'left' <br/>
                         'right'<br/>
                         'top'<br/>
                         'bottom'<br/>
                         'left-top'<br/>
                         'left-bottom'<br/>
                         'right-top'<br/>
                         'right-bottom'
                        </div>
                    </ReactLayer>
				</div>

                <div className="demo-item">
					<h5>placement left</h5>
					<span style={{textDecoration: 'underline'}} id="placementElemLeft" value={this.state.value}>placement demo</span>
                    <ReactLayer target='placementElemLeft'  show={show} className="c-layer" placement="left">
                        <div style={{backgroundColor: '#fff', 'border': '1px solid #ccc'}}>
                         'left' <br/>
                         'right'<br/>
                         'top'<br/>
                         'bottom'<br/>
                         'left-top'<br/>
                         'left-bottom'<br/>
                         'right-top'<br/>
                         'right-bottom'
                        </div>
                    </ReactLayer>
				</div>

                <div className="demo-item">
					<h5>placement right</h5>
					<span style={{textDecoration: 'underline'}} id="placementElemRight" value={this.state.value}>placement demo</span>
                    <ReactLayer target='placementElemRight'  show={show} className="c-layer" placement="right">
                        <div style={{backgroundColor: '#fff', 'border': '1px solid #ccc'}}>
                         'left' <br/>
                         'right'<br/>
                         'top'<br/>
                         'bottom'<br/>
                         'left-top'<br/>
                         'left-bottom'<br/>
                         'right-top'<br/>
                         'right-bottom'
                        </div>
                    </ReactLayer>
				</div>

                <div className="demo-item">
					<h5>placement top</h5>
					<span style={{textDecoration: 'underline'}} id="placementElemTop" value={this.state.value}>placement demo</span>
                    <ReactLayer target='placementElemTop'  show={show} className="c-layer" placement="top">
                        <div style={{backgroundColor: '#fff', 'border': '1px solid #ccc'}}>
                         'left' <br/>
                         'right'<br/>
                         'top'<br/>
                         'bottom'<br/>
                         'left-top'<br/>
                         'left-bottom'<br/>
                         'right-top'<br/>
                         'right-bottom'
                        </div>
                    </ReactLayer>
				</div>

                <div className="demo-item">
					<h5>placement bottom</h5>
					<span style={{textDecoration: 'underline'}} id="placementElemBottom" value={this.state.value}>placement demo</span>
                    <ReactLayer target='placementElemBottom'  show={show} className="c-layer" placement="bottom">
                        <div style={{backgroundColor: '#fff', 'border': '1px solid #ccc'}}>
                         'left' <br/>
                         'right'<br/>
                         'top'<br/>
                         'bottom'<br/>
                         'left-top'<br/>
                         'left-bottom'<br/>
                         'right-top'<br/>
                         'right-bottom'
                        </div>
                    </ReactLayer>
				</div>
            </div>
        )
    }
}

App.defaultProps = {}

ReactDOM.render(<App />, document.getElementById('app'));
