import withStyles from "./jss";

const Footer = ({ classes }) => (
  <div class={classes.root}>
    <span>
      Powered by{" "}
      <a
        href="https://rctf.redpwn.net/"
        target="_blank"
        rel="noopener noreferrer"
      >
        rCTF
      </a>
    </span>
  </div>
);

export default withStyles({}, Footer);
