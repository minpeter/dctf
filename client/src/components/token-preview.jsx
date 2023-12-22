import withStyles from "./jss";

export default withStyles({}, ({ classes, token, ...props }) => {
  return (
    <blockquote class={classes.quote} {...props}>
      {token}
    </blockquote>
  );
});
