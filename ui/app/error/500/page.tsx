import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function InternalServerError() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full max-w-md mx-auto">
      <h1 className="text-4xl font-bold mb-1">500 Internal Server Error</h1>
      <p className=" text-center mb-8 text-sm text-gray-400">
        The server... malfunctioned... and can{"'"}t... respond... at the
        moment... oh I{"'"}m sorry. Could you try again?
      </p>

      <Link className={buttonVariants()} href="/">
        Go back home
      </Link>
    </div>
  );
}
