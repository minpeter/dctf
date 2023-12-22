import { Component } from "preact";
import config from "../config";

import Markdown from "../components/markdown";
import withStyles from "../components/jss";

export default withStyles(
  {},
  class Home extends Component {
    componentDidMount() {
      document.title = config.ctfName;
    }

    render({ classes }) {
      return (
        <div class="row u-center">
          <div class={`col-6 ${classes.content}`}>
            <Markdown content={config.homeContent} />
          </div>
        </div>
      );
    }
  }
);
