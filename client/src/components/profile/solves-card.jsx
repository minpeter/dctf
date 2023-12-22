import withStyles from "../jss";
import { formatRelativeTime } from "../../util/time";
import Clock from "../../icons/clock.svg";

const makeSolvesCard = (isPrivate) =>
  withStyles({}, ({ classes, solves }) => {
    return (
      <div class={`card ${classes.root}`}>
        {solves.length === 0 ? (
          <div class={classes.title}>
            <div class={classes.icon}>
              <img src={Clock} />
            </div>
            <h5>This team has no solves.</h5>
          </div>
        ) : (
          <>
            <h5 class={`title ${classes.title}`}>Solves</h5>
            <div class={classes.label}>Category</div>
            <div class={classes.label}>Challenge</div>
            <div class={classes.label}>Solve time</div>
            <div class={classes.label}>Points</div>
            {solves.map((solve) => (
              <div key={solve.id}>
                <div class={`${classes.inlineLabel} ${classes.category}`}>
                  Category
                </div>
                <div class={classes.category}>{solve.category}</div>
                <div class={classes.inlineLabel}>Name</div>
                <div>{solve.name}</div>
                <div class={classes.inlineLabel}>Solve time</div>
                <div>{formatRelativeTime(solve.createdAt)}</div>
                <div class={classes.inlineLabel}>Points</div>
                <div>{solve.points}</div>
              </div>
            ))}
          </>
        )}
      </div>
    );
  });

export const PublicSolvesCard = makeSolvesCard(false);
export const PrivateSolvesCard = makeSolvesCard(true);
