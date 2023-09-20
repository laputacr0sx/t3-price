import {
  type CameraDevice,
  Html5Qrcode,
  type Html5QrcodeScannerState,
  Html5QrcodeSupportedFormats,
  type Html5QrcodeResult,
} from "html5-qrcode";
import React, {
  type ReactElement,
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import Layout from "~/layouts/productDetailLayout";
import { api } from "~/utils/api";
import { demoEANID } from "~/utils/helper";
import { type NextPageWithLayout } from "../_app";
import ProductPlainText from "~/components/ProductPlainText";
import { type Html5QrcodeError } from "html5-qrcode/esm/core";

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

    obtainCameras().catch((e) => {
      if (e instanceof Error) return console.error(e);

      return console.log(e);
    });
  }, [camerasAvailable]);

  useEffect(() => {
    const elementId = "scanner-region";
    const eanScanner = new Html5Qrcode(elementId, {
      verbose: false,
      formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13],
      useBarCodeDetectorIfSupported: true,
    });

    const onSuccessCallback = (
      decodedText: string,
      decodedResult: Html5QrcodeResult
    ) => {
      setScannedEAN(decodedText);
      setProductLoaded(true);
      setScannerState(eanScanner.getState());

      eanScanner.pause();
      eanScanner.clear();
      eanScanner.stop().catch((e) => console.error(e));
    };

    const onDecodeErrorCallback = (
      message: string,
      error: Html5QrcodeError
    ) => {
      setScannerState(eanScanner.getState());
      if (error instanceof Error) {
        console.error(message);
        throw error;
      }
    };

    if (cameraInUse && productLoaded === false) {
      eanScanner
        .start(
          { deviceId: { exact: cameraInUse } },
          {
            fps: 8,
            aspectRatio: 1,
            qrbox: {
              width: 320 * 0.9,
              height: 320 * 0.62,
            },
            disableFlip: false,
          },
          onSuccessCallback,
          onDecodeErrorCallback
        )
        .catch((e) => console.error(e));
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
        <h3 className="self-center align-middle">{scannerState}</h3>
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
                className="mb-1 mt-1 w-full break-all border-2 px-1"
              >
                Device {index + 1} : {label}
              </button>
            ))
          : null}
      </div>
      <h1 key={scannedEAN}>
        {scannedEAN &&
          `Barcode scanned ${scannedEAN.slice(0, 3)} ${scannedEAN.slice(3)}`}
      </h1>
      <div className="flex h-auto w-60 align-middle md:w-[300px] lg:w-[400px]">
        <div id="scanner-region" className="w-full resize-none" />
      </div>

      {product && (
        <ProductPlainText
          product={{
            id: 98719287391,
            title: "string",
            description: "string",
            price: 999,
            discountPercentage: 10,
            rating: 4.3,
            stock: 9999,
            brand: "string",
            category: "string",
            thumbnail: "string",
            images: ["123"],
          }}
        />
      )}
    </div>
  );
};

BarcodeScanner.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default BarcodeScanner;
