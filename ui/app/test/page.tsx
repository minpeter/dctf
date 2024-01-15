"use client";

export default function Page() {
  // return (
  //   <div className=" bg-slate-500">
  //     <h1 className="">logging in...</h1>
  //     <p className="overflow-hidden text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
  //       AA
  //     </p>

  //     <ComboboxDemo />
  //   </div>
  // );
  return (
    <div className="flex sm:hidden justify-center">
      <ComboboxDemo />
    </div>
  );
}

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const navlink = [
  {
    value: "Home",
    label: "Home",
  },
  {
    value: "Scoreboard",
    label: "Scoreboard",
  },
  {
    value: "Profile",
    label: "Profile",
  },
  {
    value: "Challenges",
    label: "Challenges",
  },
  {
    value: "Logout",
    label: "Logout",
  },
];

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(navlink[0].value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[400px] justify-between"
        >
          {value}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0">
        <Command>
          <CommandGroup>
            {navlink.map((framework) => (
              <CommandItem
                key={framework.value}
                value={framework.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                {framework.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
