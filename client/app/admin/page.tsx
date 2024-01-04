"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { v4 as uuid } from "uuid";

import { getChallenges } from "@/api/admin";
import AdminProblem from "@/components/adminproblem";

type AdminProblemProps = {
  id?: string;
  name: string;
  description: string;
  category: string;
  author: string;
  files: string[];
  points: {
    min: number;
    max: number;
  };

  flag: string;
  dklodd: {
    env: string;
    Image: string;
    type: string;
  };
};

const SAMPLE_PROBLEM: AdminProblemProps = {
  name: "",
  description: "",
  category: "",
  author: "",
  files: [],
  points: {
    min: 100,
    max: 500,
  },
  flag: "",
  dklodd: {
    env: "",
    Image: "",
    type: "web",
  },
};

export default function Page() {
  // const p1: ProblemProps = {
  //   id: "1",
  //   name: "sanity-check",
  //   description: "I get to write the sanity check challenge! Alright!",
  //   category: "misc",
  //   author: "minpeter",
  //   files: [],
  //   points: 485,
  //   solves: 1,
  //   dynamic: "web",
  // };
  // return (
  //   <>
  //     admin page
  //     <Problem problem={p1} solved={true} setSolved={() => {}} />
  //   </>
  // );
  const [problems, setProblems] = useState<any[]>([]);

  // newId is the id of the new problem. this allows us to reuse code for problem creation
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const newId = useMemo(() => uuid(), [problems]);

  const completeProblems = problems.concat({
    ...SAMPLE_PROBLEM,
    id: newId,
  });

  useEffect(() => {
    document.title = `Admin Panel | Telos`;
  }, []);

  useEffect(() => {
    const action = async () => {
      setProblems(await getChallenges());
    };
    action();
  }, []);

  const deleteProblem = useCallback(
    ({ problem }: { problem: AdminProblemProps }) => {
      setProblems(problems.filter((p) => p.id !== problem.id));
    },
    [problems]
  );

  const updateProblem = useCallback(
    ({ problem }: { problem: AdminProblemProps }) => {
      let nextProblems = completeProblems;

      // If we aren't creating new problem, remove sample problem first
      if (problem.id !== newId) {
        nextProblems = nextProblems.filter((p) => p.id !== newId);
      }
      setProblems(
        nextProblems.map((p) => {
          // Perform partial update by merging properties
          if (p.id === problem.id) {
            return {
              ...p,
              ...problem,
            };
          }
          return p;
        })
      );
    },
    [newId, completeProblems]
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {completeProblems.map((problem) => {
        return (
          <AdminProblem
            update={updateProblem}
            delete={deleteProblem}
            key={problem.id}
            problem={problem}
          />
        );
      })}
    </div>
  );
}
