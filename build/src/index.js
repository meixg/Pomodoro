var App=React.createClass({displayName:"App",getInitialState:function(){return{workTime:2700,restTime:600,time:2700,timer:null}},handleStartWork:function(){if(!this.state.timer){var e=60*$(ReactDOM.findDOMNode(this.refs.setting)).find(".workTime").val();e?(this.setState({workTime:e}),this.setState({time:e})):this.setState({time:this.state.workTime}),this.state.timer=setInterval(function(){this.state.time>0?this.setState({time:this.state.time-1}):(clearInterval(this.state.timer),this.setState({timer:null}),alert("工作完成！"))}.bind(this),1e3)}},handleStartRest:function(){if(!this.state.timer){var e=60*$(ReactDOM.findDOMNode(this.refs.setting)).find(".restTime").val();e?(this.setState({workTime:e}),this.setState({time:e})):this.setState({time:this.state.restTime}),this.state.timer=setInterval(function(){this.state.time>0?this.setState({time:this.state.time-1}):(clearInterval(this.state.timer),this.setState({timer:null}),alert("休息完成！"))}.bind(this),1e3)}},handleStop:function(){clearInterval(this.state.timer),this.setState({timer:null})},render:function(){var e=!1;return this.state.timer&&(e=!0),React.createElement("div",null,React.createElement("h1",null,"番茄工作法"),React.createElement(TimeDisplay,{time:this.state.time,working:e,percent:this.state.time/this.state.workTime*100}),React.createElement(ControlPanel,{handleStartWork:this.handleStartWork,handleStartRest:this.handleStartRest,handleStop:this.handleStop,working:e}),React.createElement(Setting,{ref:"setting",workTime:this.state.workTime,restTime:this.state.restTime}))}}),TimeDisplay=React.createClass({displayName:"TimeDisplay",render:function(){var e=this.props.time,t=parseInt(e/60);10>t&&(t="0"+t);var a=parseInt(e%60);10>a&&(a="0"+a);var i="";return this.props.working?(i="active",document.title=t+":"+a+"---番茄工作法"):document.title="番茄工作法",React.createElement("div",{className:"display"},React.createElement("h2",null,t,":",a),React.createElement("div",{className:"progress"},React.createElement("div",{className:"progress-bar progress-bar-striped "+i,style:{width:this.props.percent+"%"}})))}}),ControlPanel=React.createClass({displayName:"ControlPanel",render:function(){return this.props.working?React.createElement("div",null,React.createElement("button",{className:"btn btn-danger",onClick:this.props.handleStop},"停止")):React.createElement("div",null,React.createElement("button",{className:"btn btn-success",onClick:this.props.handleStartWork},"开始工作"),React.createElement("button",{className:"btn btn-success",onClick:this.props.handleStartRest},"开始休息"))}}),Setting=React.createClass({displayName:"Setting",handleClick:function(e){$(e.target).parent().find("form").toggle()},render:function(){return React.createElement("div",null,React.createElement("button",{className:"btn btn-info",onClick:this.handleClick},"设置"),React.createElement("form",{className:"form-inline",style:{display:"none"}},React.createElement("div",{className:"form-group"},React.createElement("label",{htmlFor:"workTime"},"工作时长:"),React.createElement("div",{className:"input-group"},React.createElement("input",{id:"workTime",type:"text",className:"workTime form-control",defaultValue:this.props.workTime/60}),React.createElement("div",{className:"input-group-addon"},"分钟"))),React.createElement("div",{className:"form-group"},React.createElement("label",{htmlFor:"restTime"},"休息时长:"),React.createElement("div",{className:"input-group"},React.createElement("input",{type:"text",id:"restTime",className:"restTime form-control",defaultValue:this.props.restTime/60}),React.createElement("div",{className:"input-group-addon"},"分钟")))))}});ReactDOM.render(React.createElement(App,null),document.getElementById("Pomodoro"));