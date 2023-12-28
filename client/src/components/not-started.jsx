import Clock from "../icons/clock.svg";
import config from "../config";

const NotStarted = () => (
  <div class="row">
    <div>
      <img src={Clock} style={{ filter: "invert(1)" }} />
      <h4>{config.ctfName} has not started yet.</h4>
    </div>
  </div>
);

export default NotStarted;
