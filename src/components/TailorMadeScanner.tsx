import { useEffect, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { demoEANID } from "../utils/helper";

import { api } from "~/utils/api";

function TailorMadeScanner({ stream }: { stream: MediaStream }) {
  const [scannedEAN, setScannedEAN] = useState<string | null>(null);
  const [isScannerPaused, setIsScannerPaused] = useState(false);

  const { data: product } = api.demo.getDesired.useQuery(
    {
      id: demoEANID(scannedEAN ?? ""),
    },
    { refetchOnWindowFocus: false }
  );

  console.log(JSON.stringify(stream, null, 2));

  useEffect(() => {
    const windowWidth = window.innerWidth;

    const myEANScanner = new Html5Qrcode("scanner", {
      verbose: false,
      formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13],
    });

    if (!isScannerPaused) {
      myEANScanner
        .start(
          {
            deviceId: stream.id,
          },
          {
            fps: 10, // Optional, frame per seconds for qr code scanning
            // qrbox: { width: 180, height: 130 },
            aspectRatio: 1,
          },
          (decodedText, decodedResult) => {
            console.log(JSON.stringify(decodedResult, null, 2));
            setScannedEAN(decodedText);
            myEANScanner.stop().catch((e) => console.error(e));
            setIsScannerPaused(true);
          },
          (errorMessage) => {
            throw new Error(`from starting, ${errorMessage}`);
          }
        )
        .catch((err) => {
          console.error("Error on initiating camera", err);
        });
    }

    return () => {
      if (myEANScanner.isScanning) {
        myEANScanner.stop().catch(() => {
          return;
        });
      }
    };
  }, [isScannerPaused, stream]);

  return (
    <>
      <div className="flex justify-between">
        <h1 key={scannedEAN}>{scannedEAN ?? `This is my scanner`}</h1>
        <h2>{isScannerPaused ? "Scan paused" : "Awaiting valid barcodes"}</h2>
        <button
          disabled={!isScannerPaused}
          onClick={() => {
            setIsScannerPaused(false);
            setScannedEAN(null);
          }}
        >
          Toggle
        </button>
      </div>
      <div id="scanner" className=" w-full resize-none" />
      <div id="capturedImage" />
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
