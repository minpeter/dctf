"use client";

import Link from "next/link";
import { Logout } from "@/api/auth";
import { checkAdmin } from "@/api/admin";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

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

import { useState, useEffect } from "react";

import { usePathname } from "next/navigation";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Navbar() {
  const [isClient, setIsClient] = useState(false);
  const [admin, setAdmin] = useState(false);

  const pathname = usePathname();

  const [showAdminNav, setAdminPath] = useState(false);

  let loggedIn = false;

  if (typeof window !== "undefined") {
    loggedIn = localStorage.login_state;
  }

  useEffect(() => {
    setAdminPath(pathname.includes("/admin"));
  }, [pathname]);

  useEffect(() => {
    setIsClient(true);

    if (localStorage.login_state) {
      checkAdmin().then((resp) => {
        console.log(resp);
        setAdmin(resp);
      });
    }
  }, [loggedIn]);

  return (
    <div className="flex-col hidden sm:flex">
      <NavigationMenu>
        <NavigationMenuList>
          {admin && (
            <NavigationMenuItem>
              <Link href="/admin" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Admin
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          )}

          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/scores" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Scoreboard
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          {isClient && loggedIn ? (
            <>
              <NavigationMenuItem>
                <Link href="/profile" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Profile
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/challs" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Challenges
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <AlertDialog>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <AlertDialogTrigger>Logout</AlertDialogTrigger>
                  </NavigationMenuLink>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Logout</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to logout?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={Logout}>
                        Logout
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </NavigationMenuItem>
            </>
          ) : (
            <NavigationMenuItem>
              <Link href="/login" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Login
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>

      {showAdminNav && admin && (
        <NavigationMenu className="mt-1">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/admin/challs" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Challenges
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/admin/users" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Users
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )}
    </div>
  );
}

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

export function MobileNavbar() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(navlink[0].value);

  return (
    <div className="flex sm:hidden justify-center w-full max-w-screen-lg px-5 mb-2">
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
    </div>
  );
}
