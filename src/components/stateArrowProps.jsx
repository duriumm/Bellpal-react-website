
var botToTopProps = {
  color: "#F76F8E", //#96616B
  startAnchor: { position: "top", offset: { rightness: 15 } },
  endAnchor: { position: "bottom", offset: { rightness: 15 } }
}
var returnTopToBotProps = {
  color: "#F76F8E",
  startAnchor: { position: "bottom", offset: { rightness: -15 } },
  endAnchor: { position: "top", offset: { rightness: -15 } }
}
var sensingToNotifyAutoFall = {
  color: "#F76F8E",
  startAnchor: { position: "right", offset: { bottomness: -20 } },
  endAnchor: { position: "left" },
  curveness: 0.2
}
var sensingToNotifyManualAlarm = {
  color: "#F76F8E",
  startAnchor: { position: "right", offset: { bottomness: 40, rightness: -15 } },
  endAnchor: { position: "left", offset: { bottomness: 0 } },
  curveness: 0.3
}
var manualFallToSendAlarm = {
  color: "#F76F8E",
  startAnchor: { position: "right" },
  endAnchor: { position: "bottom" },
  curveness: 1
}
var autoFallNotifyToSendAlarm = {
  color: "#F76F8E",
  startAnchor: { position: "right" },
  endAnchor: { position: "top" },
  curveness: 1
}
var autoFallNotifyToResetAlarm = {
  color: "#F76F8E",
  startAnchor: { position: "bottom" },
  endAnchor: { position: "top" },
}
var sendingToResetAlarm = {
  color: "#F76F8E",
  startAnchor: { position: "left" },
  endAnchor: { position: "right" },
}
var sendingToConfirmAlarm = {
  color: "#F76F8E",
  startAnchor: { position: "top", offset: { rightness: -20, bottomness: 5 } },
  endAnchor: { position: "right" },
  curveness: 0.5
}
var alarmConfirmedToResetAlarm = {
  color: "#F76F8E",
  opacity: 0.2,
  startAnchor: { position: "bottom", offset: { rightness: 15 } },
  endAnchor: { position: "left", offset: { bottomness: -15 } },
  curveness: 0.5
}
var resettingAlarmToSensing = {
  color: "#F76F8E",
  startAnchor: { position: "left", offset: { bottomness: 40, rightness: 15 } },
  endAnchor: { position: "right", offset: { bottomness: 30, rightness: -10 } },
  curveness: 0.3
}
var manualAlarmToResetAlarm = {
  color: "#F76F8E",
  startAnchor: { position: "top" },
  endAnchor: { position: "bottom" }
}


export const xArrowProps = {
  botToTopProps, 
  returnTopToBotProps,
  sensingToNotifyAutoFall,
  sensingToNotifyManualAlarm,
  manualFallToSendAlarm,
  autoFallNotifyToSendAlarm,
  autoFallNotifyToResetAlarm,
  sendingToResetAlarm,
  sendingToConfirmAlarm,
  alarmConfirmedToResetAlarm,
  resettingAlarmToSensing,
  manualAlarmToResetAlarm
}