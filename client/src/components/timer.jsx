import config from "../config";
import { useEffect, useState } from "preact/hooks";
import { formatAbsoluteTimeWithTz } from "../util/time";

const Timer = () => {
  const [time, setTime] = useState(Date.now());
  useEffect(() => {
    const intervalId = setInterval(() => setTime(Date.now()), 1000);
    return () => clearInterval(intervalId);
  }, []);
  if (time > config.endTime) {
    return <div class="row">The CTF is over.</div>;
  }
  const targetEnd = time > config.startTime;
  const targetTime = targetEnd ? config.endTime : config.startTime;
  const timeLeft = targetTime - time;
  const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60)) % 24;
  const minutesLeft = Math.floor(timeLeft / (1000 * 60)) % 60;
  const secondsLeft = Math.floor(timeLeft / 1000) % 60;
  return (
    <div class="row">
      <div>
        <span>{daysLeft}</span>
        <span>{hoursLeft}</span>
        <span>{minutesLeft}</span>
        <span>{secondsLeft}</span>
        <span>Days</span>
        <span>Hours</span>
        <span>Minutes</span>
        <span>Seconds</span>
        <span>
          until {config.ctfName} {targetEnd ? "ends" : "starts"}
        </span>
        <span>{formatAbsoluteTimeWithTz(targetTime)}</span>
      </div>
    </div>
  );
};

export default Timer;
