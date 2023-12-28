import config from "../config";

import Markdown from "./markdown";

export default () => {
  const { sponsors } = config;
  return (
    <div class="row">
      {sponsors.map((sponsor) => {
        let cl = `card`;
        if (!sponsor.small) cl += " u-flex u-flex-column h-100";

        return (
          <div class={`col-6 `} key={sponsor.name}>
            <div class={cl}>
              <div class="content p-4 w-80">
                {sponsor.icon && (
                  <figure class={`u-center `}>
                    <img src={sponsor.icon} style={{ filter: "invert(1)" }} />
                  </figure>
                )}
                <p class="title level">{sponsor.name}</p>
                <small>
                  <Markdown content={sponsor.description} />
                </small>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
