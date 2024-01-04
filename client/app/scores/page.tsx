// "use client";

// import { useState, useEffect, useMemo, useCallback, useRef } from "react";
// // import config from "../config";
// // import Pagination from "@/components/pagination";
// // import NotStarted from "@/components/not-started";

// import { getScoreboard } from "@/api/scoreboard";
// import { privateProfile } from "@/api/profile";

// import toast from "sonner";

// const PAGESIZE_OPTIONS = [25, 50, 100];

// const loadStates = {
//   pending: 0,
//   notStarted: 1,
//   loaded: 2,
// };

// export default function Page() {
//   {
//     // const loggedIn = useMemo(() => localStorage.getItem("token") !== null, []);

//     const loggedIn = useMemo(() => {
//       return false;
//     }, []);
//     const scoreboardPageState = useMemo(() => {
//       const localStorageState = JSON.parse(
//         // localStorage.getItem("scoreboardPageState") || "{}"
//         "{}"
//       );

//       const queryParams = new URLSearchParams(location.search);
//       const queryState: any = {};
//       if (queryParams.has("page")) {
//         const page = parseInt(queryParams.get("page") || "");
//         if (!isNaN(page)) {
//           queryState.page = page;
//         }
//       }
//       if (queryParams.has("pageSize")) {
//         const pageSize = parseInt(queryParams.get("pageSize") || "");
//         if (!isNaN(pageSize)) {
//           queryState.pageSize = pageSize;
//         }
//       }
//       if (queryParams.has("division")) {
//         queryState.division = queryParams.get("division");
//       }

//       return { ...localStorageState, ...queryState };
//     }, []);
//     const [profile, setProfile] = useState<any>(null);
//     const [pageSize, _setPageSize] = useState(
//       scoreboardPageState.pageSize || 100
//     );
//     const [scores, setScores] = useState([]);
//     const [division, _setDivision] = useState(
//       scoreboardPageState.division || "all"
//     );
//     const [page, setPage] = useState(scoreboardPageState.page || 1);
//     const [totalItems, setTotalItems] = useState(0);
//     const [scoreLoadState, setScoreLoadState] = useState(loadStates.pending);
//     const selfRow = useRef();

//     const setDivision = useCallback(
//       (newDivision: string) => {
//         _setDivision(newDivision);
//         setPage(1);
//       },
//       [_setDivision, setPage]
//     );
//     const setPageSize = useCallback(
//       (newPageSize: number) => {
//         _setPageSize(newPageSize);
//         // Try to switch to the page containing the teams that were previously
//         // at the top of the current page
//         setPage(Math.floor(((page - 1) * pageSize) / newPageSize) + 1);
//       },
//       [pageSize, _setPageSize, page, setPage]
//     );

//     useEffect(() => {
//       localStorage.setItem(
//         "scoreboardPageState",
//         JSON.stringify({ pageSize, division })
//       );
//     }, [pageSize, division]);
//     useEffect(() => {
//       if (page !== 1 || location.search !== "") {
//         history.replaceState(
//           {},
//           "",
//           `?page=${page}&division=${encodeURIComponent(
//             division
//           )}&pageSize=${pageSize}`
//         );
//       }
//     }, [pageSize, division, page]);

//     const divisionChangeHandler = useCallback(
//       (e: any) => setDivision(e.target.value),
//       [setDivision]
//     );
//     const pageSizeChangeHandler = useCallback(
//       (e: any) => setPageSize(e.target.value),
//       [setPageSize]
//     );

//     useEffect(() => {
//       document.title = `Scoreboard | Telos`;
//     }, []);
//     useEffect(() => {
//       if (loggedIn) {
//         privateProfile().then(({ data, error }) => {
//           if (error) {
//             // toast.error(error);
//             console.error(error);
//             return;
//           }
//           setProfile(data);
//         });
//       }
//     }, [loggedIn]);

//     useEffect(() => {
//       (async () => {
//         const _division = division === "all" ? undefined : division;
//         const { kind, data } = await getScoreboard({
//           division: _division,
//           offset: (page - 1) * pageSize,
//           limit: pageSize,
//         });
//         setScoreLoadState(
//           kind === "badNotStarted" ? loadStates.notStarted : loadStates.loaded
//         );
//         if (kind !== "goodLeaderboard") {
//           return;
//         }
//         setScores(
//           data.leaderboard.map((entry: any, i: number) => ({
//             ...entry,
//             rank: i + 1 + (page - 1) * pageSize,
//           }))
//         );
//         setTotalItems(data.total);
//       })();
//     }, [division, page, pageSize]);

