import config from "../config";

const NotStarted = () => (
  <div class="row">
    <div>
      <i class="fa fa-wrapper fa-clock" style={{ fontSize: "28px" }} />
      <h4>{config.ctfName} has not started yet.</h4>
    </div>
  </div>
);

export default NotStarted;
