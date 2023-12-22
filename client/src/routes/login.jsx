import { Component } from "preact";
import config from "../config";

import { login, setAuthToken } from "../api/auth";
import GithubButton from "../components/github-button";
import GithubAdditional from "../components/github-additional";
import PendingToken from "../components/pending-token";

class Login extends Component {
  state = {
    teamToken: "",
    errors: {},
    disabledButton: false,
    githubToken: undefined,
    githubName: undefined,
    pendingAuthToken: null,
    pendingUserName: null,
    pending: false,
  };

  componentDidMount() {
    document.title = `Login | ${config.ctfName}`;
    (async () => {
      const qs = new URLSearchParams(location.search);
      if (qs.has("token")) {
        this.setState({
          pending: true,
        });

        const loginRes = await login({ teamToken: qs.get("token") });
        if (loginRes.authToken) {
          this.setState({
            pendingAuthToken: loginRes.authToken,
          });
        }
        this.setState({
          pending: false,
        });
      }
    })();
  }

  render({}, { githubToken, githubName, pendingAuthToken, pending }) {
    if (githubToken) {
      return (
        <GithubAdditional githubToken={githubToken} githubName={githubName} />
      );
    }
    if (pending) {
      return null;
    }
    if (pendingAuthToken) {
      return <PendingToken authToken={pendingAuthToken} />;
    }
    return (
      <div class={`row u-center `}>
        <h4>Log in to {config.ctfName}</h4>

        <GithubButton class="col-12" onGithubDone={this.handleGithubDone} />
      </div>
    );
  }

  handleGithubDone = async ({ githubToken, githubName }) => {
    this.setState({
      disabledButton: true,
    });
    const loginRes = await login({ githubToken });
    if (loginRes.authToken) {
      setAuthToken({ authToken: loginRes.authToken });
    }
    if (loginRes && loginRes.badUnknownUser) {
      this.setState({
        githubToken,
        githubName,
      });
    }
  };

  handlePendingLoginClick = () => {
    setAuthToken({ authToken: this.state.pendingAuthToken });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({
      disabledButton: true,
    });

    let teamToken = this.state.teamToken;
    let url;
    try {
      url = new URL(teamToken);
      if (url.searchParams.has("token")) {
        teamToken = url.searchParams.get("token");
      }
    } catch {}

    const result = await login({
      teamToken,
    });
    if (result.authToken) {
      setAuthToken({ authToken: result.authToken });
      return;
    }
    this.setState({
      errors: result,
      disabledButton: false,
    });
  };
}

export default Login;
