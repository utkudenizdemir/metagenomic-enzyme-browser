'use client';

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { FormEventHandler } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {

  const { data: session } = useSession();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({ username: "", password: "" });
  const handleSubmit:FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      username: userInfo.username,
      password: userInfo.password,
      callbackUrl: "/landing",
      redirect: false,
    });
    console.log(res);
    if (res?.error) {
      alert(res.error);
      return;
    } else if (res?.url) {
      router.push(res.url);
    }


  };

  useEffect(() => {
    console.log(session);
    if (session?.user) {
      router.push("/landing");
    }
  }, [session]);


  return (
    <>
    
    <div className="flex flex-col w-1/3 space-y-7 p-10 justify-center items-center bg-white rounded-md">
      <h1 className="text-2xl">Welcome!</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 justify-center">
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Username"
            value={userInfo.username}
            onChange={({target}) => setUserInfo({ ...userInfo, username: target.value })}
            className="border-2 border-gray-300 rounded-md p-1 m-1"
          />
          <input
            type="password"
            placeholder="Password"
            value={userInfo.password}
            onChange={({target}) => setUserInfo({ ...userInfo, password: target.value })}
            className="border-2 border-gray-300 rounded-md p-1 m-1"
          />
        </div>
        <button className="bg-deep-blue text-white px-5 py-1 border-2 border-white rounded-md hover:border-deep-blue hover:bg-white hover:text-deep-blue transition-all ease-in-out " type="submit">
          Login
        </button>
      </form>
    </div>
    </>
  );
}
