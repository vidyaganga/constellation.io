import React from 'react';
import './component/timer.css';

class Timer extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      min: 0,
      hr: 0,
      active: false,
      myInterval: 0,
      timeSet: false,
      stoppedEarly: false,
    }
    this.startTimer = this.startTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
  }

  startTimer() {
    this.setState({active:true});
    this.props.activateTimer();
    const t = 60000*this.state.hr + 1000* this.state.min;
    setTimeout(() => {
      console.log("stopped");
      this.props.deactivateTimer();

      if (!this.state.stoppedEarly) {
        this.props.updateMinutes(this.props.startMin + 60*this.props.startHour);
      } else {
        this.setState({active:false, timeSet:false});
      }
    }, t);


    return;
  }

  resetTimer() {
    if (this.active) {
      this.setState({stoppedEarly:true});
    }
    const { active, min, hr, timeSet } = this.state
    this.setState(({active, min, hr, timeSet}) => ({
     active: false,
     min: 0,
     hr: 0,
     timeSet: false
   }))

    clearInterval(this.myInterval);
    this.props.deactivateTimer();


    return;
  }



  componentDidMount() {

    this.myInterval = setInterval(() => {
      const { min, hr, active } = this.state
      if (this.state.active) {
        if (min > 0) {
          this.setState(({min}) => ({
            min: min - 1

          }))
          
        }

        if (min === 0) {
          if (hr === 0) {
            clearInterval(this.myInterval)
          } else {
            this.setState(({hr}) => ({
              hr: hr - 1,
              min: 59

            }))
          }
        }
      }

    }
    , 1000)
  }

  componentWillUnmount() {
    clearInterval(this.myInterval)
  }


  handleChangeHr = (event) => {
      this.setState({
        hr: event.target.value});
    }
  handleChangeMin = (event) => {
      this.setState({min: event.target.value});
    }

  handleSubmit = (event) => {
    this.setState({timeSet: true});
    this.props.setHour(this.state.hr);
    this.props.setMin(this.state.min);
  }

  render() {
    console.log(this.state.active)
    const {min,hr} = this.state;

    return (

      <div className="Timer">
      {this.state.timeSet ?

          <div>
            Session: {this.props.startHour} hours, {this.props.startMin} mins
            {min === 0 && hr === 0
              ? <h1 className = "time"> Times Up! </h1>
              : <div><h1 className = "time" >Time Remaining:{"\n"}</h1>
              <h1 className="Time">
              {hr}:{min < 10 ? `0${min}` : min} </h1></div>}

              {this.state.active? <button onClick = {this.resetTimer}> RESTART </button> :
            <button onClick = {this.startTimer}> START </button>}


            </div>

        :

        <div>
          <center className = "newSession" > NEW SESSION</center>
          <center id="form-box">
            <form onSubmit={this.handleSubmit}>
              <div class = "hrmin">
                <h4> hour </h4>
                <h4> minute </h4>
              </div>  
                 <input className = "timeInput" type="text" value={this.state.hr} onChange={this.handleChangeHr} />
                
                  <input className = "timeInput" type="text" value={this.state.min} onChange={this.handleChangeMin} /><br></br>
              <input className = "submitButton" type="submit" value="Submit" />
              
            </form>
          </center>
        </div>
      }
      </div>
    );
  }

}

export default Timer;
