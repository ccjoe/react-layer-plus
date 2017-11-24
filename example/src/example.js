import React, { Component } from 'react'
var ReactDOM = require('react-dom');
var ReactLayer = require('react-layer-plus');

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
    render() {
        let { formElementShow, show } = this.state;
        return (
            <div className="demo-list clearfix">
<pre className="demo-code">{`
* ReactLayer 组件上的事件由组件自己已处理显隐，使用本组件仅需要处理InBody内children上自己业务需要的事件与显隐
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
                        </div>
                    </ReactLayer>
				</div>

                <div className="demo-item">
					<h5>relate target with Form common element</h5>
					<span id="commonElement" value={this.state.value}>Common Element</span>

                    <ReactLayer eventIn="mouseover" eventOut="mouseleave" target='commonElement' show={show}>
                        <div style={{backgroundColor: '#fff', 'border': '1px solid #ccc'}}>
                            <span onClick={this.onClickA.bind(this)}>a</span><br/>
                            <span>b</span><br/>
                            <span>c</span><br/>
                            <p>test frame</p>
                        </div>
                    </ReactLayer>
				</div>

            </div>
        )
    }
}

App.defaultProps = {}

ReactDOM.render(<App />, document.getElementById('app'));
