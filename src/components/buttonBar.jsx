import React, { useState, useEffect, useRef, Fragment } from "react";
import StateButton from "./stateButton";
import AlarmButton from "./alarmButtons"

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional

import Xarrow from "react-xarrows";

import { xArrowProps } from "./stateArrowProps"
import { panelTexts } from "./stateInfoPanelText"



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

const topBtnArray = [
  { btnId: "lightSleepStateBtn", textOnBtn: "Light Sleep" },
  { btnId: "EMPTYBTN1", textOnBtn: "" },
  { btnId: "notifyingAppFallAlarmStateBtn", textOnBtn: "Notifying App Fall Alarm" },
  { btnId: "EMPTYBTN2", textOnBtn: "" }
];
const midTopBtnArray = [
  { btnId: "sensingStateBtn", textOnBtn: "Sensing" },
  { btnId: "alarmConfirmedStateBtn", textOnBtn: "Alarm Confirmed" },
  { btnId: "EMPTYBTN3", textOnBtn: "" },
  { btnId: "EMPTYBTN4", textOnBtn: "" }
];
const midBtnArray = [
  { btnId: "factoryDefaultStateBtn", textOnBtn: "Factory Default" },
  { btnId: "EMPTYBTN5", textOnBtn: "" },
  { btnId: "resettingAlarmStateBtn", textOnBtn: "Resetting Alarm" },
  { btnId: "sendingAlarmStateBtn", textOnBtn: "Sending Alarm" }
];
const botBtnArray = [
  { btnId: "deepSleepStateBtn", textOnBtn: "Deep Sleep" },
  { btnId: "EMPTYBTN6", textOnBtn: "" },
  { btnId: "notifyingAppManualAlarmStateBtn", textOnBtn: "Notify App Manual Alarm" },
  { btnId: "EMPTYBTN7", textOnBtn: "" }

];
const allArrows = [
  "deepSleepToFactoryArrow",
  "factoryDefaultToDeepSleepArrow",
  "factoryDefaultToSensingArrow",
  "sensingToFactoryDefaultArrow",
  "sensingToLightSleep",
  "lightSleepToSensing",
  "sensingToNotifyingFallAlarm",
  "sensingToNotifyingManualAlarm",
  "notifyingManualAlarmToSendingAlarm",
  "notifyingFallAlarmToSendingAlarm",
  "notifyingFallAlarmToResettingAlarm",
  "sendingAlarmToResettingAlarm",
  "notifyingManualAlarmToResettingAlarm",
  "sendingAlarmToAlarmConfirmed",
  "alarmConfirmedToResettingAlarm",
  "resettingAlarmToSensing"
];

let waitFiveSeconds = 5000;
let waitTenSeconds = 10000;

