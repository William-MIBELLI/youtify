import SuccessLink from "@/src/components/success-link/SuccessLink";
import Link from "next/link";
import React from "react";

const page = async () => {
  return (
    <div className="container">
      <h1 className="title">Well done 🥳</h1>
      <div className="flex flex-col justify-center items-center mt-7">
        <p className="text-2xl text-emerald-400 font-semibold my-3">
          Your playlist is successfully created !
        </p>
        <SuccessLink/>
      </div>
      <div className="w-full flex flex-col items-center gap-2 mt-7">
        <h3>
          Lets convert more ?
        </h3>
        <div className="flex gap-4">
          <Link href='/from-spotify' className="link_text">
            Spotify
          </Link>
          <Link href='/from-youtube' className="link_text">
            Youtube
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
