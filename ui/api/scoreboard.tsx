import { request } from "./util";

export const getScoreboard = ({
  division,
  limit = 100,
  offset = 0,
}: {
  division: string;
  limit?: number;
  offset?: number;
}) => {
  return request("GET", "/leaderboard/now", {
    division,
    limit,
    offset,
  });
};
