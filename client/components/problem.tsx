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
import { submitFlag } from "@/api/challenges";

import Fire from "@/components/confetti";

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
  dynamic?: "tcp" | "web" | "none";
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
  const isDynamic = problem.dynamic === "tcp" || problem.dynamic === "web";
  const isWeb = problem.dynamic === "web";
  const isTcp = problem.dynamic === "tcp";
  const isFileExists = problem.files.length > 0;

  console.log(problem.name, " is  ", solved ? "solved" : "not solved");

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
              {isDynamic && (
                <>
                  <Badge>dynamic</Badge>
                  <Badge>Running</Badge>
                </>
              )}
            </div>
          </div>

          <p>
            {problem.solves} solves / {problem.points} points
          </p>
        </CardTitle>
        <CardDescription>{problem.author}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 py-4">
        {isWeb && (
          <Link
            href="https://sanity-check.chal.seccon.jp/"
            className="text-blue-500"
          >
            https://sanity-check.chal.seccon.jp/
          </Link>
        )}

        <p>{problem.description}</p>

        {isTcp ? (
          <Tabs defaultValue="pwn" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pwn">pwn</TabsTrigger>
              <TabsTrigger value="socat">socat</TabsTrigger>
              <TabsTrigger value="ncat">ncat</TabsTrigger>
              <TabsTrigger value="openssl">openssl</TabsTrigger>
              <TabsTrigger value="flag">Flag Submission</TabsTrigger>
            </TabsList>
            <TabsContent value="pwn">
              <div className="flex w-full items-center space-x-2">
                <Input
                  type="connection"
                  value="remote('bdspz.dklodd.minpeter.tech', 443, ssl=True)"
                  readOnly
                />
                <Button type="submit">Copy</Button>
              </div>
            </TabsContent>
            <TabsContent value="ncat">
              <div className="flex w-full items-center space-x-2">
                <Input
                  type="connection"
                  value="ncat --ssl bdspz.dklodd.minpeter.tech 443"
                  readOnly
                />
                <Button type="submit">Copy</Button>
              </div>
            </TabsContent>
            <TabsContent value="socat">
              <div className="flex w-full items-center space-x-2">
                <Input
                  type="connection"
                  value="socat openssl-connect:bdspz.dklodd.minpeter.tech:443"
                  readOnly
                />
                <Button type="submit">Copy</Button>
              </div>
            </TabsContent>
            <TabsContent value="openssl">
              <div className="flex w-full items-center space-x-2">
                <Input
                  type="connection"
                  value="openssl s_client -connect bdspz.dklodd.minpeter.tech:443"
                  readOnly
                />
                <Button type="submit">Copy</Button>
              </div>
            </TabsContent>
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
        {isDynamic && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button>Instance Stop</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Stopping in 3 minute</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardFooter>
    </Card>
  );
}
