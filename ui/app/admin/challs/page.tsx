"use client";

import { useState, useCallback, useEffect, useMemo } from "react";

import { getChallenges } from "@/api/admin";
import AdminProblem from "@/components/adminproblem";

import { Checkbox } from "@/components/ui/checkbox";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

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
        <Button asChild>
          <Link href="/admin/challs/new">New Challenge</Link>
        </Button>
      </div>
    </div>
  );
}
