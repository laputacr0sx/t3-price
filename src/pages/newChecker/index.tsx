import { type QrcodeSuccessCallback } from "html5-qrcode";
import Link from "next/link";
import React, { useState } from "react";
import Html5QrcodePlugin from "~/components/CodeReader";

function NewChecker() {
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
    <div className="">
      <Html5QrcodePlugin
        fps={10}
        qrbox={100}
        disableFlip={false}
        qrCodeSuccessCallback={onNewScanResult}
        verbose={false}
      />
      <p>{scannedResult}</p>
      <Link href={"/newChecker"}>GO BACK</Link>
    </div>
  );
}

export default NewChecker;
