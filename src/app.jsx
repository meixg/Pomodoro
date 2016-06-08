var App = React.createClass({
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
      <div>
        <h1>番茄工作法</h1>
        <TimeDisplay time={this.state.time} working={working} percent={this.state.time/this.state.workTime*100}></TimeDisplay>
        <ControlPanel handleStartWork={this.handleStartWork} handleStartRest={this.handleStartRest} handleStop={this.handleStop} working={working}></ControlPanel>
        <Setting ref="setting" workTime={this.state.workTime} restTime={this.state.restTime}></Setting>
      </div>
    );
  }
});
var TimeDisplay = React.createClass({//剩余时间显示模块
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
      <div className="display">
        <h2>{minute}:{second}</h2>
        <div className="progress">
          <div className={"progress-bar progress-bar-striped " + active} style={{width : this.props.percent+"%"}}></div>
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
          <button className="btn btn-danger" onClick={this.props.handleStop}>停止</button>
        </div>
        );
    }else{
      return (
        <div>
          <button className="btn btn-success" onClick={this.props.handleStartWork}>开始工作</button>
          <button className="btn btn-success" onClick={this.props.handleStartRest}>开始休息</button>
        </div>
      )
    }
  }
});
var Setting = React.createClass({//设置
  handleClick: function(e){
    $(e.target).parent().find("form").toggle();
  },
  render() {
    return (
      <div>
        <button className="btn btn-info" onClick={this.handleClick}>设置</button>
        <form className="form-inline" style={{display:"none"}}>
            <div className="form-group">
              <label htmlFor="workTime">工作时长:</label>
              <div className="input-group">
                <input id="workTime" type="text" className="workTime form-control" defaultValue={this.props.workTime/60}/>
                <div className="input-group-addon">分钟</div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="restTime">休息时长:</label>
              <div className="input-group">
                <input type="text" id="restTime" className="restTime form-control" defaultValue={this.props.restTime/60}/>
                <div className="input-group-addon">分钟</div>
              </div>
            </div>
        </form>
      </div>
    );
  }
});

ReactDOM.render(<App></App>,document.getElementById("Pomodoro"));