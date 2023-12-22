import { Component } from "preact";
import GithubLogo from "../icons/github.svg";
import openPopup from "../util/github";
import { githubCallback } from "../api/auth";
import { withToast } from "../components/toast";

export default withToast(
  class GithubButton extends Component {
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
      if (evt.data.kind !== "githubCallback") {
        return;
      }
      if (this.oauthState === null || evt.data.state !== this.oauthState) {
        return;
      }
      const { kind, message, data } = await githubCallback({
        githubCode: evt.data.githubCode,
      });
      if (kind !== "goodGithubToken") {
        this.props.toast({
          body: message,
          type: "error",
        });
        return;
      }
      this.props.onGithubDone(data);
    };

    handleClick = () => {
      this.oauthState = openPopup();
    };

    render({ ...props }) {
      return (
        <div {...props}>
          <button onClick={this.handleClick}>
            <img src={GithubLogo} />
            <span>Sign in with GitHub</span>
          </button>
        </div>
      );
    }
  }
);