//     const isUserOnCurrentScoreboard =
//       loggedIn &&
//       profile !== null &&
//       profile.globalPlace !== null &&
//       (division === "all" || Number.parseInt(division) === profile.division);
//     const isSelfVisible = useMemo(() => {
//       if (profile == null) return false;
//       let isSelfVisible = false;
//       // TODO: maybe avoiding iterating over scores again?
//       scores.forEach(({ id }) => {
//         if (id === profile.id) {
//           isSelfVisible = true;
//         }
//       });
//       return isSelfVisible;
//     }, [profile, scores]);
//     const scrollToSelf = useCallback(() => {
//       // selfRow.current.scrollIntoView({ block: "nearest", behavior: "smooth" });

//       const selfRow = document.querySelector(".selected");
//       if (selfRow) {
//         selfRow.scrollIntoView({ block: "nearest", behavior: "smooth" });
//       }
//     }, [selfRow]);
//     const [needsScrollToSelf, setNeedsScrollToSelf] = useState(false);
//     const goToSelfPage = useCallback(() => {
//       if (!isUserOnCurrentScoreboard) return;
//       let place;
//       if (division === "all") {
//         place = profile.globalPlace;
//       } else {
//         place = profile.divisionPlace;
//       }
//       setPage(Math.floor((place - 1) / pageSize) + 1);

//       if (isSelfVisible) {
//         scrollToSelf();
//       } else {
//         setNeedsScrollToSelf(true);
//       }
//     }, [
//       profile,
//       setPage,
//       pageSize,
//       division,
//       isUserOnCurrentScoreboard,
//       isSelfVisible,
//       scrollToSelf,
//     ]);
//     useEffect(() => {
//       if (needsScrollToSelf) {
//         if (isSelfVisible) {
//           scrollToSelf();
//           setNeedsScrollToSelf(false);
//         }
//       }
//     }, [isSelfVisible, needsScrollToSelf, scrollToSelf]);

//     if (scoreLoadState === loadStates.pending) {
//       return null;
//     }

//     if (scoreLoadState === loadStates.notStarted) {
//       // return <NotStarted />;
//       return null;
//     }

//     return (
//       <div className="row u-center">
//         <div className="col-3">
//           <div className={`frame`}>
//             <div className="frame__body">
//               <div className="frame__subtitle">Filter by division</div>
//               <div className="input-control">
//                 <select
//                   required
//                   className="select"
//                   name="division"
//                   value={division}
//                   onChange={divisionChangeHandler}
//                 >
//                   <option value="all" selected>
//                     All
//                   </option>
//                   {Object.entries("open").map(([code, name]) => {
//                     return (
//                       <option key={code} value={code}>
//                         {name}
//                       </option>
//                     );
//                   })}
//                 </select>
//               </div>
//               <div className="frame__subtitle">Teams per page</div>
//               <div className="input-control">
//                 <select
//                   required
//                   className="select"
//                   name="pagesize"
//                   value={pageSize}
//                   onChange={pageSizeChangeHandler}
//                 >
//                   {PAGESIZE_OPTIONS.map((sz) => (
//                     <option key={sz} value={sz}>
//                       {sz}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               {loggedIn && (
//                 <div className="btn-container u-center">
//                   <button
//                     disabled={!isUserOnCurrentScoreboard}
//                     onClick={goToSelfPage}
//                   >
//                     Go to my team
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="col-6">
//           <div className={`frame `}>
//             <div className="frame__body">
//               <table className={`table small `}>
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>Team</th>
//                     <th>Points</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {scores.map(({ id, name, score, rank }) => {
//                     const isSelf = profile != null && profile.id === id;

//                     return (
//                       <tr
//                         key={id}
//                         // className={isSelf ? classes.selected : ""}

//                         // ref={isSelf ? selfRow : null}
//                       >
//                         <td>{rank}</td>
//                         <td>
//                           <a href={`/profile/${id}`}>{name}</a>
//                         </td>
//                         <td>{score}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//             {totalItems > pageSize &&
//               // <Pagination
//               //   {...{ totalItems, pageSize, page, setPage }}
//               //   numVisiblePages={9}
//               // />
//               null}
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

export default function Page() {
  return <></>;
}
