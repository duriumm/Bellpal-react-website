import React, { useState, useEffect} from "react";
import { renderIntoDocument } from "react-dom/test-utils";
import StateButton from "./stateButton";

const ENUMSTATE = {
  SENSING_STATE: "SENSING_STATE", // 0
  LIGHT_SLEEP_STATE: "LIGHT_SLEEP_STATE", // 1
  NOTIFYING_APP_FALL_ALARM_STATE: "NOTIFYING_APP_FALL_ALARM_STATE", // 2
  NOTIFYING_APP_MANUAL_ALARM_STATE: "NOTIFYING_APP_MANUAL_ALARM_STATE", // 3
  SENDING_ALARM_STATE: "SENDING_ALARM_STATE", // 4
  ALARM_CONFIRMED_STATE: "ALARM_CONFIRMED_STATE", // 5
  RESETTING_ALARM_STATE: "RESETTING_ALARM_STATE", // 6
  FACTORY_DEFAULT_STATE: "FACTORY_DEFAULT_STATE", // 7
  DEEP_SLEEP_STATE: "DEEP_SLEEP_STATE" // 8
};
 /// CHECK HERE /// CHECK HERE /// CHECK HERE /// CHECK HERE /// CHECK HERE /// CHECK HERE /// CHECK HERE
const newArrayInsteadOfMap = [
  { btnId: "lightSleepStateBtn", textOnBtn: "Light Sleep"},
  { btnId: "notifyingAppFallAlarmStateBtn", textOnBtn: "Notifying App Fall Alarm"},
  { btnId: "alarmConfirmedStateBtn", textOnBtn: "Alarm Confirmed"},
  { btnId: "sensingStateBtn", textOnBtn: "Sensing"},
  { btnId: "resettingAlarmStateBtn", textOnBtn: "Resetting Alarm"},
  { btnId: "sendingAlarmStateBtn", textOnBtn: "Sending Alarm"},
  { btnId: "factoryDefaultStateBtn", textOnBtn: "Factory Default"},
  { btnId: "notifyingAppManualAlarmStateBtn", textOnBtn: "Notify App Manual Alarm"},
  { btnId: "deepSleepStateBtn", textOnBtn: "Deep Sleep"}
  
];


