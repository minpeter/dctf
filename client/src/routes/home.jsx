import { Component } from "preact";
import config from "../config";

import Markdown from "../components/markdown";

export default class Home extends Component {
  componentDidMount() {
    document.title = config.ctfName;
  }

  render() {
    return (
      <div class="u-center">
        <Markdown content={config.homeContent} />
      </div>
    );
  }
}
