import withStyles from "../components/jss";

export default withStyles({}, ({ classes, ...props }) => {
  return (
    <div class="col-12" {...props}>
      <div class={classes.root}>
        <h6>or</h6>
      </div>
    </div>
  );
});
