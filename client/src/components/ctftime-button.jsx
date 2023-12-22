import { Component, h } from "preact";
import GithubLogo from "../icons/github_logo.png";
import openPopup from "../util/ctftime";
import withStyles from "../components/jss";
import { ctftimeCallback } from "../api/auth";
import { withToast } from "../components/toast";

export default withStyles(
  {},
  withToast(
    class CtftimeButton extends Component {
      componentDidMount() {
        window.addEventListener("message", this.handlePostMessage);
      }

      componentWillUnmount() {
        window.removeEventListener("message", this.handlePostMessage);
      }

      oauthState = null;

      handlePostMessage = async (evt) => {
        if (evt.origin !== location.origin) {
          return;
        }
        if (evt.data.kind !== "ctftimeCallback") {
          return;
        }
        if (this.oauthState === null || evt.data.state !== this.oauthState) {
          return;
        }
        const { kind, message, data } = await ctftimeCallback({
          ctftimeCode: evt.data.ctftimeCode,
        });
        if (kind !== "goodCtftimeToken") {
          this.props.toast({
            body: message,
            type: "error",
          });
          return;
        }
        this.props.onCtftimeDone(data);
      };

      handleClick = () => {
        this.oauthState = openPopup();
      };

      render({ classes, ...props }) {
        return (
          <div {...props}>
            <button class={classes.githubButton} onClick={this.handleClick}>
              <img src={GithubLogo} className={classes.GithubLogo} />
            </button>
          </div>
        );
      }
    }
  )
);
