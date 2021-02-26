

var state = {
  deepSleep:"If no mobile successfully connects, pairs and bonds with the watch within"
  +" 120 seconds, the watch stops advertising, turns the LED off, and enters Deep Sleep."
  +" If the user performs a factory reset the watch finally enters Deep Sleep too.",

  factoryDefault: `If there is\n no stored pairing information (either because it’s`
  +" been removed by the user, i.e. factory reset, or because there has never been"
  +" any, i.e. newly delivered from factory) when the watch is powered on or awoken"
  +" from Deep Sleep it will enter Factory Default. Here the watch starts advertising"
  +" its presence to nearby mobile devices for 120 seconds. While advertising, the LED"
  +" indicates this by blinking with a blue light. If a mobile device manages to bond"
  +" successfully, the watch will store the new bonding information and enters Sensing.",

  resettingAlarm: "When in state 2, 3, 4, or 5, if the watch receives a Reset message from"
  +" the mobile app or the user resets the alarm using the button it enters Resetting Alarm."
  +" In Resetting Alarm resetting procedure is performed before the state is immediately"
  +" exited and the watch enters Sensing. If the user factory resets the watch in state 2,"
  +" 3, 4 or 5 it passes through Resetting Alarm too before it enters Sensing, Factory"
  +" Default and finally Deep Sleep.",

  alarmConfirmed: "Once the alarm is confirmed by response centre or any follower/s the"
  +" watch enters Alarm Confirmed. This is indicated by the LED for the user to know"
  +" that someone is aware of and handles the alarm.",

  sendingAlarm: "When the app has confirmed that an alarm has been triggered, manual or"
  +" fall, it enters the Sending Alarm. In Sending the user has a grace period in the app"
  +" where the user can cancel and reset the alarm before it is further escalated. After"
  +" the alarm is escalated the app is awaiting human confirmation of the alarm, either by"
  +" call centre or by one or more follower/s (a user of the app that is following a watch user).",

  notifyingAppManualAlarm: "If an alarm is triggered by the user by pushing the button the"
  +" watch enters Notify App Manual Alarm where it sends a notification to the mobile app."
  +" The watch continuously sends notifications until the app confirms the alarm (enter Sending Alarm)"
  +" or the user resets the alarm with the button (enter Resetting Alarm).",

  notifyingAppFallAlarm: "If a fall is detected the watch enters Notify App Fall Alarm where it sends"
  +" a notification to the mobile app. The watch continuously sends notifications until the app"
  +" confirms the alarm (enter Sending Alarm) or the user resets the alarm with the button (enter Resetting Alarm).",

  lightSleep: "If the watch is non-moving for ca 2 min the watch shuts down most of its systems"
  +" and lowers the threshold value from the accelerometer and enters Light Sleep. Only when the"
  +" accelerometer registers movement above the threshold the watch enters Sensing again. This is"
  +" to save battery if the watch is not worn or simply not moving, e.g. during the night."
  +" If the connection to the mobile app is lost the watch will start to indicate this by blinking"
  +" after a grace period. The blinking can be confirmed/turned off by pressing the button. When"
  +" the mobile app and the watch is reconnected the blinking stops.",

  sensing: "This is the normal state of operation. In Sensing the watch samples accelerometer data,"
  +" feeds it into ImagiMob’s SensorBeat algorithm and handles the result, i.e. whether a fall is"
  +" detected or not. If the watch has previously bonded with the mobile app, the watch will enter"
  +" Sensing when it is powered on. If the connection to the mobile app is lost the watch will start"
  +" to indicate this by blinking after a grace period. The blinking can be confirmed/turned off by"
  +" pressing the button. When the mobile app and the watch is reconnected the blinking stops."
  
} 

export const panelTexts = {
  state
}