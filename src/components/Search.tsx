"use client";

import { searchUser } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
type Users = {
  id: string;
  username: string;
  avatar: string | null;
  firstName: string | null;
  surName: string | null;
};
const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResult, setSearchResult] = useState<Users[]>([]);
  const searchHandler = async () => {
    if (!searchTerm) return;
    try {
      const users = await searchUser(searchTerm);
      setSearchResult(users);
      setSearchOpen(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="hidden xl:flex flex-col relative">
      <form
        action={searchHandler}
        className="hidden xl:flex gap-1 border-b-2 items-center p-2 bg-slate-100 rounded-xl"
      >
        <input
          type="text"
          placeholder="search..."
          className="bg-transparent outline-none"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
        <button type="submit">
          <Image src="/search.png" alt="search icon" height={18} width={18} />
        </button>
      </form>
      {/* Search Results */}
      {searchOpen && (
        <div className="absolute top-12 bg-slate-100 w-full rounded-xl z-50">
          {searchResult.length > 0 &&
            searchResult.map((result) => {
              let displayName = `${result.firstName || ""} ${
                result.surName || ""
              }`;
              if (displayName.trim().length === 0)
                displayName = result.username;
              return (
                <Link key={result.id} href={`/profile/${result.username}`} onClick={()=>setSearchOpen(false)}>
                  <div className="w-full shadow-sm p-2">
                    <div className="flex items-center gap-4">
                      <Image
                        src={result.avatar || "/noAvatar.png"}
                        alt="profile pic"
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full"
                      />
                      <span className="font-medium">{displayName}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Search;
