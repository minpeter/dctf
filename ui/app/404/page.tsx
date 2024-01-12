import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full max-w-md mx-auto">
      <h1 className="text-4xl font-bold mb-1">404 Not Found</h1>
      <p className=" text-center mb-8 text-sm text-gray-400">
        Hey you. What strange thing are you trying to do... You can{"'"}t stop
        right now!! Oh, I must have misunderstood.. I{"'"}m sorry. If you click
        the button below, you will find the way.
      </p>

      <Link className={buttonVariants()} href="/">
        Go back home
      </Link>
    </div>
  );
}
