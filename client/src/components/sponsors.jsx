import config from "../config";

import Markdown from "./markdown";
import withStyles from "./jss";

export default withStyles({}, ({ classes }) => {
  const { sponsors } = config;
  return (
    <div class="row">
      {sponsors.map((sponsor) => {
        let cl = `card ${classes.card}`;
        if (!sponsor.small) cl += " u-flex u-flex-column h-100";

        return (
          <div class={`col-6 ${classes.row}`} key={sponsor.name}>
            <div class={cl}>
              <div class="content p-4 w-80">
                {sponsor.icon && (
                  <figure class={`u-center ${classes.icon}`}>
                    <img src={sponsor.icon} />
                  </figure>
                )}
                <p class="title level">{sponsor.name}</p>
                <small class={classes.description}>
                  <Markdown content={sponsor.description} />
                </small>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});
