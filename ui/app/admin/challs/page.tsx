"use client";

import {
  PlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  Pencil1Icon,
} from "@radix-ui/react-icons";
import Link from "next/link";

import * as React from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const sortOptions = ["Name", "Category", "Points", "Solves", "Author"];

import { getChallenges } from "@/api/admin";

import { toast } from "sonner";

export default function Page() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(sortOptions[0]);

  const [challs, setChalls] = React.useState(null);

  React.useEffect(() => {
    const action = async () => {
      const { error, data } = await getChallenges();

      if (error) {
        toast.error(error);
        return;
      }

      setChalls(data);
    };

    action();
  }, []);

  const [selected, setSelected] = React.useState<string[]>([]);

  const toggleSelected = (id: string) => {
    if (selected.includes(id)) {
      setSelected((selected) => selected.filter((s) => s !== id));
    } else {
      setSelected((selected) => [...selected, id]);
    }
  };

  const allToggle = () => {
    // @ts-ignore
    if (selected.length === challs.length) {
      setSelected([]);
    } else {
      // @ts-ignore
      setSelected(challs.map((c) => c.id));
    }
  };

  React.useEffect(() => {
    console.log(selected);
  }, [selected]);

  return (
    <div className="flex flex-col w-full gap-4">
      <div className=" px-10 py-5 flex justify-center items-center gap-3">
        <p className="text-3xl font-bold">Challenges</p>
        <Button asChild size="icon" className="rounded-full">
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

      <div className="flex justify-end gap-2">
        <Button
          variant="destructive"
          size="icon"
          disabled={selected.length <= 0}
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
        <Button size="icon" disabled>
          <Pencil1Icon className="h-4 w-4" />
        </Button>
      </div>

      {challs != null ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox onClick={allToggle} />
              </TableHead>
              <TableHead className="w-[150px]">Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="text-right">Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              // @ts-ignore
              challs?.map((chall: any) => (
                <TableRow key={chall.id}>
                  <TableCell>
                    <Checkbox
                      id={chall.id}
                      checked={selected.includes(chall.id)}
                      onClick={() => toggleSelected(chall.id)}
                    />
                  </TableCell>
                  <TableCell>{chall.name}</TableCell>
                  <TableCell>{chall.category}</TableCell>
                  <TableCell>{chall.points.max}</TableCell>
                  <TableCell className="text-right">
                    {chall.dynamic.type}
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center space-y-2 border px-10 py-24 rounded-md">
          <p className="text-3xl font-bold">No challenges found.</p>
        </div>
      )}
    </div>
  );
}
