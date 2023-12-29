import { formatRelativeTime } from "../../util/time";

const makeSolvesCard =
  (isPrivate) =>
  ({ solves }) => {
    return (
      <div class="card">
        {solves.length === 0 ? (
          <div class="content p-4 w-80 u-flex u-flex-column u-center">
            <i class="fab fa-wrapper fa-clock" style={{ fontSize: "50px" }} />
            <h5>No solves yet</h5>
          </div>
        ) : (
          <div class="content p-4 w-80">
            <h5 class="title">Solves</h5>
            <table class="table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Name</th>
                  <th>Solve time</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {solves.map((solve) => (
                  <tr key={solve.id}>
                    <td>{solve.category}</td>
                    <td>{solve.name}</td>
                    <td>{formatRelativeTime(solve.createdAt)}</td>
                    <td>{solve.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

export const PublicSolvesCard = makeSolvesCard(false);
export const PrivateSolvesCard = makeSolvesCard(true);
