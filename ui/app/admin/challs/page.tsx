"use client";

import { useState, useCallback, useEffect, useMemo } from "react";

import { getChallenges } from "@/api/admin";
import AdminProblem from "@/components/adminproblem";
import { Button } from "@/components/ui/button";

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
  dynamic: {
    env: string;
    Image: string;
    type: string;
  };
};

export default function Page() {
  return (
    <div className="flex flex-col w-full">
      <div className="border rounded-md px-10 py-5 flex justify-between items-center">
        Admin Panel - Challenges
        <Button
          onClick={() => {
            getChallenges().then((res) => {
              console.log(res);
            });
          }}
        >
          New Challenge
        </Button>
      </div>
    </div>
  );
}
