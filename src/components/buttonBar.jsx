import React, { useState, useEffect, useRef} from "react";
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
  const [timer, setTimer] = useState(null);
  const [isAlarmingFollowers, setIsAlarmingFollowers] = useState(false);
  const [isFactoryResetActive, setIsFactoryResetActive] = useState(false);

  const initialRender = useRef(true);

  // const changeStateOnClick = (buttonInputId) => {
  //   // THIS WILL NOT BE NEEDED IN THE FINAL PRODUCT AS WE WONT CHANGE STATES ON THE STATEBUTTONS THEMSELVES
  //   // Gör om detta så inputen från varje knapp är sin egen state så behövs bara 1 setCurrentState(stateInput)
  //   if      (buttonInputId === "lightSleepStateBtn")             { setCurrentState(ENUMSTATE.LIGHT_SLEEP_STATE);                } 
  //   else if (buttonInputId === "notifyingAppFallAlarmStateBtn")  { setCurrentState(ENUMSTATE.NOTIFYING_APP_FALL_ALARM_STATE);   } 
  //   else if (buttonInputId === "alarmConfirmedStateBtn")         { setCurrentState(ENUMSTATE.ALARM_CONFIRMED_STATE);            }
  //   else if (buttonInputId === "sensingStateBtn")                { setCurrentState(ENUMSTATE.SENSING_STATE);                    }
  //   else if (buttonInputId === "resettingAlarmStateBtn")         { setCurrentState(ENUMSTATE.RESETTING_ALARM_STATE);            } 
  //   else if (buttonInputId === "sendingAlarmStateBtn")           { setCurrentState(ENUMSTATE.SENDING_ALARM_STATE);              } 
  //   else if (buttonInputId === "factoryDefaultStateBtn")         { setCurrentState(ENUMSTATE.FACTORY_DEFAULT_STATE);            } 
  //   else if (buttonInputId === "notifyingAppManualAlarmStateBtn"){ setCurrentState(ENUMSTATE.NOTIFYING_APP_MANUAL_ALARM_STATE); } 
  //   else if (buttonInputId === "deepSleepStateBtn")              { setCurrentState(ENUMSTATE.DEEP_SLEEP_STATE);                 }
  // };

  // Denna useEffect tittar om det är första render av websidan. 
  // Är det första gången så returnerar vi. Annars kör vi på som vanligt.
  // Detta för att inte sätta label till "alarm sent to followers" från start.
  useEffect(() => {
    
    if (initialRender.current) {
      initialRender.current = false;
      return;
    } 
    else if(isAlarmingFollowers === true){
      // TO-DO - Fixa denna kodsnuytt finare
      console.log("We are alarming followers");
      setTimer(clearTimeout(timer)); // clear timer for safety
      document.getElementById("TopAlarmLabel").className = "badge badge-danger";
      document.getElementById("TopAlarmLabel").innerHTML = "Alarm sent to followers!";
  
      clearInterval(intervalId); 
      setCounter(0);
      enableButton("ConfirmAlarmBtn");

      setIsAlarmingFollowers(false);
    }  
    else{
      console.log("We didnt enter clausze");
    }
  }, [isAlarmingFollowers]);

  const confirmWatchAlarmFromPhone = () => {
    setCurrentState(ENUMSTATE.ALARM_CONFIRMED_STATE);
  }


  const changeOpacityOnStateButton = (buttonId) => {
    if (previousButton != null) { document.getElementById(previousButton).style.opacity = 0.5; }
    document.getElementById(buttonId).style.opacity = 1.0;
    setPreviousButton(buttonId); 
  };

  // Enable and Disable buttons each time currentState is being changed
  useEffect(() => {

    let timerGang;
    if(currentState === ENUMSTATE.DEEP_SLEEP_STATE){

      changeOpacityOnStateButton("deepSleepStateBtn");
      disableButton("ConfirmAlarmBtn"); 
      disableButton("ConnectWatchToPhone");
      enableButton("QuickPress"); // Enters factory default
      disableButton("ShortHold");
      disableButton("MediumHold");
      disableButton("LongHold");

      document.getElementById("TopAlarmLabel").className = "badge badge-dark";
      document.getElementById("TopAlarmLabel").innerHTML = "In deep sleep mode";

      // Resetting the factoryReset bool to not get stuck in deep sleep state
      if(isFactoryResetActive === true){
        setIsFactoryResetActive(false);
      }
    }
    else if(currentState === ENUMSTATE.FACTORY_DEFAULT_STATE){

      changeOpacityOnStateButton("factoryDefaultStateBtn");
      // TO-DO - Make watch LED blink accordingly to state (blue,null)
      timerGang = setTimeout(() => setCurrentState(ENUMSTATE.DEEP_SLEEP_STATE), 10000);// Changes back to deepSleep state after 10 sec // CHANGE TO 120 SEC

      disableButton("ConfirmAlarmBtn"); 
      enableButton("ConnectWatchToPhone");
      disableButton("QuickPress");
      disableButton("ShortHold");
      disableButton("MediumHold");
      disableButton("LongHold");

      document.getElementById("TopAlarmLabel").className = "badge badge-primary";
      document.getElementById("TopAlarmLabel").innerHTML = "Looking for bluetooth connection";

      // If factoryReset bool is true we will go through this.factoryDefault state to deep sleep state
      if(isFactoryResetActive === true){
        //setTimer(clearTimeout(timer)); // Clear timer so we dont go back to deep sleep state
        timerGang = setTimeout(() => setCurrentState(ENUMSTATE.DEEP_SLEEP_STATE), 2000); // Deep sleep after 2sec
        disableButton("ConnectWatchToPhone");
        document.getElementById("TopAlarmLabel").innerHTML = "Passing through Factory default state";
      }
    }


    else if(currentState === ENUMSTATE.SENSING_STATE){

      timerGang = setTimeout(() => setCurrentState(ENUMSTATE.LIGHT_SLEEP_STATE), 5000); // Changes state to lightSleep after 5 sec (inactivity)// CHANGE TO 120 SEC

      changeOpacityOnStateButton("sensingStateBtn");
      disableButton("ConfirmAlarmBtn"); 
      disableButton("ConnectWatchToPhone");
      disableButton("QuickPress");  // Man får grönt ljus men ingen action
      enableButton("ShortHold");    // Man får grönt ljus och vid 10s trigarr man manual alarm
      disableButton("MediumHold");  // Man får grönt ljus men ingen action
      enableButton("LongHold");     // Man får grönt ljus och gör factory reset efter 30s

      document.getElementById("TopAlarmLabel").className = "badge badge-primary";
      document.getElementById("TopAlarmLabel").innerHTML = "Connected to phone and sensing";

      // If we make a factory reset we need to go through this.sensing state to factory default state 
      if(isFactoryResetActive === true){
        document.getElementById("TopAlarmLabel").innerHTML = "Passing through Sensing state";
        // Need to clear the above timer since we are using a new timer for isFactoryResetActive mode 
        clearTimeout(timerGang);
        timerGang = setTimeout(() => setCurrentState(ENUMSTATE.FACTORY_DEFAULT_STATE), 2000); // Factory default after 2sec
        disableButton("ShortHold");    // On factory reset we need to disable all buttons
        disableButton("LongHold");     // On factory reset we need to disable all buttons
      }
    }
    else if(currentState === ENUMSTATE.LIGHT_SLEEP_STATE){
      changeOpacityOnStateButton("lightSleepStateBtn");
      disableButton("ConfirmAlarmBtn"); 
      disableButton("ConnectWatchToPhone");
      disableButton("QuickPress");  // Man får grönt ljus men ingen action
      enableButton("ShortHold");    // Man får grönt ljus och vid 10s trigarr man manual alarm
      disableButton("MediumHold");  // Man får grönt ljus men ingen action
      enableButton("LongHold");     // Man får grönt ljus och gör factory reset efter 30s

      document.getElementById("TopAlarmLabel").className = "badge badge-dark";
      document.getElementById("TopAlarmLabel").innerHTML = "Light sleeping mode active";
    }
    else if(currentState === ENUMSTATE.NOTIFYING_APP_FALL_ALARM_STATE){
      changeOpacityOnStateButton("notifyingAppFallAlarmStateBtn");
      disableButton("ConfirmAlarmBtn"); 
      disableButton("ConnectWatchToPhone");
      disableButton("QuickPress");  
      disableButton("ShortHold");
      enableButton("MediumHold");   // Reset alarm
      enableButton("LongHold");     // Factory reset watch

      // 3 second timer before we enter Sending alarm state and clear the timer
      timerGang = setTimeout(() => setCurrentState(ENUMSTATE.SENDING_ALARM_STATE), 3000); 

      document.getElementById("TopAlarmLabel").className = "badge badge-info";
      document.getElementById("TopAlarmLabel").innerHTML = "Trying to send automatic fall alarm to phone";
    }
    else if(currentState === ENUMSTATE.NOTIFYING_APP_MANUAL_ALARM_STATE){
      changeOpacityOnStateButton("notifyingAppManualAlarmStateBtn");
      disableButton("ConfirmAlarmBtn"); 
      disableButton("ConnectWatchToPhone");
      disableButton("QuickPress");  
      disableButton("ShortHold");
      enableButton("MediumHold");   // Reset alarm
      enableButton("LongHold");     // Factory reset watch


      // 3 second timer before we enter Sending alarm state and clear the timer
      timerGang = setTimeout(() => setCurrentState(ENUMSTATE.SENDING_ALARM_STATE), 3000); 

      document.getElementById("TopAlarmLabel").className = "badge badge-info";
      document.getElementById("TopAlarmLabel").innerHTML = "Trying to send manual alarm to phone";
    }
    else if(currentState === ENUMSTATE.SENDING_ALARM_STATE){
      changeOpacityOnStateButton("sendingAlarmStateBtn");

      disableButton("ConnectWatchToPhone");
      disableButton("QuickPress");  
      disableButton("ShortHold");
      enableButton("MediumHold");   // Reset alarm
      enableButton("LongHold");     // Factory reset watch
      
      timerGang = startAlarmCounter(); // is this not being reset
      
      document.getElementById("TopAlarmLabel").className = "badge badge-warning";
      document.getElementById("TopAlarmLabel").innerHTML = "App received alarm from watch, 30sec before alarm is sent to followers";
    }
    else if(currentState === ENUMSTATE.ALARM_CONFIRMED_STATE){
      changeOpacityOnStateButton("alarmConfirmedStateBtn");
      disableButton("ConfirmAlarmBtn");     
      disableButton("ConnectWatchToPhone");
      disableButton("QuickPress");  
      disableButton("ShortHold");
      enableButton("MediumHold");   // Reset alarm
      enableButton("LongHold");     // Factory reset watch

      document.getElementById("TopAlarmLabel").className = "badge badge-success";
      document.getElementById("TopAlarmLabel").innerHTML = "Alarm confirmed by follower";
    }
    else if(currentState === ENUMSTATE.RESETTING_ALARM_STATE){
      setAlarmed(false);
      changeOpacityOnStateButton("resettingAlarmStateBtn");
      disableButton("ConfirmAlarmBtn"); 
      disableButton("ConnectWatchToPhone");
      disableButton("QuickPress");  
      disableButton("ShortHold");
      disableButton("MediumHold");   
      disableButton("LongHold");    
      // if isFactoryResetActive === true we need to go through sensing state towards deep sleep state. Although we
      // ALWAYS go to sensing state from reset state so here it is not a problem.
      timerGang = setTimeout(() => setCurrentState(ENUMSTATE.SENSING_STATE), 2000); // Changes state to Sensing state after 2 sec
      document.getElementById("TopAlarmLabel").className = "badge badge-secondary";
      document.getElementById("TopAlarmLabel").innerHTML = "Resetting Alarm";
      if(isFactoryResetActive === true){
        document.getElementById("TopAlarmLabel").innerHTML = "Passing through Resetting Alarm state";
      }
    }
    return (() => {
      clearTimeout(timerGang);
    });
  },[currentState]);


  const startAlarmCounter = () => {
    // Resetting the counter and clearing the interval if there was any previously
    // Then we start the counter interval and assign it to our variable
    setCounter(0);
    clearInterval(intervalId);
    setAlarmed(true);
    const id = setInterval(() => {
      setCounter((counter) => counter + 1);
    }, 1000);
    setIntervalId(id);



    console.log("test1");
    const timerGang = setTimeout(() => setIsAlarmingFollowers(true), 3000); // After 3 sec we change a boolean to display that alarm is being sent to followers // SHOULD BE 30sek IRL
    return timerGang;
  }

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
    // This buttonpress lights up a green dot on the watch on some states. TO-DO - for later
    setCurrentState(ENUMSTATE.FACTORY_DEFAULT_STATE);
  };

  // Short hold(2s) will trigger manual alarm but ONLY if watch is not already alarmed
  const handleOnWatchButton_ShortHold = () => {
    if(alarmed === false && (currentState === ENUMSTATE.LIGHT_SLEEP_STATE || currentState === ENUMSTATE.SENSING_STATE)){
      setCurrentState(ENUMSTATE.NOTIFYING_APP_MANUAL_ALARM_STATE);
      // TO-DO - Make an "Automatic fall alarm button" available in light sleep and sensing state
    }
    else{ console.log("TEST well well well alarmed is: "+alarmed);  }
  };

  // Medium hold(10s) will reset the current alarm
  const handleOnWatchButton_MediumHold = () => {
    setAlarmed(false);
    clearInterval(intervalId); 
    setCounter(0);
    setCurrentState(ENUMSTATE.RESETTING_ALARM_STATE);
  };

  // Long hold(30s) will set state back to deepSleep state
  const handleOnWatchButton_LongHold = () => {
    setIsFactoryResetActive(true);
    // TO-DO - Go from currentState -> Reset alarm -> Sensing -> Factory Default -> deep sleep
    setCurrentState(ENUMSTATE.RESETTING_ALARM_STATE);
  };


  
  console.log("Actual active state is: " + currentState);
  
  return (
    <div>
     <h2> <span className="badge m-2 badge-dark">{counter}</span> </h2>
      <div>
        <h3> <p className="badge m-2 badge-primary" id="TopAlarmLabel">Alarm is not active</p> </h3>
      </div>
      
      <button
        id="ConfirmAlarmBtn"
        onClick={() => confirmWatchAlarmFromPhone()}
        className="btn btn-success btn-sm m-2"
      >
        Confirm Alarm From Phone
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
        Alarm btn quick press
      </button>
      <button
        id="ShortHold"
        onClick={() => handleOnWatchButton_ShortHold()}
        className="btn btn-danger btn-sm btn-Short-Hold m-2 "
        data-toggle="dropdown"
      >
        Alarm btn short hold (2s)
      </button>
      <button
        id="MediumHold"
        onClick={() => handleOnWatchButton_MediumHold()}
        className="btn btn-danger btn-sm btn-Medium-Hold m-2"
      >
        Alarm btn medium hold (10s)
      </button>
      <button
        id="LongHold"
        onClick={() => handleOnWatchButton_LongHold()}
        className="btn btn-danger btn-sm btn-Long-Hold m-2"
      >
        Alarm btn medium hold (30s)
      </button>
      {/* Below are all the different state buttons */}
      <br></br>
      <h1>States are shown below with current state highlighted</h1>
      <br></br>
      {/* FRÅGA MUSTAFA */}
      {newArrayInsteadOfMap.map((stateBtnObject) => {
        return (
          <StateButton
            id={stateBtnObject.btnId}
            // changeStateOnClick={changeStateOnClick}
            text={stateBtnObject.textOnBtn}
          />
        );
      })}

    </div>
  );
};

export default ButtonBar;
