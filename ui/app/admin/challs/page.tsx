"use client";

import { PlusIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import * as React from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const sortOptions = [
  "Name",
  "Category",
  "Difficulty",
  "Points",
  "Solves",
  "Author",
];

export default function Page() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(sortOptions[0]);

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="border rounded-md px-10 py-5 flex justify-center items-center gap-6">
        <p className="text-3xl font-bold">Challenges</p>
        <Button asChild size="icon">
          <Link href="/admin/challs/new">
            <PlusIcon className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="flex gap-2 items-center justify-center">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {value}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search option..." className="h-9" />
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {sortOptions.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={(currentValue) => {
                      setValue(
                        currentValue[0].toUpperCase() + currentValue.slice(1)
                      );
                      setOpen(false);
                    }}
                  >
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <Input
          type="text"
          placeholder="Search for matching challenge..."
          className="flex-grow max-w-md"
        />
        <Button size="icon" className="flex-shrink-0">
          <MagnifyingGlassIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
