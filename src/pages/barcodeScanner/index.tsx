import {
  type CameraDevice,
  Html5Qrcode,
  type Html5QrcodeScannerState,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";
import Image from "next/image";
import React, { type ReactElement, useEffect, useState } from "react";
import Layout from "~/layouts/productDetailLayout";
import { type DemoProduct } from "~/server/api/routers/demoController";
import { api } from "~/utils/api";
import { demoEANID, getRandomImage } from "~/utils/helper";
import { type NextPageWithLayout } from "../_app";

const BarcodeScanner: NextPageWithLayout = () => {
  const [isScannerPaused, setIsScannerPaused] = useState(false);
  const [scannerState, setScannerState] = useState<Html5QrcodeScannerState>();

  const [camerasAvailable, setCamerasAvailable] = useState<CameraDevice[]>([]);
  const [cameraInUse, setCameraInUse] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        setCamerasAvailable([...camerasAvailable, ...gotCameras]);

        // console.log(...gotCameras);

        // const validCamera = gotCameras.filter(
        //   (gotCamera) => gotCamera.label === "FaceTime HD Camera"
        // );

        // function checkDuplicateCameras(id: string): CameraDevice {
        //   return { id: "string", label: "string" };
        // }

        // gotCameras.forEach((gotComera) => {
        //   setCamerasAvailable([
        //     ...camerasAvailable,
        //     ...camerasAvailable.filter((cameraAvailable) =>
        //       console.log(cameraAvailable.id !== gotComera.id)
        //     ),
        //   ]);
        // });
      }
    };

    void obtainCameras();
  }, [camerasAvailable]);

  useEffect(() => {
    const elementId = "scanner-region";
    const windowWidth = window.innerWidth;

    const eanScanner = new Html5Qrcode(elementId, {
      verbose: false,
      formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13],
    });

    try {
      void eanScanner.start(
        { deviceId: cameraInUse?.id },
        {
          fps: 4,
          aspectRatio: 1,
          qrbox: {
            width: windowWidth * 0.9,
            height: windowWidth * 0.39,
          },
          disableFlip: false,
        },
        (decodedText, decodedResult) => {
          setScannerState(eanScanner.getState());

          console.log(JSON.stringify(decodedResult, null, 2));
          setScannedEAN(decodedText);

          eanScanner.stop().catch((e) => console.error(e));
          setIsScannerPaused(true);
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
  }, [cameraInUse]);

  const handleVideoSourceChange = async (deviceId: string) => {
    try {
      setIsLoading(true);

      const constraints = {
        video: {
          deviceId: { exact: deviceId },
          aspectRatio: 1,
        },
        audio: true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      setCameraInUse(stream);
      setIsLoading(false);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      setIsLoading(false);
    }
  };

  if (productError) {
    return <h1>Error occurred during fetching</h1>;
  }

  return (
    <div>
      <div className="flex justify-between bg-slate-900 px-4 py-1">
        <h2 className="self-center align-middle">
          {isScannerPaused ? "Scan paused" : "Awaiting valid barcodes"}
        </h2>
        <h3>{scannerState}</h3>
        <button
          disabled={!isScannerPaused}
          onClick={() => {
            setIsScannerPaused(false);
            setScannedEAN(null);
          }}
          className="rounded-md border-2 border-solid border-slate-200 px-2 py-1 text-slate-200 disabled:border-green-800 disabled:text-green-800 "
        >
          {isScannerPaused ? "Scan Again" : "Scanning"}
        </button>
      </div>
      <div className="flex-row items-center justify-center gap-1 ">
        {camerasAvailable.length > 0
          ? camerasAvailable.map(({ id, label }, index) => (
              <button
                key={id + index}
                onClick={() => void handleVideoSourceChange(id)}
                className="mb-1 mt-1 break-all border-2 px-1"
              >
                Device {index + 1} : {label}
              </button>
            ))
          : null}
      </div>
      <h1 key={scannedEAN}>
        {scannedEAN ?? `This is my scanner ${cameraInUse?.id}`}
      </h1>
      {isLoading && <div className="loading-spinner"></div>}
      <div
        key={cameraInUse?.id}
        id="scanner-region"
        className="w-screen resize-none"
      />
      {product ? <ProductPlainText product={product} /> : null}
    </div>
  );
};

type ProductPlainTextProps = {
  product: DemoProduct;
};

function ProductPlainText({ product }: ProductPlainTextProps) {
  const {
    id,
    title,
    description,
    price,
    discountPercentage,
    rating,
    stock,
    brand,
    category,
    thumbnail,
    images,
  } = product;

  return (
    <div key={id}>
      <div className={"flex items-center justify-around "}>
        <h1>{title}</h1>
        <Image
          src={getRandomImage(images)}
          alt={"product Image"}
          loading="lazy"
          sizes="10vw"
          fill
        />
      </div>
      <h2>{brand}</h2>
      <p>USD${price}</p>
      <p className="break-words text-xs font-thin">{description}</p>
    </div>
  );
}

BarcodeScanner.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default BarcodeScanner;
