import { type QrcodeSuccessCallback } from "html5-qrcode";
import React, { type ReactElement, useState } from "react";
import { type NextPageWithLayout } from "../_app";
import Layout from "~/layouts/productDetailLayout";

import Html5QrcodePlugin from "~/components/Html5QrcodePlugin";
import ScanResult from "~/components/ScanResult";
import ProductModal from "~/components/ProductModal";
import { api } from "~/utils/api";

const NewChecker: NextPageWithLayout = () => {
  const [scannedResult, setScannedResult] = useState("");
  const [isModalShown, setIsModalShown] = useState(false);

  const onNewScanResult: QrcodeSuccessCallback = (decodedText) => {
    setScannedResult(decodedText);
    setIsModalShown(true);

    const { data: demoProduct } = api.demo.getDesired.useQuery({
      id: scannedResult && "12",
    });

    return (
      <>
        <ProductModal
          setIsModalShown={setIsModalShown}
          isModalShown={isModalShown}
          currentItem={demoProduct!}
        />
      </>
    );
  };

  return (
    <div className="flex h-screen flex-col items-center">
      <Html5QrcodePlugin
        fps={4}
        qrCodeSuccessCallback={onNewScanResult}
        verbose={false}
      />
      {scannedResult ? <ScanResult scanResult={scannedResult} /> : null}
    </div>
  );
};

NewChecker.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default NewChecker;
