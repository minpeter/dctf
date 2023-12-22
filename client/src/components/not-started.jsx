import withStyles from "./jss";
import Clock from "../icons/clock.svg";
import config from "../config";

const NotStarted = withStyles({}, ({ classes }) => (
  <div class="row">
    <div class={`card u-center col-6 ${classes.card}`}>
      <div class={classes.icon}>
        <img src={Clock} />
      </div>
      <h4>{config.ctfName} has not started yet.</h4>
    </div>
  </div>
));

export default NotStarted;
