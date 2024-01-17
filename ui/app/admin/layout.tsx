"use client";

import { checkAdmin } from "@/api/admin";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import NotFound from "../error/404/page";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    checkAdmin().then(setAdmin);
  }, []);

  return clicked && admin ? (
    children
  ) : (
    <div className="flex flex-col gap-2 items-center">
      <NotFound />
      {admin && (
        <Button
          className="w-fit"
          variant="destructive"
          onClick={() => setClicked(true)}
        >
          Continue, I{"'"}m an admin
        </Button>
      )}
    </div>
  );
}
