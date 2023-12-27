import { useState, useCallback, useRef } from "preact/hooks";

import { submitFlag, getSolves } from "../api/challenges";
import { useToast } from "./toast";
import SolvesDialog from "./solves-dialog";
import Markdown from "./markdown";

const ExternalLink = (props) => <a {...props} target="_blank" />;

const markdownComponents = {
  A: ExternalLink,
};

const solvesPageSize = 10;

const Problem = ({ problem, solved, setSolved }) => {
  const { toast } = useToast();

  const hasDownloads = problem.files.length !== 0;

  const [error, setError] = useState(undefined);
  const hasError = error !== undefined;

  const [value, setValue] = useState("");
  const handleInputChange = useCallback((e) => setValue(e.target.value), []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      submitFlag(problem.id, value.trim()).then(({ error }) => {
        if (error === undefined) {
          toast({ body: "Flag successfully submitted!" });

          setSolved(problem.id);
        } else {
          toast({ body: error, type: "error" });
          setError(error);
        }
      });
    },
    [toast, setSolved, problem, value]
  );

  const [solves, setSolves] = useState(null);
  const [solvesPending, setSolvesPending] = useState(false);
  const [solvesPage, setSolvesPage] = useState(1);
  const modalBodyRef = useRef(null);
  const handleSetSolvesPage = useCallback(
    async (newPage) => {
      const { kind, message, data } = await getSolves({
        challId: problem.id,
        limit: solvesPageSize,
        offset: (newPage - 1) * solvesPageSize,
      });
      if (kind !== "goodChallengeSolves") {
        toast({ body: message, type: "error" });
        return;
      }
      setSolves(data.solves);
      setSolvesPage(newPage);
      modalBodyRef.current.scrollTop = 0;
    },
    [problem.id, toast]
  );
  const onSolvesClick = useCallback(
    async (e) => {
      e.preventDefault();
      if (solvesPending) {
        return;
      }
      setSolvesPending(true);
      const { kind, message, data } = await getSolves({
        challId: problem.id,
        limit: solvesPageSize,
        offset: 0,
      });
      setSolvesPending(false);
      if (kind !== "goodChallengeSolves") {
        toast({ body: message, type: "error" });
        return;
      }
      setSolves(data.solves);
      setSolvesPage(1);
    },
    [problem.id, toast, solvesPending]
  );
  const onSolvesClose = useCallback(() => setSolves(null), []);

  return (
    <div>
      <div class="frame__body">
        <div class="row p-0">
          <div class="col-6 p-0">
            <div class="frame__title title">
              {problem.category}/{problem.name}
            </div>
            <div class="frame__subtitle m-0">{problem.author}</div>
          </div>
          <div class="col-6 p-0 u-text-right">
            <a
              class={` ${solvesPending ? "solvesPending" : ""}`}
              onClick={onSolvesClick}
            >
              {problem.solves}
              {problem.solves === 1 ? " solve / " : " solves / "}
              {problem.points}
              {problem.points === 1 ? " point" : " points"}
            </a>
          </div>
        </div>

        <div class="p-0 content p-4 w-80 u-center">
          <div class={`divider  `} />
        </div>

        <div>
          <Markdown
            content={problem.description}
            components={markdownComponents}
          />
        </div>
        <form class="form-section" onSubmit={handleSubmit}>
          <div class="form-group">
            <input
              autocomplete="off"
              autocorrect="off"
              class={`form-group-input input-small  ${
                hasError ? "input-error" : ""
              } ${solved ? "input-success" : ""}`}
              placeholder={`Flag${solved ? " (solved)" : ""}`}
              value={value}
              onChange={handleInputChange}
            />
            <button class={`form-group-btn btn-small`}>Submit</button>
          </div>
        </form>

        {hasDownloads && (
          <div>
            <p class="frame__subtitle m-0">Downloads</p>
            <div class="tag-container">
              {problem.files.map((file) => {
                return (
                  <div class={`tag`} key={file.url}>
                    <a native download href={`${file.url}`}>
                      {file.name}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <SolvesDialog
        solves={solves}
        challName={problem.name}
        solveCount={problem.solves}
        pageSize={solvesPageSize}
        page={solvesPage}
        setPage={handleSetSolvesPage}
        onClose={onSolvesClose}
        modalBodyRef={modalBodyRef}
      />
    </div>
  );
};

export default Problem;