const ButtonBar = () => {

  const [counter, setCounter] = useState(0);
  const [alarmed, setAlarmed] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [currentState, setCurrentState] = useState(ENUMSTATE.DEEP_SLEEP_STATE);
  const [previousButton, setPreviousButton] = useState(null);
  const [isAlarmingFollowers, setIsAlarmingFollowers] = useState(false);
  const [isFactoryResetActive, setIsFactoryResetActive] = useState(false);
  const [blinkingLEDintervalId, setBlinkingLEDintervalId] = useState(null);
  const [currentStateInfoPanelText, setCurrentStateInfoPanelText] = useState("No text");

  const initialRender = useRef(true);

  const switchImages = (stringOfPicToChange) => {
    let imgToChangeId = document.getElementById("bellpalWatchRegular"); // Id of image to change

    if (imgToChangeId.getAttribute("src") == "BellpalWatch_ORIGINAL_new.png") {
      imgToChangeId.src = stringOfPicToChange;
    }
    else if (imgToChangeId.getAttribute("src") == stringOfPicToChange) {
      imgToChangeId.src = "BellpalWatch_ORIGINAL_new.png";
    }
    else {
      console.log("WROOONG");
    }
  }

  const disableAllArrows = (arrowId) => {
    for (var arrow of allArrows) {
      disableArrow(arrow);
    }
  }

  const disableArrow = (arrowId) => {
    document.getElementById(arrowId).style.opacity = 0.3;
  }
  const enableArrow = (arrowId) => {
    document.getElementById(arrowId).style.opacity = 0.9;
  }

  // Function to switch between two images so watch LED appears to be blinking in a certain color
  const startBlinking = (stringOfPicToChange) => {
    // Clear previous interval and set the render image to original bellpalWatch image without LED light
    clearInterval(blinkingLEDintervalId);
    let imgToChangeId = document.getElementById("bellpalWatchRegular"); // Id of image to changg
    imgToChangeId.src = "BellpalWatch_ORIGINAL_new.png";

    // Start interval with specific id and switch image between original BP image and color changed BP image
    const blinkLEDId = setInterval(() => {
      switchImages(stringOfPicToChange);
    }, 1000);
    setBlinkingLEDintervalId(blinkLEDId);
  }

  useEffect(() => {

    // On FIRST render of the webpage we set initialRender to false and return
    // Otherwise this useEffect() acts on the isAlarmingFollowers === true
    // this is to NOT set label to "alarm sent to followers" on startup
    if (initialRender.current) {
      initialRender.current = false;
      document.getElementById("EMPTYBTN1").style.opacity = 0; // renderes the empty button invisible
      document.getElementById("EMPTYBTN2").style.opacity = 0; // renderes the empty button invisible
      document.getElementById("EMPTYBTN3").style.opacity = 0; // renderes the empty button invisible
      document.getElementById("EMPTYBTN4").style.opacity = 0; // renderes the empty button invisible
      document.getElementById("EMPTYBTN5").style.opacity = 0; // renderes the empty button invisible
      document.getElementById("EMPTYBTN6").style.opacity = 0; // renderes the empty button invisible
      document.getElementById("EMPTYBTN7").style.opacity = 0; // renderes the empty button invisible
      return;
    }
    // If we are alarming followers we need to clear the counter interval and enable "confirm alarm btn"
    else if (isAlarmingFollowers === true) {
      console.log("We acted on isAlarmingFollowers");
      document.getElementById("TopAlarmLabel").className = "badge badge-danger";
      document.getElementById("TopAlarmLabel").innerHTML = "Alarm sent to followers!";

      clearInterval(intervalId);
      setCounter(0);
      enableButton("ConfirmAlarmBtn");

      setIsAlarmingFollowers(false);
    }
    else {
      console.log("We DID NOT act on isAlarmingFollowers");
    }
  }, [isAlarmingFollowers]);

  const confirmWatchAlarmFromPhone = () => {
    setCurrentState(ENUMSTATE.ALARM_CONFIRMED_STATE);
  };

  const changeOpacityOnStateButton = (buttonId) => {
    if (previousButton != null) { document.getElementById(previousButton).style.opacity = 0.3; }
    document.getElementById(buttonId).style.opacity = 1.0;
    setPreviousButton(buttonId);
  };

  // Statehandler below. Change settings based on what state we are currently in
  useEffect(() => {

    let timerGang;
    if (currentState === ENUMSTATE.DEEP_SLEEP_STATE) {
      setCurrentStateInfoPanelText(panelTexts.state.deepSleep);
      disableAllArrows();
      enableArrow("deepSleepToFactoryArrow");
      document.getElementById("bellpalWatchRegular").src = "BellpalWatch_ORIGINAL_new.png"
      clearInterval(blinkingLEDintervalId);

      changeOpacityOnStateButton("deepSleepStateBtn");
      disableButton("ConfirmAlarmBtn");
      disableButton("ConnectWatchToPhone");
      enableButton("QuickPress"); // Enters factory default
      disableButton("ShortHold");
      disableButton("MediumHold");
      disableButton("LongHold");
      disableButton("SimulateAutomaticFallAlarmBtn");

      document.getElementById("TopAlarmLabel").className = "badge badge-dark";
      document.getElementById("TopAlarmLabel").innerHTML = "In deep sleep mode";

      // Resetting the factoryReset bool to false to not get stuck in deep sleep state
      if (isFactoryResetActive === true) { setIsFactoryResetActive(false); }
    }
    else if (currentState === ENUMSTATE.FACTORY_DEFAULT_STATE) {
      setCurrentStateInfoPanelText(panelTexts.state.factoryDefault);
      disableAllArrows();
      enableArrow("factoryDefaultToDeepSleepArrow");
      enableArrow("factoryDefaultToSensingArrow");
      if (isFactoryResetActive === false) {
        startBlinking("BellpalWatch_BLUE_new.png");
      }

      changeOpacityOnStateButton("factoryDefaultStateBtn");

      timerGang = setTimeout(() => setCurrentState(ENUMSTATE.DEEP_SLEEP_STATE), 120000);// Changes back to deepSleep state after 120 sec // CHANGE TO 120 SEC

      disableButton("ConfirmAlarmBtn");
      enableButton("ConnectWatchToPhone");
      disableButton("QuickPress");
      disableButton("ShortHold");
      disableButton("MediumHold");
      disableButton("LongHold");
      disableButton("SimulateAutomaticFallAlarmBtn");

      document.getElementById("TopAlarmLabel").className = "badge badge-primary custom-Blue-Badge";
      document.getElementById("TopAlarmLabel").innerHTML = "Looking for bluetooth connection";

      // If factoryReset bool is true we will go through this.factoryDefault state to deep sleep state
      if (isFactoryResetActive === true) {
        // Need to clear the above timer timerGang since we are using a new timer for isFactoryResetActive mode 
        clearTimeout(timerGang);
        clearInterval(blinkingLEDintervalId); // Clearing this so we dont blink as we pass towards deep sleep state
        timerGang = setTimeout(() => setCurrentState(ENUMSTATE.DEEP_SLEEP_STATE), 2000); // Deep sleep after 2sec
        disableButton("ConnectWatchToPhone");
        document.getElementById("TopAlarmLabel").innerHTML = "Passing through Factory default state";
      }
    }
    else if (currentState === ENUMSTATE.SENSING_STATE) {
      setCurrentStateInfoPanelText(panelTexts.state.sensing);
      disableAllArrows();
      enableArrow("sensingToFactoryDefaultArrow");
      enableArrow("sensingToLightSleep");
      enableArrow("sensingToNotifyingFallAlarm");
      enableArrow("sensingToNotifyingManualAlarm");
      document.getElementById("bellpalWatchRegular").src = "BellpalWatch_ORIGINAL_new.png"
      clearInterval(blinkingLEDintervalId);

      timerGang = setTimeout(() => setCurrentState(ENUMSTATE.LIGHT_SLEEP_STATE), 120000); // Changes state to lightSleep after 10 sec (inactivity)// CHANGE TO 120 SEC

      changeOpacityOnStateButton("sensingStateBtn");
      disableButton("ConfirmAlarmBtn");
      disableButton("ConnectWatchToPhone");
      disableButton("QuickPress");  // Man får grönt ljus men ingen action
      enableButton("ShortHold");    // Man får grönt ljus och vid 10s trigarr man manual alarm
      disableButton("MediumHold");  // Man får grönt ljus men ingen action
      enableButton("LongHold");     // Man får grönt ljus och gör factory reset efter 30s
      enableButton("SimulateAutomaticFallAlarmBtn");

      document.getElementById("TopAlarmLabel").className = "badge badge-primary custom-Badge-Connected";
      document.getElementById("TopAlarmLabel").innerHTML = "Connected to phone and sensing";

      // If we make a factory reset we need to go through this.sensing state to factory default state 
      if (isFactoryResetActive === true) {
        clearInterval(blinkingLEDintervalId); // Clearing this so we dont blink as we pass towards deep sleep state
        document.getElementById("TopAlarmLabel").innerHTML = "Passing through Sensing state";
        // Need to clear the above timer since we are using a new timer for isFactoryResetActive mode 
        clearTimeout(timerGang);
        timerGang = setTimeout(() => setCurrentState(ENUMSTATE.FACTORY_DEFAULT_STATE), 2000); // Factory default after 2sec 
        disableButton("ShortHold");    // On factory reset we need to disable all buttons
        disableButton("LongHold");     // On factory reset we need to disable all buttons
        disableButton("SimulateAutomaticFallAlarmBtn");
      }
    }
    else if (currentState === ENUMSTATE.LIGHT_SLEEP_STATE) {
      setCurrentStateInfoPanelText(panelTexts.state.lightSleep);
      disableAllArrows();
      enableArrow("lightSleepToSensing");
      document.getElementById("bellpalWatchRegular").src = "BellpalWatch_ORIGINAL_new.png"
      clearInterval(blinkingLEDintervalId);
      changeOpacityOnStateButton("lightSleepStateBtn");
      disableButton("ConfirmAlarmBtn");
      disableButton("ConnectWatchToPhone");
      disableButton("QuickPress");  // Man får grönt ljus men ingen action
      enableButton("ShortHold");    // Man får grönt ljus och vid 10s trigarr man manual alarm
      disableButton("MediumHold");  // Man får grönt ljus men ingen action
      enableButton("LongHold");     // Man får grönt ljus och gör factory reset efter 30s
      enableButton("SimulateAutomaticFallAlarmBtn");

      document.getElementById("TopAlarmLabel").className = "badge badge-dark";
      document.getElementById("TopAlarmLabel").innerHTML = "Light sleeping mode active";
    }
    else if (currentState === ENUMSTATE.NOTIFYING_APP_FALL_ALARM_STATE) {
      setCurrentStateInfoPanelText(panelTexts.state.notifyingAppFallAlarm);
      disableAllArrows();
      enableArrow("notifyingFallAlarmToSendingAlarm");
      enableArrow("notifyingFallAlarmToResettingAlarm");
      startBlinking("BellpalWatch_RED_new.png");
      changeOpacityOnStateButton("notifyingAppFallAlarmStateBtn");
      disableButton("ConfirmAlarmBtn");
      disableButton("ConnectWatchToPhone");
      disableButton("QuickPress");
      disableButton("ShortHold");
      enableButton("MediumHold");   // Reset alarm
      enableButton("LongHold");     // Factory reset watch
      disableButton("SimulateAutomaticFallAlarmBtn");

      // 5 second timer before we enter Sending alarm state
      timerGang = setTimeout(() => setCurrentState(ENUMSTATE.SENDING_ALARM_STATE), waitTenSeconds);

      document.getElementById("TopAlarmLabel").className = "badge badge-info custom-Badge-Trying-Send";
      document.getElementById("TopAlarmLabel").innerHTML = "Notifying a fall alarm to the app";
    }
    else if (currentState === ENUMSTATE.NOTIFYING_APP_MANUAL_ALARM_STATE) {
      setCurrentStateInfoPanelText(panelTexts.state.notifyingAppManualAlarm);
      disableAllArrows();
      enableArrow("notifyingManualAlarmToSendingAlarm");
      enableArrow("notifyingManualAlarmToResettingAlarm");
      startBlinking("BellpalWatch_RED_new.png");
      changeOpacityOnStateButton("notifyingAppManualAlarmStateBtn");
      disableButton("ConfirmAlarmBtn");
      disableButton("ConnectWatchToPhone");
      disableButton("QuickPress");
      disableButton("ShortHold");
      enableButton("MediumHold");   // Reset alarm
      enableButton("LongHold");     // Factory reset watch
      disableButton("SimulateAutomaticFallAlarmBtn");

      // 5 second timer before we enter Sending alarm state
      timerGang = setTimeout(() => setCurrentState(ENUMSTATE.SENDING_ALARM_STATE), waitTenSeconds);

      document.getElementById("TopAlarmLabel").className = "badge badge-info custom-Badge-Trying-Send";
      document.getElementById("TopAlarmLabel").innerHTML = "Notifying a manual alarm to the app";
    }
    else if (currentState === ENUMSTATE.SENDING_ALARM_STATE) {
      setCurrentStateInfoPanelText(panelTexts.state.sendingAlarm);
      disableAllArrows();
      enableArrow("sendingAlarmToResettingAlarm");
      enableArrow("sendingAlarmToAlarmConfirmed");
      startBlinking("BellpalWatch_RED_new.png");
      changeOpacityOnStateButton("sendingAlarmStateBtn");
      disableButton("ConnectWatchToPhone");
      disableButton("QuickPress");
      disableButton("ShortHold");
      enableButton("MediumHold");   // Reset alarm
      enableButton("LongHold");     // Factory reset watch
      disableButton("SimulateAutomaticFallAlarmBtn");

      timerGang = startAlarmCounter();

      document.getElementById("TopAlarmLabel").className = "badge badge-warning";
      document.getElementById("TopAlarmLabel").innerHTML = "Alarm confirmed. 30 sec until alarm starts";
    }
    else if (currentState === ENUMSTATE.ALARM_CONFIRMED_STATE) {
      setCurrentStateInfoPanelText(panelTexts.state.alarmConfirmed);
      disableAllArrows();
      enableArrow("alarmConfirmedToResettingAlarm");
      startBlinking("BellpalWatch_GREEN_new.png");
      changeOpacityOnStateButton("alarmConfirmedStateBtn");
      disableButton("ConfirmAlarmBtn");
      disableButton("ConnectWatchToPhone");
      disableButton("QuickPress");
      disableButton("ShortHold");
      enableButton("MediumHold");   // Reset alarm
      enableButton("LongHold");     // Factory reset watch
      disableButton("SimulateAutomaticFallAlarmBtn");

      document.getElementById("TopAlarmLabel").className = "badge badge-success";
      document.getElementById("TopAlarmLabel").innerHTML = "Alarm confirmed by follower";
    }
    else if (currentState === ENUMSTATE.RESETTING_ALARM_STATE) {
      setCurrentStateInfoPanelText(panelTexts.state.resettingAlarm);
      disableAllArrows();
      enableArrow("resettingAlarmToSensing");
      document.getElementById("bellpalWatchRegular").src = "BellpalWatch_ORIGINAL_new.png"
      clearInterval(blinkingLEDintervalId);
      setAlarmed(false);
      clearInterval(intervalId);
      setCounter(0);

      changeOpacityOnStateButton("resettingAlarmStateBtn");
      disableButton("ConfirmAlarmBtn");
      disableButton("ConnectWatchToPhone");
      disableButton("QuickPress");
      disableButton("ShortHold");
      disableButton("MediumHold");
      disableButton("LongHold");
      disableButton("SimulateAutomaticFallAlarmBtn");
      // if isFactoryResetActive === true we need to go through sensing state towards deep sleep state. Although we
      // ALWAYS go to sensing state from reset state so here it is not a problem.
      timerGang = setTimeout(() => setCurrentState(ENUMSTATE.SENSING_STATE), waitTenSeconds); // Changes state to Sensing state after 10 sec ((waitFiveSeconds)) 
      document.getElementById("TopAlarmLabel").className = "badge badge-secondary";
      document.getElementById("TopAlarmLabel").innerHTML = "Resetting Alarm";
      if (isFactoryResetActive === true) {
        document.getElementById("TopAlarmLabel").innerHTML = "Passing through Resetting Alarm state";
      }
    }
    return (() => {
      // Each time currentSTate is being modified we clear the timer timerGang
      clearTimeout(timerGang);
    });
  }, [currentState]);


  const startAlarmCounter = () => {
    // Resetting the counter and clearing the interval if there was any previously.
    // Then we start the counter interval and assign it to our variable
    setCounter(0);
    clearInterval(intervalId);
    setAlarmed(true);
    const id = setInterval(() => {
      setCounter((counter) => counter + 1);
    }, 1000);
    setIntervalId(id);

    const timerGang = setTimeout(() => setIsAlarmingFollowers(true), waitTenSeconds); // After 10 sec we change a boolean to display that alarm is being sent to followers // SHOULD BE 30sek IRL
    return timerGang;
  }

  const connectWatchToPhone = () => {
    setCurrentState(ENUMSTATE.SENSING_STATE);

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
    if (alarmed === false && (currentState === ENUMSTATE.LIGHT_SLEEP_STATE || currentState === ENUMSTATE.SENSING_STATE)) {
      setCurrentState(ENUMSTATE.NOTIFYING_APP_MANUAL_ALARM_STATE);
      // TO-DO - Make an "Automatic fall alarm button" available in light sleep and sensing state
    }
    else { console.log("TEST well well well alarmed is: " + alarmed); }
  };

  // Medium hold(10s) will reset the current alarm
  const handleOnWatchButton_MediumHold = () => {
    setCurrentState(ENUMSTATE.RESETTING_ALARM_STATE);
  };

  // Long hold(30s) will set state back to deepSleep state
  const handleOnWatchButton_LongHold = () => {
    setIsFactoryResetActive(true);
    if (currentState === ENUMSTATE.LIGHT_SLEEP_STATE) {
      setCurrentState(ENUMSTATE.SENSING_STATE);
    }
    else if (currentState === ENUMSTATE.SENSING_STATE) {
      setCurrentState(ENUMSTATE.FACTORY_DEFAULT_STATE);
    }
    else {
      setCurrentState(ENUMSTATE.RESETTING_ALARM_STATE);
    }
  };

  const simulateAutomaticFallAlarm = () => {
    setCurrentState(ENUMSTATE.NOTIFYING_APP_FALL_ALARM_STATE);
  };

  return (
    <div>
      <div id="container">
        <div id="leftSide">
          <nav id="navbarLeft" className="navbar navbar-dark bg-primary" style={{ border: "" }}>Alarm buttons</nav>
          <h2> <span className="badge m-2 badge-light custom-Badge">{counter}</span> </h2>
          <div>
            <h3> <p className="badge m-2 badge-primary" id="TopAlarmLabel">Alarm is not active</p> </h3>
          </div>
          <div>
            <img id="bellpalWatchRegular" src="BellpalWatch_ORIGINAL_new.png"></img>
          </div>

          {/* AUTOMATIC FALL, CONFIRM ALARM AND CONNECT WATCH TO PHONE BUTTONS BELOW */}
          <div className="btn-group-vertical m-2">
            <AlarmButton id="SimulateAutomaticFallAlarmBtn" onHoverText="Press this button to simulate an automatic fall alarm triggered by
              the watch fall algorithm. This will make the watch enter Notify App Fall Alarm state and continue into Sending Alarm state"
              className="btn btn-danger btn-sm btn-Automatic-Fall m-1" onClickFunctionName={() => simulateAutomaticFallAlarm()} buttonsText="Automatic fall alarm" >
            </AlarmButton>

            <AlarmButton id="ConfirmAlarmBtn" onHoverText="Press this button to simulate that an alarm has been confirmed by any follower of the wearer"
              className="btn btn-danger btn-sm btn-Confirm-Alarm m-1" onClickFunctionName={() => confirmWatchAlarmFromPhone()} buttonsText="Confirm Alarm From Phone" >
            </AlarmButton>

            <AlarmButton id="ConnectWatchToPhone" onHoverText="Press this button to simulate a successful bluetooth pairing from the watch to a smartphone"
              className="btn btn-danger btn-sm btn-Connect-To-Phone m-1" onClickFunctionName={() => connectWatchToPhone()} buttonsText="Connect Watch To Phone" >
            </AlarmButton>
          </div>

          {/* WATCH ALARM BUTTON VARIATIONS BELOW */}
          <div className="btn-group-vertical m-3">         
            <AlarmButton id="QuickPress" onHoverText="Pressing the alarm button quickly will make the watch go from Deep Sleep state to Factory Default state"
              className="btn btn-danger btn-sm btn-Quick-Press m-1" onClickFunctionName={() => handleOnWatchButton_QuickPress()} buttonsText="Quick press" >
            </AlarmButton>

            <AlarmButton id="ShortHold" onHoverText="Holding the watch alarm button for 2 seconds will initiate the alarm
              function. This will make the watch enter Notify App Manual Alarm state and continue to the Sending Alarm state"
              className="btn btn-danger btn-sm btn-Short-Hold m-1" onClickFunctionName={() => handleOnWatchButton_ShortHold()} buttonsText="Short hold" >
            </AlarmButton>

            <AlarmButton id="MediumHold" onHoverText="Holding the watch alarm button for 10 seconds will initiate a reset of the ongoing alarm.
              This will make the watch enter Resetting State and continue to Sensing State" className="btn btn-danger btn-sm btn-Medium-Hold m-1"
              onClickFunctionName={() => handleOnWatchButton_MediumHold()} buttonsText="Medium hold" >
            </AlarmButton>

            <AlarmButton id="LongHold" onHoverText="Holding the watch alarm button for 30 seconds will initiate a factory reset on the watch.
              This reset will step through several states until finally reaching the Deep Sleep state" className="btn btn-danger btn-sm btn-Long-Hold m-1"
              onClickFunctionName={() => handleOnWatchButton_LongHold()} buttonsText="Long hold" >
            </AlarmButton>
          </div>

          <nav id="navbarStateInfo" className="navbar navbar-dark bg-primary" style={{ border: "" }}>State info panel</nav>

          <div id="stateInfoPanel">
            <div id="stateText" style={{ margin: 20, fontSize: 18 }}>
              {currentStateInfoPanelText}
            </div>
          </div>
        </div>

        <div id="rightSide">
          <nav id="navbarRight" className="navbar navbar-dark bg-primary" style={{ border: "" }}>State machine for bellpal watch with the current state highlighted</nav>
          <div>
            {topBtnArray.map((stateBtnObject) => {
              return (
                <StateButton
                  id={stateBtnObject.btnId}
                  text={stateBtnObject.textOnBtn}
                />
              );
            })}
          </div>

          <div>
            {midTopBtnArray.map((stateBtnObject) => {
              return (
                <StateButton
                  id={stateBtnObject.btnId}
                  text={stateBtnObject.textOnBtn}
                />
              );
           })}
          </div>

          <div>
            {midBtnArray.map((stateBtnObject) => {
              return (
                <StateButton
                  id={stateBtnObject.btnId}
                  text={stateBtnObject.textOnBtn}
                />
              );
            })}
          </div>

          <div>
            {botBtnArray.map((stateBtnObject) => {
              return (
                <StateButton
                  id={stateBtnObject.btnId}
                  text={stateBtnObject.textOnBtn}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <Xarrow {...xArrowProps.botToTopProps} id="deepSleepToFactoryArrow" start="deepSleepStateBtn" end="factoryDefaultStateBtn" />
        <Xarrow {...xArrowProps.returnTopToBotProps} id="factoryDefaultToDeepSleepArrow" start="factoryDefaultStateBtn" end="deepSleepStateBtn" />
        <Xarrow {...xArrowProps.botToTopProps} id="factoryDefaultToSensingArrow" start="factoryDefaultStateBtn" end="sensingStateBtn" />
        <Xarrow {...xArrowProps.returnTopToBotProps} id="sensingToFactoryDefaultArrow" start="sensingStateBtn" end="factoryDefaultStateBtn" />
        <Xarrow {...xArrowProps.botToTopProps} id="sensingToLightSleep" start="sensingStateBtn" end="lightSleepStateBtn" />
        <Xarrow {...xArrowProps.returnTopToBotProps} id="lightSleepToSensing" start="lightSleepStateBtn" end="sensingStateBtn" />

        <Xarrow {...xArrowProps.sensingToNotifyAutoFall} id="sensingToNotifyingFallAlarm" start="sensingStateBtn" end="notifyingAppFallAlarmStateBtn" />
        <Xarrow {...xArrowProps.sensingToNotifyManualAlarm} id="sensingToNotifyingManualAlarm" start="sensingStateBtn" end="notifyingAppManualAlarmStateBtn" />
        <Xarrow {...xArrowProps.manualFallToSendAlarm} id="notifyingManualAlarmToSendingAlarm" start="notifyingAppManualAlarmStateBtn" end="sendingAlarmStateBtn" />
        <Xarrow {...xArrowProps.autoFallNotifyToSendAlarm} id="notifyingFallAlarmToSendingAlarm" start="notifyingAppFallAlarmStateBtn" end="sendingAlarmStateBtn" />

        <Xarrow {...xArrowProps.autoFallNotifyToResetAlarm} id="notifyingFallAlarmToResettingAlarm" start="notifyingAppFallAlarmStateBtn" end="resettingAlarmStateBtn" />
        <Xarrow {...xArrowProps.sendingToResetAlarm} id="sendingAlarmToResettingAlarm" start="sendingAlarmStateBtn" end="resettingAlarmStateBtn" />
        <Xarrow {...xArrowProps.manualAlarmToResetAlarm} id="notifyingManualAlarmToResettingAlarm" start="notifyingAppManualAlarmStateBtn" end="resettingAlarmStateBtn" />
        <Xarrow {...xArrowProps.sendingToConfirmAlarm} id="sendingAlarmToAlarmConfirmed" start="sendingAlarmStateBtn" end="alarmConfirmedStateBtn" />
        <Xarrow {...xArrowProps.alarmConfirmedToResetAlarm} id="alarmConfirmedToResettingAlarm" start="alarmConfirmedStateBtn" end="resettingAlarmStateBtn" />
        <Xarrow {...xArrowProps.resettingAlarmToSensing} id="resettingAlarmToSensing" start="resettingAlarmStateBtn" end="sensingStateBtn" />  
      </div>
    </div>
  );
};

export default ButtonBar;
