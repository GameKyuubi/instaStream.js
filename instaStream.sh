#!/bin/bash
window_pid=$(xdotool getwindowfocus getwindowpid)
window_name=$(xdotool getwindowfocus getwindowname)

unset obs_pid
obs_pid=$(pidof obs)
if [ "$obs_pid" = "" ];
then
    echo "OBS is not running, starting OBS."
    pw-jack obs &>/dev/null & echo $!
    obs_pid=$(pidof obs)
fi
echo "OBS is running as PID $obs_pid."

unset helvum_pid
helvum_pid=$(pidof helvum)
if [ "$helvum_pid" = "" ];
then
    echo "Helvum is not running, starting Helvum."
    helvum &>/dev/null & echo $!
    helvum_pid=$(pidof helvum)
fi
echo "Helvum is running as PID $helvum_pid."

echo "window_pid: $window_pid, window_name: $window_name"

npm start
