"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import { getChallenges } from "@/api/challenges";

import Problem, { ProblemProps } from "@/components/problem";

import { useCallback, useState, useEffect, useMemo } from "react";

import { toast } from "sonner";

const loadStates = {
  pending: 0,
  notStarted: 1,
  loaded: 2,
};

export default function Page() {
  const challPageState = useMemo(() => {
    try {
      return JSON.parse(localStorage.challPageState || "{}");
    } catch (e) {
      return {};
    }
  }, []);

  const [problems, setProblems] = useState(challPageState.problems || null);
  const [categories, setCategories] = useState(challPageState.categories || {});
  const [showSolved, setShowSolved] = useState(
    challPageState.showSolved || false
  );
  const [solveIDs, setSolveIDs] = useState(challPageState.solveIDs || []);
  const [loadState, setLoadState] = useState(loadStates.pending);

  const [isNull, setIsNull] = useState(false);

  const setSolved = useCallback((id: string) => {
    setSolveIDs((solveIDs: string[]) => {
      if (!solveIDs.includes(id)) {
        return [...solveIDs, id];
      }
      return solveIDs;
    });
  }, []);

  const handleShowSolvedChange = useCallback((checked: boolean) => {
    setShowSolved(checked);
  }, []);

  const handleCategoryCheckedChange = useCallback(
    (checked: boolean, category: string) => () => {
      setCategories((categories: { [key: string]: boolean }) => ({
        ...categories,
        [category]: checked,
      }));
    },
    []
  );

  useEffect(() => {
    const action = async () => {
      if (problems !== null) {
        return;
      }
      const {
        data,
        error,
        notStarted,
      }: {
        data?: ProblemProps[] | null;
        error?: string | null;
        notStarted?: boolean;
      } = await getChallenges();

      if (error) {
        toast.error(error);
        return;
      }

      setLoadState(notStarted ? loadStates.notStarted : loadStates.loaded);
      if (notStarted) {
        return;
      }

      const newCategories = { ...categories };

      if (data === undefined || data === null) {
        setIsNull(true);
        return;
      } else {
        data.forEach((problem) => {
          if (newCategories[problem.category] === undefined) {
            newCategories[problem.category] = false;
          }
        });

        setProblems(data);
        setCategories(newCategories);
      }
    };
    action();
  }, [categories, problems]);

  useEffect(() => {
    localStorage.challPageState = JSON.stringify({ categories, showSolved });
  }, [categories, showSolved]);

  const problemsToDisplay = useMemo(() => {
    if (problems === null) {
      return [];
    }
    let filtered = problems;
    if (!showSolved) {
      filtered = filtered.filter(
        (problem: ProblemProps) => !solveIDs.includes(problem.id)
      );
    }
    let filterCategories = false;
    Object.values(categories).forEach((displayCategory) => {
      if (displayCategory) filterCategories = true;
    });
    if (filterCategories) {
      Object.keys(categories).forEach((category) => {
        if (categories[category] === false) {
          // Do not display this category
          filtered = filtered.filter(
            (problem: ProblemProps) => problem.category !== category
          );
        }
      });
    }

    filtered.sort((a: ProblemProps, b: ProblemProps) => {
      if (a.points === b.points) {
        return b.solves - a.solves;
      }
      return a.points - b.points;
    });

    return filtered;
  }, [problems, categories, showSolved, solveIDs]);

  const { categoryCounts, solvedCount } = useMemo(() => {
    const categoryCounts = new Map();
    let solvedCount = 0;
    if (problems !== null) {
      for (const problem of problems) {
        if (!categoryCounts.has(problem.category)) {
          categoryCounts.set(problem.category, {
            total: 0,
            solved: 0,
          });
        }

        const solved = solveIDs.includes(problem.id);
        categoryCounts.get(problem.category).total += 1;
        if (solved) {
          categoryCounts.get(problem.category).solved += 1;
        }

        if (solved) {
          solvedCount += 1;
        }
      }
    }
    return { categoryCounts, solvedCount };
  }, [problems, solveIDs]);

  if (loadState === loadStates.pending) {
    return null;
  }

  if (loadState === loadStates.notStarted) {
    return (
      <div>
        <h3>CTF is not started yet</h3>
      </div>
    );
  }

  if (isNull) {
    return (
      <div>
        <h3>Challenge is empty</h3>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col space-y-4 lg:w-fit lg:flex-row lg:space-x-4 lg:space-y-0">
      <div className="flex flex-col space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-solved"
                checked={showSolved}
                onCheckedChange={handleShowSolvedChange}
              />
              <label
                htmlFor="show-solved"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Show Solved ({solvedCount}/{problems.length} solved)
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              {Array.from(categoryCounts.entries())
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([category, { solved, total }]) => {
                  return (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={categories[category]}
                        onCheckedChange={handleCategoryCheckedChange(
                          !categories[category],
                          category
                        )}
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category} ({solved}/{total} solved)
                      </label>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col space-y-4">
        {solvedCount == problems.length && !showSolved ? (
          <div>I solved all the problems.</div>
        ) : (
          problemsToDisplay.map((problem: ProblemProps) => {
            return (
              <Problem
                key={problem.id}
                problem={problem}
                solved={solveIDs.includes(problem.id)}
                setSolved={setSolved}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
