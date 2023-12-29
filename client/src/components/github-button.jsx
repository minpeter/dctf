import { Component } from "preact";
import openPopup from "../util/github";
import { githubCallback } from "../api/auth";
import toast from "react-hot-toast";

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
      toast.error(message, { icon: "🔑" });
      return;
    }
    this.props.onGithubDone(data);
  };

  handleClick = () => {
    this.oauthState = openPopup();
  };

  render({ ...props }) {
    return (
      <button
        onClick={this.handleClick}
        {...props}
        class="u-flex u-gap-1 u-items-end p-1"
      >
        <i class="fab fa-wrapper fa-github" style={{ fontSize: "28px" }} />
        Sign in with GitHub
      </button>
    );
  }
}

export default GithubButton;
