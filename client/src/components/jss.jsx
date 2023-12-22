import { Component } from "preact";
import { create as jssCreate } from "jss";

export default (styles, Wrap) => {
  return class withStyles extends Component {
    render() {
      return (
        <Wrap
          {...this.props}
          classes={jssCreate({}).createStyleSheet(styles).classes}
        />
      );
    }
  };
};