const ButtonBar = () => {

  const [counter, setCounter] = useState(0);
  const [alarmed, setAlarmed] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [currentState, setCurrentState] = useState(ENUMSTATE.DEEP_SLEEP_STATE); // Sätts denna på varje re-render
  const [previousButton, setPreviousButton] = useState(null);
  const [deepSleepTimer, setDeepSleepTimer] = useState(null);

  const changeStateOnClick = (buttonInputId) => {

    // Gör om detta så inputen från varje knapp är sin egen state så behövs bara 1 setCurrentState(stateInput)
    if      (buttonInputId === "lightSleepStateBtn")             { setCurrentState(ENUMSTATE.LIGHT_SLEEP_STATE);                } 
    else if (buttonInputId === "notifyingAppFallAlarmStateBtn")  { setCurrentState(ENUMSTATE.NOTIFYING_APP_FALL_ALARM_STATE);   } 
    else if (buttonInputId === "alarmConfirmedStateBtn")         { setCurrentState(ENUMSTATE.ALARM_CONFIRMED_STATE);            }
    else if (buttonInputId === "sensingStateBtn")                { setCurrentState(ENUMSTATE.SENSING_STATE);                    }
    else if (buttonInputId === "resettingAlarmStateBtn")         { setCurrentState(ENUMSTATE.RESETTING_ALARM_STATE);            } 
    else if (buttonInputId === "sendingAlarmStateBtn")           { setCurrentState(ENUMSTATE.SENDING_ALARM_STATE);              } 
    else if (buttonInputId === "factoryDefaultStateBtn")         { setCurrentState(ENUMSTATE.FACTORY_DEFAULT_STATE);            } 
    else if (buttonInputId === "notifyingAppManualAlarmStateBtn"){ setCurrentState(ENUMSTATE.NOTIFYING_APP_MANUAL_ALARM_STATE); } 
    else if (buttonInputId === "deepSleepStateBtn")              { setCurrentState(ENUMSTATE.DEEP_SLEEP_STATE);                 }
  };

  const changeOpacityOnStateButton = (buttonId) => {
    if (previousButton != null) { document.getElementById(previousButton).style.opacity = 1.0; }
    document.getElementById(buttonId).style.opacity = 0.5;
    setPreviousButton(buttonId); 
  };

  // Enable and Disable buttons each time currentState is being changed
  useEffect(() => {
    console.log("Current state in useEffect but BEFORE check: "+currentState);
    if(currentState === ENUMSTATE.DEEP_SLEEP_STATE){
      setDeepSleepTimer(clearTimeout(deepSleepTimer));
      changeOpacityOnStateButton("deepSleepStateBtn");

      disableButton("ConnectWatchToPhone");
      enableButton("QuickPress"); // Enters factory default
      disableButton("ShortHold");
      disableButton("MediumHold");
      disableButton("LongHold");
      // TO-DO - either here or other place. Turn off the alarm.
    }
    else if(currentState === ENUMSTATE.FACTORY_DEFAULT_STATE){
      changeOpacityOnStateButton("factoryDefaultStateBtn");
      // TO-DO - Make watch LED blink accordingly to state (blue,null)
      
      setDeepSleepTimer(setTimeout(() => setCurrentState(ENUMSTATE.DEEP_SLEEP_STATE), 120000)); // Changes back to deepSleep state after 120 sec

      enableButton("ConnectWatchToPhone");
      disableButton("QuickPress");
      disableButton("ShortHold");
      disableButton("MediumHold");
      disableButton("LongHold");
    }
    else if(currentState === ENUMSTATE.SENSING_STATE){

      setDeepSleepTimer(clearTimeout(deepSleepTimer)); // Clear timer so we dont go back to deep sleep state
      changeOpacityOnStateButton("sensingStateBtn");

      disableButton("ConnectWatchToPhone");
      disableButton("QuickPress");  // Man får grönt ljus men ingen action
      enableButton("ShortHold");    // Man får grönt ljus och vid 10s trigarr man manual alarm
      disableButton("MediumHold");  // Man får grönt ljus men ingen action
      enableButton("LongHold");     // Man får grönt ljus och gör factory reset efter 30s
    }
    else if(currentState === ENUMSTATE.LIGHT_SLEEP_STATE){
      setDeepSleepTimer(clearTimeout(deepSleepTimer)); // Clear timer so we dont go back to deep sleep state
      changeOpacityOnStateButton("lightSleepStateBtn");

      disableButton("ConnectWatchToPhone");
      disableButton("QuickPress");  // Man får grönt ljus men ingen action
      enableButton("ShortHold");    // Man får grönt ljus och vid 10s trigarr man manual alarm
      disableButton("MediumHold");  // Man får grönt ljus men ingen action
      enableButton("LongHold");     // Man får grönt ljus och gör factory reset efter 30s
    }
    else if(currentState === ENUMSTATE.NOTIFYING_APP_FALL_ALARM_STATE){
      setDeepSleepTimer(clearTimeout(deepSleepTimer)); // Clear timer so we dont go back to deep sleep state
      changeOpacityOnStateButton("notifyingAppFallAlarmStateBtn");

      disableButton("ConnectWatchToPhone");
      disableButton("QuickPress");  
      disableButton("ShortHold");
      enableButton("MediumHold");   // Reset alarm
      enableButton("LongHold");     // Factory reset watch
    }
    else if(currentState === ENUMSTATE.NOTIFYING_APP_MANUAL_ALARM_STATE){
      setDeepSleepTimer(clearTimeout(deepSleepTimer)); // Clear timer so we dont go back to deep sleep state
      changeOpacityOnStateButton("notifyingAppManualAlarmStateBtn");

      disableButton("ConnectWatchToPhone");
      disableButton("QuickPress");  
      disableButton("ShortHold");
      enableButton("MediumHold");   // Reset alarm
      enableButton("LongHold");     // Factory reset watch
    }
    else if(currentState === ENUMSTATE.SENDING_ALARM_STATE){
      setDeepSleepTimer(clearTimeout(deepSleepTimer)); // Clear timer so we dont go back to deep sleep state
      changeOpacityOnStateButton("sendingAlarmStateBtn");

      disableButton("ConnectWatchToPhone");
      disableButton("QuickPress");  
      disableButton("ShortHold");
      enableButton("MediumHold");   // Reset alarm
      enableButton("LongHold");     // Factory reset watch
    }
    else if(currentState === ENUMSTATE.ALARM_CONFIRMED_STATE){
      setDeepSleepTimer(clearTimeout(deepSleepTimer)); // Clear timer so we dont go back to deep sleep state
      changeOpacityOnStateButton("alarmConfirmedStateBtn");

      disableButton("ConnectWatchToPhone");
      disableButton("QuickPress");  
      disableButton("ShortHold");
      enableButton("MediumHold");   // Reset alarm
      enableButton("LongHold");     // Factory reset watch
    }
    else if(currentState === ENUMSTATE.RESETTING_ALARM_STATE){
      setDeepSleepTimer(clearTimeout(deepSleepTimer)); // Clear timer so we dont go back to deep sleep state
      changeOpacityOnStateButton("resettingAlarmStateBtn");

      disableButton("ConnectWatchToPhone");
      disableButton("QuickPress");  
      disableButton("ShortHold");
      disableButton("MediumHold");   
      disableButton("LongHold");    
    }
  },[currentState]);


  const connectWatchToPhone = () => {
    setCurrentState(ENUMSTATE.SENSING_STATE);
  };

  const handleOnResetAlarmClick = () => {
    setAlarmed(false);
    clearInterval(intervalId); 
    setCounter(0);
    console.log("REAL COUNTER VAL = " + counter);
  };

  
  const enableButton = (buttonId) => {
    document.getElementById(buttonId).disabled = false;
    document.getElementById(buttonId).style.fontWeight = "bold";
  };
  const disableButton = (buttonId) => {
    document.getElementById(buttonId).disabled = true;
    document.getElementById(buttonId).style.fontWeight = "normal";
  };
  
  const handleOnWatchButton_QuickPress = () => {
    // TO-DO - If we are in deep sleep state, this buttonpress should take us to Factory default state
    //setCurrentState(ENUMSTATE.LIGHT_SLEEP_STATE);
    setCurrentState(ENUMSTATE.FACTORY_DEFAULT_STATE);
    console.log("We pressed quikcpress and entered factory default state");
    
  };

  // Short hold(2s) will trigger manual alarm but ONLY if watch is not already alarmed
  const handleOnWatchButton_ShortHold = () => {
    if(alarmed === false){
      // TO-DO - Enter correct state when manual larm has been triggered - TO-DO
      setAlarmed(true);
      const id = setInterval(() => {
        setCounter((counter) => counter + 1);
      }, 1000);
      setIntervalId(id);
    }
  };

  // Medium hold(10s) will reset the current alarm
  const handleOnWatchButton_MediumHold = () => {
    setAlarmed(false);
    clearInterval(intervalId); 
    setCounter(0);
    console.log("REAL COUNTER VAL = " + counter);
    // TO-DO - Enter correct state when resetting alarm - TO-DO
  };

  // Long hold(30s) will set state back to deepSleep state
  const handleOnWatchButton_LongHold = () => {
    // TO-DO - Turn alarm off here or in state Checker(probably state checker)
    setCurrentState(ENUMSTATE.DEEP_SLEEP_STATE);
    if (previousButton != null) { document.getElementById(previousButton).style.opacity = 1.0; } // Sätter förra knappens opacity till 1.0 för att markera EJ vald (MUTATION!?)}
    document.getElementById("deepSleepStateBtn").style.opacity = 0.5; // Sätter nuvarande knapp till 0.5 för att markera att den är val (MUTATION!?)
    setPreviousButton("deepSleepStateBtn"); // Sätter nuvarande knapp till previous button för att kunna access den senare

  };


  
  console.log("Actual active state is: " + currentState);
  
  return (
    <div>
      <span className="badge m-2 badge-warning">{counter}</span>
      <button
        onClick={() => handleOnResetAlarmClick()}
        className="btn btn-success btn-sm m-2"
      >
        Reset alarm
      </button>
      <button
        id="ConnectWatchToPhone"
        onClick={() => connectWatchToPhone()}
        className="btn btn-primary btn-sm m-2"
      >
        Connect Watch To Phone
      </button>
      <img src="BellpalWatch.png"></img>
      <button
        id="QuickPress"
        onClick={() => handleOnWatchButton_QuickPress()}
        className="btn btn-danger btn-sm btn-Quick-Press m-2"
      >
        Watch Btn Quick press
      </button>
      <button
        id="ShortHold"
        onClick={() => handleOnWatchButton_ShortHold()}
        className="btn btn-danger btn-sm btn-Short-Hold m-2"
      >
        Watch Btn Short hold (2s)
      </button>
      <button
        id="MediumHold"
        onClick={() => handleOnWatchButton_MediumHold()}
        className="btn btn-danger btn-sm btn-Medium-Hold m-2"
      >
        Watch Btn Medium hold (10s)
      </button>
      <button
        id="LongHold"
        onClick={() => handleOnWatchButton_LongHold()}
        className="btn btn-danger btn-sm btn-Long-Hold m-2"
      >
        Watch Btn Long hold (30s)
      </button>
      {/* Below are all the different state buttons */}
      <br></br>
      <h1>hejsan, här nedan har vi alla states</h1>
      <br></br>
      {/* FRÅGA MUSTAFA */}
      {newArrayInsteadOfMap.map((stateBtnObject) => {
        return (
          <StateButton
            id={stateBtnObject.btnId}
            changeStateOnClick={changeStateOnClick}
            text={stateBtnObject.textOnBtn}
          />
        );
      })}

    </div>
  );
};

export default ButtonBar;
