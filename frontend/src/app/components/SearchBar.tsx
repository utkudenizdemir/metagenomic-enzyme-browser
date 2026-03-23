"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";

function SearchBar() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="flex flex-row w-full justify-between py-2  h-fit">
      <div className="flex justify-start py-2 w-full ">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex justify-center space-x-5 w-full "
        >
          <input
            type="text"
            placeholder="Search Prozomigo2"
            className="border-2 border-deep-blue rounded-md px-3 py-2 w-full bg-opacity-20 text-lg text-deep-blue"
          />
          <button
            className="bg-deep-blue text-white px-5 py-1 border-2 border-white rounded-md hover:border-deep-blue hover:bg-white hover:text-deep-blue transition-all ease-in-out"
            onClick={() => router.push("/results")}
          >
            <FaSearch />
          </button>
        </form>
      </div>
      <div className="flex justify-end py-2 space-x-5 w-full ">
        <p className="text-2xl text-white font-normal py-2">
          Welcome, {session?.user?.name || "Guest"}
        </p>
        <button
          className="bg-deep-blue text-white px-5 py-1 border-2 border-white rounded-md hover:border-deep-blue hover:bg-white hover:text-deep-blue transition-all ease-in-out"
          onClick={() => {
            signOut();
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
