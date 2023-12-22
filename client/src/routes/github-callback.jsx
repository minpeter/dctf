import { Component } from "preact";

export default class GithubCallback extends Component {
  componentDidMount() {
    window.opener.postMessage(
      {
        kind: "githubCallback",
        state: this.props.state,
        githubCode: this.props.code,
      },
      location.origin
    );
    window.close();
  }

  render() {
    return null;
  }
}
