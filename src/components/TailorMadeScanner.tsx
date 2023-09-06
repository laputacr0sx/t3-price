import { useEffect, useState } from "react";
import {
  type CameraDevice,
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";
import { demoEANID } from "../utils/helper";
import { type TailorMadeScannerProp } from "~/types/allTypes";
import { api } from "~/utils/api";

function TailorMadeScanner({}: TailorMadeScannerProp) {
  const [cameraList, setCameraList] = useState<CameraDevice[] | null>(null);
  const [camera, setCamera] = useState<CameraDevice>();
  const [scannedEAN, setScannedEAN] = useState<string | undefined>("");
  const [isScannerPaused, setIsScannerPaused] = useState(false);

  const { data: product } = api.demo.getDesired.useQuery({
    id: demoEANID(scannedEAN ?? ""),
  });

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices?.length) {
          setCameraList(devices);
          setCamera(devices?.[0]);
        }
      })
      .catch((err: Error) => {
        throw new Error(err.message);
      });

    const myEANScanner = new Html5Qrcode("scanner", {
      verbose: false,
      formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13],
    });

    if (!isScannerPaused)
      myEANScanner
        .start(
          {
            facingMode: "environment",
          },
          {
            fps: 4, // Optional, frame per seconds for qr code scanning
            // qrbox: { width: 280, height: 170 },
            aspectRatio: 1.7778,
          },
          (decodedText, decodedResult) => {
            setScannedEAN(demoEANID(decodedText));
            myEANScanner
              .stop()
              .then()
              .catch((e) => console.error(e));
            setIsScannerPaused(true);
          },
          (errorMessage) => {
            throw new Error(errorMessage);
          }
        )
        .catch((err) => {
          console.error(err);
        });

    return () => {
      if (myEANScanner.isScanning) {
        myEANScanner.stop().catch(() => {
          return;
        });
      }
    };
  }, [isScannerPaused]);

  return (
    <>
      <div className="flex justify-between">
        <h1>This is my scanner</h1>
        <button
          disabled={!isScannerPaused}
          onClick={() => {
            setIsScannerPaused(false);
          }}
        >
          Toggle
        </button>
      </div>
      <div id="scanner" className="w-screen lg:w-[40vw]" />
      <div id="capturedImage" />

      {cameraList?.map((camera) => (
        <div className="break-words" key={camera.id}>
          <h2>{camera.label}</h2>
          <p className="text-xs font-thin ">{camera.id}</p>
        </div>
      ))}
      {product ? (
        <div>
          <h3>{product.title}</h3>
          <p className="break-words text-xs font-thin">{product.description}</p>
        </div>
      ) : null}
    </>
  );
}

export default TailorMadeScanner;
