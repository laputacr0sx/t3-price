import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

function Navbar() {
  return (
    <>
      <div className="flex items-center gap-1 bg-slate-800">
        <Head>
          <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
        </Head>
        <div className="flex items-center justify-end gap-3 p-1">
          <Link href={"/"} about="Home Page">
            <Image
              src="http://image.dummyjson.com/24x24"
              alt="Logo"
              width={24}
              height={24}
            />
          </Link>
          <Link href={"/barcodeScanner"} className="text-blue-200">
            BarCode
          </Link>
          <Link href={"/myScanner"} className="text-blue-200">
            myScanner
          </Link>
        </div>
      </div>
    </>
  );
}

export default Navbar;
