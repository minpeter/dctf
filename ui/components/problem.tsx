"use client";

import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
  CardDescription,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Link from "next/link";
import { useState, useCallback } from "react";
import { startInstance, submitFlag } from "@/api/challenges";

import Fire from "@/components/confetti";
import { ReloadIcon } from "@radix-ui/react-icons";

// sync with backend CleanedChallenge struct
export type ProblemProps = {
  id: string;
  name: string;
  description: string;
  category: string;
  author: string;
  files: string[];
  points: number;
  solves: number;
  dynamic?: "tcp" | "http" | "static";
};

export default function Problem({
  problem,
  solved,
  setSolved,
}: {
  problem: ProblemProps;
  solved: boolean;
  setSolved: (id: string) => void;
}) {
  const isDynamic = problem.dynamic === "tcp" || problem.dynamic === "http";
  const [httpConnection, setHttpConnection] = useState("");
  const [tcpConnection, setTcpConnection] = useState<
    { type: string; command: string }[]
  >([]);
  const isFileExists = problem.files.length > 0;

  const [isRunning, setIsRunning] = useState(false);
  const [wait, setWait] = useState(false);

  const handleInstanceStart = useCallback(() => {
    const action = async () => {
      setWait(true);

      const { error, data } = await startInstance(problem.id);
      if (error === undefined) {
        console.log(data);
        if (data.type === "tcp") {
          setTcpConnection(data.connection);
        } else {
          setHttpConnection(data.connection);
        }
        setIsRunning(true);
      } else {
        toast.error(error);
      }

      setWait(false);
    };

    action();
  }, [problem.id]);

  const handleInstanceStop = useCallback(() => {
    setHttpConnection("");
    setTcpConnection([]);
    setIsRunning(false);
  }, []);

  const [value, setValue] = useState("");
  const handleInputChange = useCallback(
    (e: any) => setValue(e.target.value),
    []
  );

  const submit = useCallback(() => {
    submitFlag(problem.id, value.trim()).then(({ error }) => {
      if (error === undefined) {
        Fire();

        toast.success("Flag successfully submitted!");

        setSolved(problem.id);
      } else {
        toast.error(error);
      }
    });
  }, [setSolved, problem, value]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold flex justify-between space-x-20">
          <div className="flex space-x-4">
            <h3>
              {problem.category}/{problem.name}
            </h3>
            <div className="flex space-x-2">
              <Badge>{problem.dynamic}</Badge>
              {isDynamic && <Badge>{isRunning ? "Running" : "Stopped"}</Badge>}
            </div>
          </div>

          <p>
            {problem.solves} solves / {problem.points} points
          </p>
        </CardTitle>
        <CardDescription>{problem.author}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 py-4">
        {httpConnection != "" && (
          <Link href={httpConnection} className="text-blue-500">
            {httpConnection}
          </Link>
        )}

        <p>{problem.description}</p>

        {tcpConnection.length > 0 ? (
          <Tabs defaultValue="pwn" className="space-y-4">
            <TabsList>
              {tcpConnection.map((conn, i) => (
                <TabsTrigger key={i} value={conn.type}>
                  {conn.type}
                </TabsTrigger>
              ))}
              <TabsTrigger value="flag">Flag Submission</TabsTrigger>
            </TabsList>

            {tcpConnection.map((conn, i) => (
              <TabsContent key={i} value={conn.type}>
                <div className="flex w-full items-center space-x-2">
                  <Input type="connection" value={conn.command} readOnly />
                  <Button type="submit">Copy</Button>
                </div>
              </TabsContent>
            ))}
            <TabsContent value="flag">
              <div className="flex w-full items-center space-x-2">
                <Input
                  placeholder={`Flag${solved ? " (solved)" : ""}`}
                  value={value}
                  onChange={handleInputChange}
                  readOnly={solved}
                />
                <Button type="submit" onClick={submit} disabled={solved}>
                  {solved ? "Solved" : "Submit"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex w-full items-center space-x-2">
            <Input
              placeholder={`Flag${solved ? " (solved)" : ""}`}
              value={value}
              onChange={handleInputChange}
              readOnly={solved}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submit();
                }
              }}
            />
            <Button type="submit" onClick={submit} disabled={solved}>
              {solved ? "Solved" : "Submit"}
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-gray-100 py-4 dark:bg-gray-800">
        <div className="space-y-2">
          {isFileExists && (
            <>
              <Label htmlFor="downloads">Downloads</Label>
              <div className="flex space-x-2">
                {problem.files.map((file) => (
                  <Link
                    key={file}
                    href="#none"
                    className={badgeVariants({ variant: "outline" })}
                  >
                    {file}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
        {isDynamic &&
          (isRunning ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleInstanceStop} disabled={wait}>
                    {wait ? (
                      <>
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                      </>
                    ) : (
                      <>Instance Stop</>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Stopping in 3 minute</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button onClick={handleInstanceStart} disabled={wait}>
              {wait ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <>Instance Start</>
              )}
            </Button>
          ))}
      </CardFooter>
    </Card>
  );
}
