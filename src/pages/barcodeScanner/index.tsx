import {
  type CameraDevice,
  Html5Qrcode,
  type Html5QrcodeScannerState,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";
import React, {
  type ReactElement,
  useEffect,
  useState,
  useCallback,
} from "react";
import Layout from "~/layouts/productDetailLayout";
import { api } from "~/utils/api";
import { demoEANID } from "~/utils/helper";
import { type NextPageWithLayout } from "../_app";
import ProductPlainText from "~/components/ProductPlainText";

const BarcodeScanner: NextPageWithLayout = () => {
  const [productLoaded, setProductLoaded] = useState(false);
  const [scannerState, setScannerState] = useState<Html5QrcodeScannerState>();

  const [camerasAvailable, setCamerasAvailable] = useState<CameraDevice[]>([]);
  const [cameraInUse, setCameraInUse] = useState<string | null>(null);

  const [scannedEAN, setScannedEAN] = useState<string | null>(null);

  const { data: product, error: productError } = api.demo.getDesired.useQuery(
    {
      id: demoEANID(scannedEAN ?? ""),
    },
    { refetchOnWindowFocus: false }
  );

  useEffect(() => {
    const obtainCameras = async () => {
      const gotCameras = await Html5Qrcode.getCameras();

      if (gotCameras.length > 0) {
        const labelOfCamerasAvailable = camerasAvailable.map(
          ({ label }) => label
        );

        const validCameras = gotCameras.filter(
          ({ label }) => !labelOfCamerasAvailable.includes(label)
        );

        setCamerasAvailable([...camerasAvailable, ...validCameras]);
      }
    };

    void obtainCameras();
  }, []);

  const qrBoxCalculator = useCallback((visualViewport: VisualViewport) => {
    const width = visualViewport.width;
    const qrWidth = width * 0.9;
    const qrHeight = width * 0.39;
    return [qrWidth, qrHeight] || [50, 50];
  }, []);

  useEffect(() => {
    const elementId = "scanner-region";

    const [qrWidth, qrHeight] =
      window && window.visualViewport
        ? qrBoxCalculator(window.visualViewport)
        : [50, 50];

    const eanScanner = new Html5Qrcode(elementId, {
      verbose: false,
      formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13],
      useBarCodeDetectorIfSupported: true,
    });

    if (cameraInUse && !productLoaded && qrWidth && qrHeight)
      try {
        void eanScanner.start(
          { deviceId: { exact: cameraInUse } },
          {
            fps: 8,
            aspectRatio: 1,
            qrbox: {
              width: qrWidth,
              height: qrHeight,
            },
            disableFlip: false,
          },
          (decodedText, decodedResult) => {
            setScannerState(eanScanner.getState());
            setScannedEAN(decodedText);
            setProductLoaded(true);
            // setCameraInUse(null);
            eanScanner.pause();
            eanScanner.stop().catch((e) => console.error(e));
          },
          (message, error) => {
            setScannerState(eanScanner.getState());
            if (error instanceof Error) {
              console.error(message);
              throw error;
            }
          }
        );
      } catch (error) {
        console.error(error);
      }

    return () => {
      //
    };
  }, [cameraInUse, productLoaded]);

  if (productError) {
    return <h1>Error occurred during fetching</h1>;
  }

  return (
    <div>
      <div className="flex justify-between bg-slate-900 px-4 py-1">
        <h2 className="self-center align-middle">
          {productLoaded ? "Scan paused" : "Awaiting valid barcodes"}
        </h2>
        <h3>{scannerState}</h3>
        <button
          className="rounded-md border-2 border-solid border-slate-200 px-2 py-1 text-slate-200 disabled:border-green-800 disabled:text-green-800 "
          disabled={!productLoaded}
          onClick={() => {
            setProductLoaded(false);
            setScannedEAN(null);
            setCameraInUse(null);
          }}
        >
          {productLoaded ? "Scan Again" : "Scanning"}
        </button>
      </div>
      <div className="flex-row items-center justify-center gap-1 ">
        {camerasAvailable.length > 0
          ? camerasAvailable.map(({ id, label }, index) => (
              <button
                key={id + index}
                onClick={() => void setCameraInUse(id)}
                className="mb-1 mt-1 break-all border-2 px-1"
              >
                Device {index + 1} : {label}
              </button>
            ))
          : null}
      </div>
      <h1 key={scannedEAN}>
        {scannedEAN && `This is my scanner ${scannedEAN}`}
      </h1>
      <div className="flex h-auto w-80 content-center items-center justify-center self-center md:w-[300px] lg:w-[400px]">
        <div id="scanner-region" className="w-full resize-none" />
      </div>
      {product && productLoaded ? <ProductPlainText product={product} /> : null}
    </div>
  );
};

BarcodeScanner.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default BarcodeScanner;
