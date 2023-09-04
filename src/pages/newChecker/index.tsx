import { type QrcodeSuccessCallback } from "html5-qrcode";
import React, { type ReactElement, useState } from "react";
import Html5QrcodePlugin from "~/components/CodeScanner";
import { type NextPageWithLayout } from "../_app";
import Layout from "~/layouts/productDetailLayout";
import { demoEANID } from "~/utils/helper";
import { type EAN } from "~/types/allTypes";
import { api } from "~/utils/api";

const NewChecker: NextPageWithLayout = () => {
  const [scannedResult, setScannedResult] = useState("");

  const onNewScanResult: QrcodeSuccessCallback = (decodedText) => {
    setScannedResult(decodedText);
  };

  return (
    <div className="flex h-screen flex-col items-center">
      <Html5QrcodePlugin
        fps={20}
        aspectRatio={1.77778}
        qrbox={{ width: 360, height: 120 }}
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

type ScanResultProp = {
  scanResult: EAN;
};

const ResultComponent = ({ scanResult }: ScanResultProp) => {
  const { data: demoProduct, error: demoProductError } =
    api.demo.getDesired.useQuery({ id: demoEANID(scanResult) });

  const demoProductResult = demoProduct ? (
    <p className="text-ellipsis break-all ">
      {demoProduct && JSON.stringify(demoProduct)}
    </p>
  ) : null;

  return (
    <>
      <p>{scanResult}</p>
      <p>{demoProductResult}</p>
    </>
  );
};
