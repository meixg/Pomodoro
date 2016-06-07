var App = React.createClass({
  getInitialState: function () {
    return {
      workTime: 45*60,
      restTime: 10,
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
      <div>
        <TimeDisplay time={this.state.time} percent={this.state.time/this.state.workTime*100}></TimeDisplay>
        <ControlPanel handleStartWork={this.handleStartWork} handleStartRest={this.handleStartRest} handleStop={this.handleStop} working={working}></ControlPanel>
        <Setting ref="setting"></Setting>
      </div>
    );
  }
});
var TimeDisplay = React.createClass({//剩余时间显示模块
  render: function(){
    return (
      <div className="display">
        <div>{this.props.time}</div>
        <div className="progress">
          <div className="progress-bar" style={{width : this.props.percent+"%"}}></div>
        </div>
      </div>
    );
  }
});
var ControlPanel = React.createClass({//控制面板
  render() {
    if(this.props.working){
      return (
        <div>
          <button onClick={this.props.handleStop}>停止</button>
        </div>
        );
    }else{
      return (
        <div>
          <button onClick={this.props.handleStartWork}>开始工作</button>
          <button onClick={this.props.handleStartRest}>开始休息</button>
        </div>
      )
    }
  }
});
var Setting = React.createClass({//设置
  handleClick: function(e){
    $(e.target).parent().find(".items").toggle();
  },
  render() {
    return (
      <div>
        <button onClick={this.handleClick}>设置</button>
        <div className="items"  style={{display:"none"}}>
          <label htmlFor="workTime">工作时长:</label><input id="workTime" type="text" className="workTime"/>
          <label htmlFor="restTime">休息时长:</label><input type="text" id="restTime" className="restTime"/>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<App></App>,document.getElementById("Pomodoro"));