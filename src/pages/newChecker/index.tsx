import { type QrcodeSuccessCallback } from "html5-qrcode";
import Link from "next/link";
import React, { type ReactElement, useState } from "react";
import Html5QrcodePlugin from "~/components/CodeReader";
import { type NextPageWithLayout } from "../_app";
import Layout from "~/layouts/productDetailLayout";

const NewChecker: NextPageWithLayout = () => {
  const [scannedResult, setScannedResult] = useState("");
  const onNewScanResult: QrcodeSuccessCallback = (decodedText) => {
    setScannedResult(decodedText);

    return (
      <>
        <div>{scannedResult}</div>
        <Link href={"/newChecker"}>GO BACK</Link>
      </>
    );
  };

  return (
    <div className="h-screen w-screen">
      <div className="w-[80vw]">
        <Html5QrcodePlugin
          fps={10}
          qrbox={{ width: 720, height: 240 }}
          qrCodeSuccessCallback={onNewScanResult}
          verbose={false}
        />
      </div>
      <p>{scannedResult}</p>
      <Link href={"/newChecker"}>GO BACK</Link>
    </div>
  );
};

NewChecker.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default NewChecker;
