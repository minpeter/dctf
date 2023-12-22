import { Component } from "preact";
import config from "../config";

import Markdown from "../components/markdown";

export default class Home extends Component {
  componentDidMount() {
    document.title = config.ctfName;
  }

  render() {
    return (
      <div class="row u-center">
        <div class="col-6">
          <Markdown content={config.homeContent} />
        </div>
      </div>
    );
  }
}
