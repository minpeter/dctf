"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { usePathname, useRouter } from "next/navigation";
import { ChevronsUpDown } from "lucide-react";

import Link from "next/link";
import { Logout } from "@/api/auth";
import { checkAdmin } from "@/api/admin";

const commonLink = [
  {
    link: "/",
    label: "Home",
  },
  {
    link: "/scores",
    label: "Scoreboard",
  },
  {
    link: "/test",
    label: "Test",
  },
];

const adminLink = [
  {
    link: "/admin",
    label: "Admin",
  },
];

const logoutLink = [
  {
    link: "/login",
    label: "Login",
  },
];

const loginLink = [
  {
    link: "/profile",
    label: "Profile",
  },
  {
    link: "/challs",
    label: "Challenges",
  },
  {
    link: "/logout",
    label: "Logout",
  },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [admin, setAdmin] = useState(false);

  const [open, setOpen] = useState(false);
  const [link, setLink] = useState(commonLink[0].label);

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
    <div className="h-16 flex justify-between items-center">
      <div className="hidden sm:flex">
        <NavigationMenu>
          <NavigationMenuList>
            {admin &&
              adminLink.map((linkitem) => (
                <NavigationMenuItem key={linkitem.link}>
                  <Link href={linkitem.link} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {linkitem.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            {commonLink.map((linkitem) => (
              <NavigationMenuItem key={linkitem.link}>
                <Link href={linkitem.link} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {linkitem.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}

            {isClient && loggedIn
              ? loginLink.map((linkitem) =>
                  linkitem.label === "Logout" ? (
                    <NavigationMenuItem key={linkitem.link}>
                      <AlertDialog>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
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
                  ) : (
                    <NavigationMenuItem key={linkitem.link}>
                      <Link href={linkitem.link} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          {linkitem.label}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  )
                )
              : logoutLink.map((linkitem) => (
                  <NavigationMenuItem key={linkitem.link}>
                    <Link href={linkitem.link} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        {linkitem.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
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
      <div className="flex sm:hidden">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[85vw] justify-between"
            >
              {link}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[85vw] p-0">
            <Command>
              <CommandGroup>
                {admin &&
                  adminLink.map((linkitem) => (
                    <CommandItem
                      key={linkitem.label}
                      value={linkitem.label}
                      onSelect={() => {
                        setLink(linkitem.label);
                        router.push(linkitem.link);
                        setOpen(false);
                      }}
                    >
                      {linkitem.label}
                    </CommandItem>
                  ))}

                {commonLink.map((linkitem) => (
                  <CommandItem
                    key={linkitem.label}
                    value={linkitem.label}
                    onSelect={() => {
                      setLink(linkitem.label);
                      router.push(linkitem.link);
                      setOpen(false);
                    }}
                  >
                    {linkitem.label}
                  </CommandItem>
                ))}

                {isClient && loggedIn
                  ? loginLink.map((linkitem) =>
                      linkitem.label === "Logout" ? (
                        <AlertDialog key={linkitem.label}>
                          <AlertDialogTrigger className="w-full">
                            <CommandItem value={linkitem.label}>
                              {linkitem.label}
                            </CommandItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Logout</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to logout?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => {
                                  setOpen(false);
                                }}
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction onClick={Logout}>
                                Logout
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <CommandItem
                          key={linkitem.label}
                          value={linkitem.label}
                          onSelect={() => {
                            setLink(linkitem.label);
                            router.push(linkitem.link);
                            setOpen(false);
                          }}
                        >
                          {linkitem.label}
                        </CommandItem>
                      )
                    )
                  : logoutLink.map((linkitem) => (
                      <CommandItem
                        key={linkitem.label}
                        value={linkitem.label}
                        onSelect={() => {
                          setLink(linkitem.label);
                          router.push(linkitem.link);
                          setOpen(false);
                        }}
                      >
                        {linkitem.label}
                      </CommandItem>
                    ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
