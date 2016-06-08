var App = React.createClass({displayName: "App",
  getInitialState: function () {
    return {
      workTime: 45*60,
      restTime: 10*60,
      time: 45*60,
      timer: null
    }; 
  },
  handleStartWork: function(){
    if(this.state.timer){
      return;
    }
    var workTime = $(ReactDOM.findDOMNode(this.refs.setting)).find(".workTime").val()*60;
    if(workTime){
      this.setState({workTime:workTime});
      this.setState({time:workTime});
    }else{
      this.setState({time : this.state.workTime});
    }
    this.state.timer = setInterval(function(){
      if(this.state.time > 0){
        this.setState({time : this.state.time-1})
      }else{
        clearInterval(this.state.timer);
        this.setState({timer:null});
        alert("工作完成！")
      }
    }.bind(this),1000);
  },
  handleStartRest: function(){
    if(this.state.timer){
      return;
    }
    var restTime = $(ReactDOM.findDOMNode(this.refs.setting)).find(".restTime").val()*60;
    if(restTime){
      this.setState({workTime:restTime});
      this.setState({time:restTime});
    }else{
      this.setState({time : this.state.restTime});
    }
    this.state.timer = setInterval(function(){
      if(this.state.time > 0){
        this.setState({time : this.state.time-1})
      }else{
        clearInterval(this.state.timer);
        this.setState({timer:null});
        alert("休息完成！")
      }
    }.bind(this),1000);
  },
  handleStop: function(){
    clearInterval(this.state.timer);
    this.setState({timer:null});
  },
  render: function() {
    var working = false;
    if(this.state.timer){
      working = true;
    }
    return (
      React.createElement("div", null, 
        React.createElement("h1", null, "番茄工作法"), 
        React.createElement(TimeDisplay, {time: this.state.time, working: working, percent: this.state.time/this.state.workTime*100}), 
        React.createElement(ControlPanel, {handleStartWork: this.handleStartWork, handleStartRest: this.handleStartRest, handleStop: this.handleStop, working: working}), 
        React.createElement(Setting, {ref: "setting", workTime: this.state.workTime, restTime: this.state.restTime})
      )
    );
  }
});
var TimeDisplay = React.createClass({displayName: "TimeDisplay",//剩余时间显示模块
  render: function(){
    var time = this.props.time;
    var minute = parseInt(time/60);
    if(minute < 10){
      minute = "0" + minute;
    }
    var second = parseInt(time%60);
    if(second < 10){
      second = "0" + second;
    }
    var active = "";
    if(this.props.working){
      active = "active";
      document.title = minute+":"+second+"---番茄工作法";
    }else{
      
      document.title = "番茄工作法";
    }
    console.log(active);
    return (
      React.createElement("div", {className: "display"}, 
        React.createElement("h2", null, minute, ":", second), 
        React.createElement("div", {className: "progress"}, 
          React.createElement("div", {className: "progress-bar progress-bar-striped " + active, style: {width : this.props.percent+"%"}})
        )
      )
    );
  }
});
var ControlPanel = React.createClass({displayName: "ControlPanel",//控制面板
  render: function() {
    if(this.props.working){
      return (
        React.createElement("div", null, 
          React.createElement("button", {className: "btn btn-danger", onClick: this.props.handleStop}, "停止")
        )
        );
    }else{
      return (
        React.createElement("div", null, 
          React.createElement("button", {className: "btn btn-success", onClick: this.props.handleStartWork}, "开始工作"), 
          React.createElement("button", {className: "btn btn-success", onClick: this.props.handleStartRest}, "开始休息")
        )
      )
    }
  }
});
var Setting = React.createClass({displayName: "Setting",//设置
  handleClick: function(e){
    $(e.target).parent().find("form").toggle();
  },
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("button", {className: "btn btn-info", onClick: this.handleClick}, "设置"), 
        React.createElement("form", {className: "form-inline", style: {display:"none"}}, 
            React.createElement("div", {className: "form-group"}, 
              React.createElement("label", {htmlFor: "workTime"}, "工作时长:"), 
              React.createElement("div", {className: "input-group"}, 
                React.createElement("input", {id: "workTime", type: "text", className: "workTime form-control", defaultValue: this.props.workTime/60}), 
                React.createElement("div", {className: "input-group-addon"}, "分钟")
              )
            ), 
            React.createElement("div", {className: "form-group"}, 
              React.createElement("label", {htmlFor: "restTime"}, "休息时长:"), 
              React.createElement("div", {className: "input-group"}, 
                React.createElement("input", {type: "text", id: "restTime", className: "restTime form-control", defaultValue: this.props.restTime/60}), 
                React.createElement("div", {className: "input-group-addon"}, "分钟")
              )
            )
        )
      )
    );
  }
});

ReactDOM.render(React.createElement(App, null),document.getElementById("Pomodoro"));