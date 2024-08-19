import Link from "next/link";
import MobileMenu from "./MobileMenu";
import Image from "next/image";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
} from "@clerk/nextjs";

const Navbar = () => {
  return (
    <div className="h-24 flex items-center justify-between">
      {/* LEFT */}
      <div className="md:hidden lg:block md:w-[20%]">
        <Link href="/" className="font-bold text-xl text-blue-600">
          StaR SoCiAl
        </Link>
      </div>
      {/* CENTER */}
      <div className="hidden md:flex w-[60%] items-center justify-between ">
        <div className="flex gap-4 text-gray-600  text-sm">
          <Link href="/" className="flex gap-2 justify-center items-center">
            <Image src="/home.png" alt="home icon" height={16} width={16} />
            Homepage
          </Link>
          <Link href="/" className="flex gap-2 justify-center items-center">
            <Image
              src="/friends.png"
              alt="fiends icon"
              height={16}
              width={16}
            />
            Friends
          </Link>
          <Link href="/" className="flex gap-2 justify-center items-center">
            <Image
              src="/stories.png"
              alt="stories icon"
              height={16}
              width={16}
            />
            Stories
          </Link>
        </div>
        <div className="hidden xl:flex gap-1 border-b-2 items-center p-2 bg-slate-100 rounded-xl">
          <input
            type="text"
            placeholder="search..."
            className="bg-transparent outline-none"
          />
          <Image src="/search.png" alt="search icon" height={18} width={18} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-[20%] flex items-center gap-4 xl:gap-8 justify-end">
        <ClerkLoading>
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </ClerkLoading>

        <ClerkLoaded>
          <SignedIn>
            <div className="cursor-pointer">
              <Image
                src="/people.png"
                alt="people logo"
                width={20}
                height={20}
              />
            </div>
            <div className="cursor-pointer">
              <Image
                src="/messages.png"
                alt="messages logo"
                width={20}
                height={20}
              />
            </div>
            <div className="cursor-pointer">
              <Image
                src="/notifications.png"
                alt="notification logo"
                width={20}
                height={20}
              />
            </div>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Link
              href="/sign-in"
              className="cursor-pointer flex gap-2 items-center text-sm"
            >
              <Image
                src="/noAvatar.png"
                alt="profile logo"
                width={20}
                height={20}
              />
              <p>Login/Register</p>
            </Link>
          </SignedOut>
        </ClerkLoaded>
        <MobileMenu />
      </div>
    </div>
  );
};

export default Navbar;
