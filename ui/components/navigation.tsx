"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";

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
import { cn } from "@/lib/utils";

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

const adminLink = [
  {
    link: "/admin/challs",
    label: "Challenges",
  },
];

function searchLabel(link: string) {
  for (let i = 0; i < commonLink.length; i++) {
    if (commonLink[i].link === link) {
      return commonLink[i].label;
    }
  }

  for (let i = 0; i < adminLink.length; i++) {
    if (adminLink[i].link === link) {
      return adminLink[i].label;
    }
  }

  for (let i = 0; i < loginLink.length; i++) {
    if (loginLink[i].link === link) {
      return loginLink[i].label;
    }
  }

  for (let i = 0; i < logoutLink.length; i++) {
    if (logoutLink[i].link === link) {
      return logoutLink[i].label;
    }
  }

  return "Home";
}

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
    setLink(searchLabel(pathname));
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
    <div
      className={cn(
        " flex justify-between items-center",
        admin ? "h-24" : "h-16"
      )}
    >
      <div className="hidden sm:flex flex-col items-center">
        <NavigationMenu>
          <NavigationMenuList>
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

        {admin && (
          <NavigationMenu className="mt-1">
            <NavigationMenuList>
              {admin && (
                <Badge variant="secondary" className="w-fit mr-2">
                  {showAdminNav ? "Admin Panel" : "User Panel"}
                </Badge>
              )}
              {adminLink.map((linkitem) => (
                <NavigationMenuItem key={linkitem.link}>
                  <Link href={linkitem.link} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Admin - {linkitem.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        )}
      </div>
      <div className="flex sm:hidden flex-col gap-2">
        {admin && (
          <Badge variant="secondary" className="w-fit">
            {showAdminNav ? "Admin Panel" : "User Panel"}
          </Badge>
        )}
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
                      Admin - {linkitem.label}
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
