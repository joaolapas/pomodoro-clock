
import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import Countdown from 'react-countdown'
import NotificationSound from './alert.mp3'




function App() {

  
  const [sessionTimer,setSessionTimer] = useState(25)
  const [breakTimer,setBreakTimer] = useState(5)  
  const [sessionOrBreak, setSessionOrBreak] = useState(true)
  //const [running, setRunning] = useState(false)
  const clockRef = useRef();
  const render = ({ formatted: { minutes, seconds }, }) => (<span id='time-left'>{minutes}:{seconds}</span>)
  const audioPlayer = useRef(null);
  let paused = false

  const play = () =>audioPlayer.current.play()
  const stop = () =>audioPlayer.current.stop()

  const reset =()=>{
    //clockRef.current.pause()
    //stop()
    if(sessionTimer ===25 && breakTimer ===5){clockRef.current.stop()}
    setSessionTimer(25)
    setBreakTimer(5)
    setSessionOrBreak(true)
    paused = false;
    
  }

  
 
  let sessionTime= <Countdown 
                  date={Date.now() + (sessionOrBreak?sessionTimer*60000:breakTimer*60000)} 
                  autoStart={paused?true:false}
                  renderer={render}
                  ref={clockRef}
                  onComplete={
                      
                    ()=>{
                      setTimeout(()=>{
                        setSessionOrBreak((x)=>!x)
                        clockRef.current.start()
                        play()},5000
                      )
                    }
                  
                }
                  
                  />
  
                  
  
  
  
 
  
  return (
    <div className="App">
      <div id='counters'>
        <Counter 
          labelId='break-label' 
          label='Break Length' 
          time={breakTimer}
          incrementId='break-increment'
          decrementId='break-decrement'
          lengthId='break-length'
          timer={setBreakTimer}

        />
        <Counter 
          labelId='session-label' 
          label='Session Length' 
          time={sessionTimer}
          incrementId='session-increment'
          decrementId='session-decrement'
          lengthId='session-length'
          timer={setSessionTimer}
        />  
      </div>
      <div id="session-container">
        <h2 id='timer-label'>{sessionOrBreak?'Session':'Break'}</h2>
        <div id='time-left'>{sessionTimer===60?'60:00':sessionTime}</div>
      </div>

      
      <button id='start_stop' onClick={()=>{
                                        if(!paused){
                                          clockRef.current.start()
                                          paused = true 
                                        }else{
                                          clockRef.current.pause()
                                          paused = false
                                        }
      }
                                        

                                      }>Start/Stop</button>

      <button id='reset' onClick={()=>{
        reset()
      }
        
      }>Reset</button>

      <audio id='beep' ref={audioPlayer} src={NotificationSound} />
    </div>
  );
}

const Counter = (props) => {

  const[count, setCount] = useState(props.time)
  
  
 useEffect(()=>{
  setCount(props.time)
 },[props.time])

 
  
  
  const handleCount = (op) =>{
      if(count>=0 && count <= 60){
          setCount((prev)=>op==='up'?prev+1:prev-1) 
          props.timer(count)
      }
      
      
  }

  
  
  const resetCount = () => {
      setCount(props.time)
  }
  
  
  return(
    <div id='break' >
        <h2 id={props.labelId}>{props.label}</h2>
        <div id={props.lengthId} className='count' >{count}</div>
        <div id='container'>
          <button id={props.incrementId} className='up-down' onClick={
              ()=>{
                  if(count<60){
                    handleCount('up')
                    props.timer((prev)=>prev+1)
                  }
              }
          }>+</button>
          <button id={props.decrementId} className='up-down' onClick={
              ()=>{
                  if(count>1){
                      handleCount('down')
                      props.timer((prev)=>prev-1)
                  }
                      
                  
              }
          }>-</button>
        </div>
      </div>
  )

}

export default App;
