import React, { useState } from "react";
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
  { btnString: "lightSleepStateBtn", textOnBtn: "Light<br />Sleep"}
];
 /// CHECK HERE /// CHECK HERE /// CHECK HERE /// CHECK HERE /// CHECK HERE /// CHECK HERE /// CHECK HERE
const buttonMap = new Map([
  ["lightSleepStateBtn", "Light<br />Sleep"],
  ["notifyingAppFallAlarmStateBtn", "Notifying<br />App<br />Fall Alarm"],
  ["alarmConfirmedStateBtn", "Alarm<br />Confirmed"],
  ["sensingStateBtn", "Sensing"],
  ["resettingAlarmStateBtn", "Resetting<br /> Alarm"],
  ["sendingAlarmStateBtn", "Sending<br />Alarm"],
  ["factoryDefaultStateBtn", "Factory<br />Default"],
  ["notifyingAppManualAlarmStateBtn", "Notify App<br />Manual<br/ >Alarm"],
  ["deepSleepStateBtn", "Deep<br />Sleep"]
])

const ButtonBar = () => {
  // FRÅGA MUSTAFA
  // Skapar jag upp en ny Enumstate här varje re-render?
  // jag borde ha denna nere i min useState(); eller hur?
  // FRÅGA MUSTAFA
  // const ENUMSTATE = {
  //   SENSING_STATE: "SENSING_STATE",                                       // 0
  //   LIGHT_SLEEP_STATE: "LIGHT_SLEEP_STATE",                               // 1
  //   NOTIFYING_APP_FALL_ALARM_STATE: "NOTIFYING_APP_FALL_ALARM_STATE",     // 2
  //   NOTIFYING_APP_MANUAL_ALARM_STATE: "NOTIFYING_APP_MANUAL_ALARM_STATE", // 3
  //   SENDING_ALARM_STATE: "SENDING_ALARM_STATE",                           // 4
  //   ALARM_CONFIRMED_STATE: "ALARM_CONFIRMED_STATE",                       // 5
  //   RESETTING_ALARM_STATE: "RESETTING_ALARM_STATE",                       // 6
  //   FACTORY_DEFAULT_STATE: "FACTORY_DEFAULT_STATE",                       // 7
  //   DEEP_SLEEP_STATE: "DEEP_SLEEP_STATE",                                 // 8
  // };

  const [counter, setCounter] = useState(0);
  const [alarmed, setAlarmed] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [currentState, setCurrentState] = useState(ENUMSTATE.DEEP_SLEEP_STATE); // Sätts denna på varje re-render
  const [listOfButtons, setListOfButtons] = useState([
    "lightSleepStateBtn",
    "notifyingAppFallAlarmStateBtn",
    "alarmConfirmedStateBtn",
    "sensingStateBtn",
    "resettingAlarmStateBtn",
    "sendingAlarmStateBtn",
    "factoryDefaultStateBtn",
    "notifyingAppManualAlarmStateBtn",
    "deepSleepStateBtn"
    // FIXA DESSA SOM dict(map) MED LINE BREAK TEXTEN
  ]);
  const [previousButton, setPreviousButton] = useState(null);

  const changeOpacityAndStateOnClick = (buttonInputId) => {
    if (previousButton != null) {
      document.getElementById(previousButton).style.opacity = 1.0; // Sätter förra knappens opacity till 1.0 för att markera EJ vald (MUTATION!?)
    }
    document.getElementById(buttonInputId).style.opacity = 0.5; // Sätter nuvarande knapp till 0.5 för att markera att den är val (MUTATION!?)

    setPreviousButton(buttonInputId); // Sätter nuvarande knapp till previous button för att kunna access den senare

    if (buttonInputId === "lightSleepStateBtn") {
      setCurrentState(ENUMSTATE.LIGHT_SLEEP_STATE);
    } else if (buttonInputId === "notifyingAppFallAlarmStateBtn") {
      setCurrentState(ENUMSTATE.NOTIFYING_APP_FALL_ALARM_STATE);
    } else if (buttonInputId === "alarmConfirmedStateBtn") {
      setCurrentState(ENUMSTATE.ALARM_CONFIRMED_STATE);
    } else if (buttonInputId === "sensingStateBtn") {
      setCurrentState(ENUMSTATE.SENSING_STATE);
    } else if (buttonInputId === "resettingAlarmStateBtn") {
      setCurrentState(ENUMSTATE.RESETTING_ALARM_STATE);
    } else if (buttonInputId === "sendingAlarmStateBtn") {
      setCurrentState(ENUMSTATE.SENDING_ALARM_STATE);
    } else if (buttonInputId === "factoryDefaultStateBtn") {
      setCurrentState(ENUMSTATE.FACTORY_DEFAULT_STATE);
    } else if (buttonInputId === "notifyingAppManualAlarmStateBtn") {
      setCurrentState(ENUMSTATE.NOTIFYING_APP_MANUAL_ALARM_STATE);
    } else if (buttonInputId === "deepSleepStateBtn") {
      setCurrentState(ENUMSTATE.DEEP_SLEEP_STATE);
    }
  };

  const changeOpacity = () => {
    setListOfButtons([]);
  };

  const handleOnAlarmClick = () => {
    setAlarmed(true);
    const id = setInterval(() => {
      setCounter((counter) => counter + 1);
    }, 1000);
    setIntervalId(id);
  };

  const handleOnResetAlarmClick = () => {
    setAlarmed(false);
    clearInterval(intervalId); // DENNA INTERVAL GÅR INTE ATT CLEARA HÄR. SÄTT EN BOOL OCH CLEARA DEN NERE I "MAIN"
    setCounter(0);
    console.log("REAL COUNTER VAL = " + counter);
  };

  const handleOnWatchButton_QuickPress = () => {
    //setCurrentState(ENUMSTATE.LIGHT_SLEEP_STATE);
    console.log("current enumstate is: " + currentState);
  };

  const handleOnWatchButton_ShortHold = () => {};

  const handleOnWatchButton_MediumHold = () => {};

  const handleOnWatchButton_LongHold = () => {};

  // "DETTA E TYP MAIN HEHHEH"
  if (currentState == ENUMSTATE.SENSING_STATE) {
    console.log("we are in sensing state bruh");

    document.getElementById("sensingStateBtn").style.opacity = "0.5";

    // for (const button of listOfButtons) {

    //   console.log("Knapp i listan: " + button);

    // }
    listOfButtons.forEach((element) => {
      console.log(element);
    });
  }

  // Denna if sats kör på varje RE-render av något objekt
  // if(counter >= 30){
  //   clearInterval(intervalId);
  // }
  console.log("Current active state is: " + currentState);

  console.log("NU SKRIVER VI UT SKITEN");
  for (const [key, value] of buttonMap.entries()) {
    console.log(key, value);
  }

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
        onClick={() => handleOnAlarmClick()}
        className="btn btn-danger btn-sm m-2"
      >
        Start Alarm
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
      {/* {listOfButtons.map((stateBtn) => {
        return (
          <StateButton
            id={stateBtn}
            changeOpacityAndStateOnClick={changeOpacityAndStateOnClick}
            text={'hej'}
          />
        );
      })} */}
      {/* {console.log(buttonMap.values())}  // skrivs ut korrekt */}
      {/* {console.log(buttonMap.keys())}     // skrivs ut korrekt */}

      {/* dONT USE THIS BELOW, USE NEW ARRAY WITH OBJECTS INSTEAD */}
      {
        buttonMap.forEach((btnIdString, btnText) => {
          return(
            <StateButton
              id={"DUDU"}
              changeOpacityAndStateOnClick={changeOpacityAndStateOnClick}
              text={"HEJ"}
            />
          );
        })
      }
      {/* <button
        id="lightSleepStateBtn"
        onClick={() => changeOpacityAndStateOnClick("lightSleepStateBtn")} // HÄR skulle jag vilja ha buttons variabel id som argument istället för en sträng
        type="button"
        class="btn btn-primary btn-circle btn-xl m-2"
      >
        Light<br></br>Sleep
      </button>
      mellanrummellanmellanrummellanmel
      <button
        id="notifyingAppFallAlarmStateBtn"
        onClick={() =>
          changeOpacityAndStateOnClick("notifyingAppFallAlarmStateBtn")
        }
        type="button"
        class="btn btn-primary btn-circle btn-xl m-2"
      >
        Notifying<br></br>App<br></br>Fall Alarm
      </button>
      <br></br>
      mellanrummellanmellanrummellanrumemememememem
      <button
        id="alarmConfirmedStateBtn"
        onClick={() => changeOpacityAndStateOnClick("alarmConfirmedStateBtn")}
        type="button"
        class="btn btn-primary btn-circle btn-xl m-2"
      >
        Alarm<br></br>Confirmed
      </button>
      <br></br>
      <button
        id="sensingStateBtn"
        onClick={() => changeOpacityAndStateOnClick("sensingStateBtn")}
        type="button"
        class="btn btn-primary btn-circle btn-xl m-2"
      >
        Sensing
      </button>
      mellanrummemellanrummellanmememe
      <button
        id="resettingAlarmStateBtn"
        onClick={() => changeOpacityAndStateOnClick("resettingAlarmStateBtn")}
        type="button"
        class="btn btn-primary btn-circle btn-xl m-2"
      >
        Reset<br></br> Alarm
      </button>
      mellanrummellanmelmellanrummellan
      <button
        id="sendingAlarmStateBtn"
        onClick={() => changeOpacityAndStateOnClick("sendingAlarmStateBtn")}
        type="button"
        class="btn btn-primary btn-circle btn-xl m-2"
      >
        Sending<br></br>Alarm
      </button>
      <br></br>
      <button
        id="factoryDefaultStateBtn"
        onClick={() => changeOpacityAndStateOnClick("factoryDefaultStateBtn")}
        type="button"
        class="btn btn-primary btn-circle btn-xl m-2"
      >
        Factory<br></br>Default
      </button>
      mellanrummellanmelmellanrummellan
      <button
        id="notifyingAppManualAlarmStateBtn"
        onClick={() =>
          changeOpacityAndStateOnClick("notifyingAppManualAlarmStateBtn")
        }
        type="button"
        class="btn btn-primary btn-circle btn-xl m-2"
      >
        Notify App<br></br>Manual<br></br>Alarm
      </button>
      <br></br>
      <button
        id="deepSleepStateBtn"
        onClick={() => changeOpacityAndStateOnClick(ENUMSTATE.DEEP_SLEEP_STATE)}
        type="button"
        class="btn btn-primary btn-circle btn-xl m-2"
      >
        Deep<br></br>Sleep
      </button> */}
    </div>
  );
};

export default ButtonBar;
