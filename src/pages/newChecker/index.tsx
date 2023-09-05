import { type QrcodeSuccessCallback } from "html5-qrcode";
import React, { type ReactElement, useState } from "react";
import { type NextPageWithLayout } from "../_app";
import Layout from "~/layouts/productDetailLayout";

import Html5QrcodePlugin from "~/components/CodeScanner";
import ResultComponent from "~/components/ScanResult";

const NewChecker: NextPageWithLayout = () => {
  const [scannedResult, setScannedResult] = useState("");

  const onNewScanResult: QrcodeSuccessCallback = (decodedText) => {
    setScannedResult(decodedText);
  };

  return (
    <div className="flex h-screen flex-col items-center">
      <Html5QrcodePlugin
        fps={10}
        qrCodeSuccessCallback={onNewScanResult}
        verbose={false}
      />
      {scannedResult ? <ResultComponent scanResult={scannedResult} /> : null}
    </div>
  );
};

NewChecker.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default NewChecker;
