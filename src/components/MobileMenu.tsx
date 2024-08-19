"use client";

import Link from "next/link";
import React, { useState } from "react";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="md:hidden">
      <div
        className="flex gap-1 flex-col justify-center items-center"
        onClick={() => setIsOpen((prevState) => !prevState)}
      >
        <div
          className={`w-6 h-1 bg-blue-500 rounded-sm ${
            isOpen ? "rotate-45" : ""
          } origin-left ease-in-out duration-500`}
        ></div>
        <div
          className={`w-6 h-1 bg-blue-500 rounded-sm ${
            isOpen ? "opacity-0" : ""
          } ease-in-out duration-300`}
        ></div>
        <div
          className={`w-6 h-1 bg-blue-500 rounded-sm ${
            isOpen ? "-rotate-45" : ""
          } origin-left ease-in-out duration-300`}
        ></div>
      </div>
      {isOpen && (
        <div className="absolute top-24 left-0 w-full h-[calc(100vh-96px)] bg-white flex flex-col justify-center items-center gap-8 font-medium text-xl z-10">
          <Link href="/">Home</Link>
          <Link href="/friends">Friends</Link>
          <Link href="/group">Groups</Link>
          <Link href="/stories">Stories</Link>
          <Link href="/login">Login</Link>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
