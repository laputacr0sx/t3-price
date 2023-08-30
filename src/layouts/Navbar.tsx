import Head from "next/head";
import Image from "next/image";
import React from "react";

function Navbar() {
  return (
    <div className="flex items-center gap-1 bg-slate-800">
      <Head>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
      </Head>
      <div className="p-1">
        <Image
          src="http://image.dummyjson.com/24x24"
          alt="Logo"
          width={24}
          height={24}
        />
      </div>
      <h1 className="text-slate-100">Price Checker</h1>
    </div>
  );
}

export default Navbar;
